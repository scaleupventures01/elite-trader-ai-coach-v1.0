/**
 * Configuration Validator
 * Validates configuration integrity and consistency
 * Created: 2025-07-28T02:35:06.599Z
 */

const fs = require('fs');
const path = require('path');

class ConfigurationValidator {
    constructor() {
        this.configPath = path.join(__dirname, '..', 'config', 'claude-code-config.js');
    }

    validateConfiguration() {
        console.log('⚙️ Configuration Validation');
        console.log('===========================');
        
        const validationResults = {
            fileExists: this.checkFileExists(),
            syntaxValid: this.checkSyntax(),
            requiredFields: this.checkRequiredFields(),
            modelConsistency: this.checkModelConsistency(),
            versionAccuracy: this.checkVersionAccuracy()
        };
        
        this.generateValidationReport(validationResults);
    }

    checkFileExists() {
        return fs.existsSync(this.configPath);
    }

    checkSyntax() {
        try {
            require(this.configPath);
            return true;
        } catch (error) {
            return false;
        }
    }

    checkRequiredFields() {
        const config = require(this.configPath);
        const required = ['apiKey', 'endpoint', 'models', 'defaultModel'];
        return required.every(field => config.hasOwnProperty(field));
    }

    checkModelConsistency() {
        const config = require(this.configPath);
        return Object.values(config.models).every(model => 
            typeof model === 'string' && model.includes('claude-')
        );
    }

    checkVersionAccuracy() {
        const config = require(this.configPath);
        return config.version && config.lastUpdated;
    }

    generateValidationReport(results) {
        console.log('📊 Configuration validation completed');
    }
}

module.exports = ConfigurationValidator;
