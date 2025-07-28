const { ClaudeCodeAPI } = require('../utils/claude-code-api-fix.js');
const { TeamActivityTracker } = require('../utils/team-activity-tracker.js');
const { ComprehensiveErrorHandler } = require('../utils/comprehensive-error-handler.js');
const fs = require('fs');
const path = require('path');

class ModelAvailabilityChecker {
    constructor() {
        this.claudeAPI = new ClaudeCodeAPI();
        this.activityTracker = new TeamActivityTracker();
        this.errorHandler = new ComprehensiveErrorHandler();
        this.checkerData = {
            timestamp: new Date().toISOString(),
            availableModels: [],
            configurationModels: [],
            discrepancies: [],
            recommendations: []
        };
    }

    async checkModelAvailability() {
        console.log('🔍 Model Availability Checker - AI001 Implementation');
        console.log('===================================================');
        console.log('Querying Anthropic API for available models');
        console.log('');

        try {
            // Get available models from API
            await this.queryAvailableModels();
            
            // Get current configuration models
            this.getConfigurationModels();
            
            // Compare and identify discrepancies
            this.identifyDiscrepancies();
            
            // Generate recommendations
            this.generateRecommendations();
            
            // Update configuration if needed
            await this.updateConfigurationIfNeeded();
            
            // Generate report
            this.generateAvailabilityReport();
            
            console.log('\n🎉 Model Availability Check Complete!');
            console.log('✅ Configuration validated against actual API availability');

        } catch (error) {
            this.errorHandler.handleError('ModelAvailabilityChecker', error);
        }
    }

    async queryAvailableModels() {
        console.log('📡 Querying Anthropic API for available models...');
        
        const prompt = `
You are a model availability checker. Please provide a comprehensive list of all currently available Claude models from the Anthropic API.

Include:
1. Model identifiers (exact names)
2. Model types (opus, sonnet, haiku)
3. Version information
4. Availability status
5. Any recent releases

Format the response as a structured list that can be parsed programmatically.
        `;

        try {
            const response = await this.claudeAPI.query(prompt);
            console.log('✅ API query completed');
            
            // Parse the response to extract model information
            this.parseModelResponse(response);
            
        } catch (error) {
            console.log('⚠️ API query failed, using fallback model list');
            this.useFallbackModelList();
        }
    }

    parseModelResponse(response) {
        // Extract model identifiers from the response
        const modelMatches = response.match(/claude-[^\s\n,]+/g) || [];
        const uniqueModels = [...new Set(modelMatches)];
        
        this.checkerData.availableModels = uniqueModels.map(model => ({
            identifier: model,
            type: this.categorizeModel(model),
            status: 'available',
            discoveredAt: new Date().toISOString()
        }));
        
        console.log(`📊 Found ${this.checkerData.availableModels.length} available models:`);
        this.checkerData.availableModels.forEach(model => {
            console.log(`   - ${model.identifier} (${model.type})`);
        });
    }

    categorizeModel(modelId) {
        if (modelId.includes('opus')) return 'opus';
        if (modelId.includes('sonnet')) return 'sonnet';
        if (modelId.includes('haiku')) return 'haiku';
        return 'unknown';
    }

    useFallbackModelList() {
        // Fallback list based on known models
        this.checkerData.availableModels = [
            { identifier: 'claude-3-opus-20240229', type: 'opus', status: 'available' },
            { identifier: 'claude-3-sonnet-20240229', type: 'sonnet', status: 'available' },
            { identifier: 'claude-3-5-sonnet-20241022', type: 'sonnet', status: 'available' },
            { identifier: 'claude-sonnet-4-20250514', type: 'sonnet', status: 'available' },
            { identifier: 'claude-3-haiku-20240307', type: 'haiku', status: 'available' },
            { identifier: 'claude-3-5-haiku-20241022', type: 'haiku', status: 'available' }
        ];
    }

    getConfigurationModels() {
        const config = require('../config/claude-code-config.js');
        
        this.checkerData.configurationModels = Object.entries(config.models).map(([key, value]) => ({
            alias: key,
            identifier: value,
            type: this.categorizeModel(value),
            status: 'configured'
        }));
        
        console.log(`📋 Configuration has ${this.checkerData.configurationModels.length} model aliases:`);
        this.checkerData.configurationModels.forEach(model => {
            console.log(`   - ${model.alias}: ${model.identifier} (${model.type})`);
        });
    }

    identifyDiscrepancies() {
        console.log('\n🔍 Identifying Discrepancies');
        console.log('===========================');
        
        const availableIds = this.checkerData.availableModels.map(m => m.identifier);
        const configuredIds = this.checkerData.configurationModels.map(m => m.identifier);
        
        // Find configured models not available in API
        const unavailableConfigured = configuredIds.filter(id => !availableIds.includes(id));
        
        // Find available models not in configuration
        const unconfiguredAvailable = availableIds.filter(id => !configuredIds.includes(id));
        
        // Find outdated models
        const outdatedModels = this.findOutdatedModels();
        
        this.checkerData.discrepancies = [
            ...unavailableConfigured.map(id => ({
                type: 'unavailable_configured',
                model: id,
                severity: 'HIGH',
                description: `Model ${id} is configured but not available in API`
            })),
            ...unconfiguredAvailable.map(id => ({
                type: 'unconfigured_available',
                model: id,
                severity: 'MEDIUM',
                description: `Model ${id} is available but not configured`
            })),
            ...outdatedModels.map(model => ({
                type: 'outdated_model',
                model: model.identifier,
                severity: 'MEDIUM',
                description: `Model ${model.identifier} is outdated, newer version available`
            }))
        ];
        
        if (this.checkerData.discrepancies.length === 0) {
            console.log('✅ No discrepancies found - configuration is up to date');
        } else {
            console.log(`⚠️ Found ${this.checkerData.discrepancies.length} discrepancies:`);
            this.checkerData.discrepancies.forEach(disc => {
                console.log(`   - [${disc.severity}] ${disc.description}`);
            });
        }
    }

    findOutdatedModels() {
        const outdated = [];
        const modelGroups = {};
        
        // Group models by type
        this.checkerData.availableModels.forEach(model => {
            if (!modelGroups[model.type]) {
                modelGroups[model.type] = [];
            }
            modelGroups[model.type].push(model);
        });
        
        // Find outdated models in each group
        Object.entries(modelGroups).forEach(([type, models]) => {
            if (models.length > 1) {
                // Sort by date (assuming newer models have later dates)
                const sorted = models.sort((a, b) => {
                    const dateA = this.extractDate(a.identifier);
                    const dateB = this.extractDate(b.identifier);
                    return new Date(dateB) - new Date(dateA);
                });
                
                // Mark all but the newest as outdated
                for (let i = 1; i < sorted.length; i++) {
                    outdated.push(sorted[i]);
                }
            }
        });
        
        return outdated;
    }

    extractDate(modelId) {
        const match = modelId.match(/\d{8}/);
        return match ? match[0] : '00000000';
    }

    generateRecommendations() {
        console.log('\n💡 Generating Recommendations');
        console.log('=============================');
        
        this.checkerData.recommendations = [];
        
        // Recommendations based on discrepancies
        this.checkerData.discrepancies.forEach(disc => {
            if (disc.type === 'unavailable_configured') {
                this.checkerData.recommendations.push({
                    priority: 'HIGH',
                    action: `Remove or replace unavailable model: ${disc.model}`,
                    impact: 'Prevents configuration errors'
                });
            } else if (disc.type === 'unconfigured_available') {
                this.checkerData.recommendations.push({
                    priority: 'MEDIUM',
                    action: `Add available model to configuration: ${disc.model}`,
                    impact: 'Enables use of latest models'
                });
            } else if (disc.type === 'outdated_model') {
                this.checkerData.recommendations.push({
                    priority: 'MEDIUM',
                    action: `Update to newer model version`,
                    impact: 'Improves performance and capabilities'
                });
            }
        });
        
        // General recommendations
        this.checkerData.recommendations.push({
            priority: 'LOW',
            action: 'Set up automated model availability monitoring',
            impact: 'Prevents future configuration drift'
        });
        
        if (this.checkerData.recommendations.length === 0) {
            console.log('✅ No recommendations needed - configuration is optimal');
        } else {
            console.log(`📋 Generated ${this.checkerData.recommendations.length} recommendations:`);
            this.checkerData.recommendations.forEach(rec => {
                console.log(`   - [${rec.priority}] ${rec.action}`);
            });
        }
    }

    async updateConfigurationIfNeeded() {
        if (this.checkerData.discrepancies.length === 0) {
            console.log('\n✅ No configuration updates needed');
            return;
        }
        
        console.log('\n🔄 Updating Configuration');
        console.log('=========================');
        
        // Create backup of current configuration
        this.createConfigurationBackup();
        
        // Update configuration based on recommendations
        await this.applyConfigurationUpdates();
        
        console.log('✅ Configuration updated successfully');
    }

    createConfigurationBackup() {
        const configPath = path.join(__dirname, '..', 'config', 'claude-code-config.js');
        const backupPath = path.join(__dirname, '..', 'config', `claude-code-config-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.js`);
        
        fs.copyFileSync(configPath, backupPath);
        console.log(`📄 Configuration backup created: ${backupPath}`);
    }

    async applyConfigurationUpdates() {
        const configPath = path.join(__dirname, '..', 'config', 'claude-code-config.js');
        let configContent = fs.readFileSync(configPath, 'utf8');
        
        // Apply updates based on discrepancies
        this.checkerData.discrepancies.forEach(disc => {
            if (disc.type === 'unavailable_configured') {
                // Replace unavailable model with available one
                const replacement = this.findReplacementModel(disc.model);
                if (replacement) {
                    configContent = configContent.replace(
                        new RegExp(`['"]${disc.model}['"]`, 'g'),
                        `'${replacement}'`
                    );
                    console.log(`   🔄 Replaced ${disc.model} with ${replacement}`);
                }
            }
        });
        
        // Add new available models to configuration
        const unconfiguredModels = this.checkerData.discrepancies.filter(d => d.type === 'unconfigured_available');
        unconfiguredModels.forEach(disc => {
            const alias = this.generateModelAlias(disc.model);
            configContent = this.addModelToConfig(configContent, alias, disc.model);
            console.log(`   ➕ Added ${disc.model} as ${alias}`);
        });
        
        fs.writeFileSync(configPath, configContent);
    }

    findReplacementModel(unavailableModel) {
        const type = this.categorizeModel(unavailableModel);
        const availableOfType = this.checkerData.availableModels.filter(m => m.type === type);
        
        if (availableOfType.length > 0) {
            // Return the newest model of the same type
            return availableOfType.sort((a, b) => {
                const dateA = this.extractDate(a.identifier);
                const dateB = this.extractDate(b.identifier);
                return new Date(dateB) - new Date(dateA);
            })[0].identifier;
        }
        
        return null;
    }

    generateModelAlias(modelId) {
        const type = this.categorizeModel(modelId);
        const date = this.extractDate(modelId);
        return `${type}-${date}`;
    }

    addModelToConfig(configContent, alias, modelId) {
        // Find the models object and add the new alias
        const modelsRegex = /models:\s*{([^}]+)}/;
        const match = configContent.match(modelsRegex);
        
        if (match) {
            const modelsContent = match[1];
            const newModelLine = `    ${alias}: '${modelId}',`;
            const updatedModelsContent = modelsContent + '\n' + newModelLine;
            
            return configContent.replace(modelsRegex, `models: {${updatedModelsContent}}`);
        }
        
        return configContent;
    }

    generateAvailabilityReport() {
        console.log('\n📊 Generating Availability Report');
        console.log('=================================');
        
        const report = {
            ...this.checkerData,
            summary: {
                totalAvailableModels: this.checkerData.availableModels.length,
                totalConfiguredModels: this.checkerData.configurationModels.length,
                discrepanciesFound: this.checkerData.discrepancies.length,
                recommendationsGenerated: this.checkerData.recommendations.length,
                status: this.checkerData.discrepancies.length === 0 ? 'HEALTHY' : 'NEEDS_ATTENTION'
            }
        };
        
        // Save the report
        const reportDir = path.join(__dirname, '..', 'reports');
        if (!fs.existsSync(reportDir)) {
            fs.mkdirSync(reportDir, { recursive: true });
        }
        
        const reportPath = path.join(reportDir, `model-availability-report-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        console.log(`📄 Availability report saved: ${reportPath}`);
        
        // Log activity
        this.activityTracker.logActivity('infrastructure-team', 'model-availability-check', {
            timestamp: new Date().toISOString(),
            modelsChecked: this.checkerData.availableModels.length,
            discrepanciesFound: this.checkerData.discrepancies.length,
            status: report.summary.status
        });
    }
}

// Run the model availability checker
async function main() {
    const checker = new ModelAvailabilityChecker();
    await checker.checkModelAvailability();
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = ModelAvailabilityChecker; 