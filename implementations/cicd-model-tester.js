/**
 * CI/CD Model Testing Script
 * Automated testing for Claude model availability and performance
 * Created: 2025-07-28T02:35:06.601Z
 */

const { ClaudeCodeAPI } = require('../utils/claude-code-api-fix.js');
const fs = require('fs');
const path = require('path');

class CICDModelTester {
    constructor() {
        this.claudeAPI = new ClaudeCodeAPI();
        this.testResults = {
            timestamp: new Date().toISOString(),
            tests: [],
            summary: {
                total: 0,
                passed: 0,
                failed: 0
            }
        };
    }

    async runAllTests() {
        console.log('🧪 Running CI/CD Model Tests');
        console.log('============================');
        
        await this.testModelAvailability();
        await this.testConfiguration();
        await this.testPerformance();
        await this.testSecurity();
        
        this.generateTestReport();
        
        // Exit with appropriate code
        const exitCode = this.testResults.summary.failed > 0 ? 1 : 0;
        process.exit(exitCode);
    }

    async testModelAvailability() {
        console.log('📡 Testing Model Availability...');
        
        try {
            const prompt = 'Test query for model availability';
            const response = await this.claudeAPI.query(prompt);
            
            this.addTestResult('Model Availability', 'PASSED', 'Model query successful');
        } catch (error) {
            this.addTestResult('Model Availability', 'FAILED', error.message);
        }
    }

    async testConfiguration() {
        console.log('⚙️ Testing Configuration...');
        
        try {
            const config = require('../config/claude-code-config.js');
            
            if (config.defaultModel && config.models) {
                this.addTestResult('Configuration', 'PASSED', 'Configuration is valid');
            } else {
                this.addTestResult('Configuration', 'FAILED', 'Configuration is invalid');
            }
        } catch (error) {
            this.addTestResult('Configuration', 'FAILED', error.message);
        }
    }

    async testPerformance() {
        console.log('⚡ Testing Performance...');
        
        try {
            const startTime = Date.now();
            const prompt = 'Performance test query';
            await this.claudeAPI.query(prompt);
            const endTime = Date.now();
            
            const responseTime = endTime - startTime;
            
            if (responseTime < 10000) { // 10 seconds
                this.addTestResult('Performance', 'PASSED', 'Response time: ' + responseTime + 'ms');
            } else {
                this.addTestResult('Performance', 'FAILED', 'Response time too slow: ' + responseTime + 'ms');
            }
        } catch (error) {
            this.addTestResult('Performance', 'FAILED', error.message);
        }
    }

    async testSecurity() {
        console.log('🔒 Testing Security...');
        
        try {
            const config = require('../config/claude-code-config.js');
            
            // Check if API key is not exposed in config
            if (config.apiKey === process.env.CLAUDE_API_KEY) {
                this.addTestResult('Security', 'PASSED', 'API key properly secured');
            } else {
                this.addTestResult('Security', 'FAILED', 'API key exposed in configuration');
            }
        } catch (error) {
            this.addTestResult('Security', 'FAILED', error.message);
        }
    }

    addTestResult(name, status, details) {
        this.testResults.tests.push({
            name,
            status,
            details,
            timestamp: new Date().toISOString()
        });
        
        this.testResults.summary.total++;
        if (status === 'PASSED') {
            this.testResults.summary.passed++;
        } else {
            this.testResults.summary.failed++;
        }
        
        console.log('   ' + (status === 'PASSED' ? '✅' : '❌') + ' ' + name + ': ' + status);
    }

    generateTestReport() {
        console.log('\n📊 Test Results Summary');
        console.log('=======================');
        console.log('Total Tests: ' + this.testResults.summary.total);
        console.log('Passed: ' + this.testResults.summary.passed);
        console.log('Failed: ' + this.testResults.summary.failed);
        
        // Save test report
        const reportDir = path.join(__dirname, '..', 'reports');
        if (!fs.existsSync(reportDir)) {
            fs.mkdirSync(reportDir, { recursive: true });
        }
        
        const reportPath = path.join(reportDir, 'cicd-test-report-' + new Date().toISOString().replace(/[:.]/g, '-') + '.json');
        fs.writeFileSync(reportPath, JSON.stringify(this.testResults, null, 2));
        
        console.log('📄 Test report saved: ' + reportPath);
    }
}

// Run tests if called directly
if (require.main === module) {
    const tester = new CICDModelTester();
    tester.runAllTests().catch(console.error);
}

module.exports = CICDModelTester;
