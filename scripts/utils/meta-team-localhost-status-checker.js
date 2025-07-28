/**
 * Meta Team Localhost Status Checker
 * Checks current localhost development environment status and provides URLs
 */

const { ClaudeCodeAPI } = require('./utils/claude-code-api-fix.js');
const { TeamActivityTracker } = require('./utils/team-activity-tracker.js');
const { ComprehensiveErrorHandler } = require('./utils/comprehensive-error-handler.js');
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

class MetaTeamLocalhostStatusChecker {
    constructor() {
        this.claudeAPI = new ClaudeCodeAPI();
        this.activityTracker = new TeamActivityTracker();
        this.errorHandler = new ComprehensiveErrorHandler();
        this.localhostStatus = {
            timestamp: new Date().toISOString(),
            availableUrls: [],
            runningServices: [],
            demoEnvironment: {},
            setupInstructions: {}
        };
    }

    async checkLocalhostStatus() {
        console.log('🌐 META TEAM LOCALHOST STATUS CHECK');
        console.log('===================================');
        console.log('Checking current localhost development environment');
        console.log('');

        try {
            // Track activity
            this.activityTracker.logActivity('Meta Team', 'Localhost Check', 'Checking localhost development environment status');

            // Check for existing servers
            await this.checkRunningServices();
            
            // Check for configuration files
            await this.checkConfigurationFiles();
            
            // Check for demo environment setup
            await this.checkDemoEnvironment();
            
            // Generate setup instructions
            await this.generateSetupInstructions();
            
            // Display results
            await this.displayResults();
            
            console.log('✅ Localhost Status Check Completed!');
            
        } catch (error) {
            this.errorHandler.handleError('MetaTeamLocalhostStatusChecker', error);
        }
    }

    async checkRunningServices() {
        console.log('🔍 CHECKING RUNNING SERVICES');
        console.log('============================');
        console.log('Product Manager: Checking what services are currently running');
        console.log('');

        const commonPorts = [3000, 8000, 8080, 5000, 4000, 5432, 27017];
        const runningServices = [];

        for (const port of commonPorts) {
            const isRunning = await this.checkPort(port);
            if (isRunning) {
                runningServices.push({
                    port: port,
                    url: `http://localhost:${port}`,
                    service: this.identifyService(port)
                });
            }
        }

        this.localhostStatus.runningServices = runningServices;

        if (runningServices.length > 0) {
            console.log('✅ Currently Running Services:');
            runningServices.forEach(service => {
                console.log(`   • ${service.service} - ${service.url}`);
            });
        } else {
            console.log('❌ No services currently running on common ports');
        }
        console.log('');
    }

    async checkPort(port) {
        return new Promise((resolve) => {
            const req = http.request({
                hostname: 'localhost',
                port: port,
                path: '/',
                method: 'GET',
                timeout: 2000
            }, (res) => {
                resolve(true);
            });

            req.on('error', () => {
                resolve(false);
            });

            req.on('timeout', () => {
                req.destroy();
                resolve(false);
            });

            req.end();
        });
    }

    identifyService(port) {
        const serviceMap = {
            3000: 'Frontend (React/Vue)',
            8000: 'Backend API',
            8080: 'Alternative Backend',
            5000: 'Development Server',
            4000: 'Alternative Frontend',
            5432: 'PostgreSQL Database',
            27017: 'MongoDB Database'
        };
        return serviceMap[port] || 'Unknown Service';
    }

    async checkConfigurationFiles() {
        console.log('📁 CHECKING CONFIGURATION FILES');
        console.log('==============================');
        console.log('Product Manager: Checking for development configuration files');
        console.log('');

        const configFiles = [
            'package.json',
            'server.js',
            'server.py',
            'docker-compose.yml',
            '.env',
            '.env.example',
            'README.md'
        ];

        const foundFiles = [];
        const missingFiles = [];

        for (const file of configFiles) {
            if (fs.existsSync(file)) {
                foundFiles.push(file);
            } else {
                missingFiles.push(file);
            }
        }

        console.log('✅ Found Configuration Files:');
        foundFiles.forEach(file => {
            console.log(`   • ${file}`);
        });
        console.log('');

        if (missingFiles.length > 0) {
            console.log('❌ Missing Configuration Files:');
            missingFiles.forEach(file => {
                console.log(`   • ${file}`);
            });
            console.log('');
        }

        // Check package.json for scripts
        if (fs.existsSync('package.json')) {
            try {
                const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
                if (packageJson.scripts) {
                    console.log('📋 Available npm scripts:');
                    Object.keys(packageJson.scripts).forEach(script => {
                        console.log(`   • npm run ${script}`);
                    });
                    console.log('');
                }
            } catch (error) {
                console.log('⚠️ Could not parse package.json');
            }
        }
    }

    async checkDemoEnvironment() {
        console.log('🎯 CHECKING DEMO ENVIRONMENT');
        console.log('============================');
        console.log('Product Manager: Checking demo environment setup');
        console.log('');

        this.localhostStatus.demoEnvironment = {
            frontend: 'http://localhost:3000',
            backend: 'http://localhost:8000',
            database: 'localhost:5432',
            documentation: 'http://localhost:3000/docs',
            status: 'Not Running'
        };

        // Check if demo files exist
        const demoFiles = [
            'demos/CEO_DEMO_PLAN.md',
            'demos/setup-ceo-demo.sh',
            'demos/create-demo-data.sh'
        ];

        const existingDemoFiles = demoFiles.filter(file => fs.existsSync(file));

        console.log('📄 Demo Environment Files:');
        if (existingDemoFiles.length > 0) {
            existingDemoFiles.forEach(file => {
                console.log(`   ✅ ${file}`);
            });
        } else {
            console.log('   ❌ No demo files found');
        }
        console.log('');

        console.log('🌐 Demo Environment URLs:');
        console.log(`   • Frontend: ${this.localhostStatus.demoEnvironment.frontend}`);
        console.log(`   • Backend: ${this.localhostStatus.demoEnvironment.backend}`);
        console.log(`   • Database: ${this.localhostStatus.demoEnvironment.database}`);
        console.log(`   • Documentation: ${this.localhostStatus.demoEnvironment.documentation}`);
        console.log('');
    }

    async generateSetupInstructions() {
        console.log('🔧 GENERATING SETUP INSTRUCTIONS');
        console.log('===============================');
        console.log('Product Manager: Creating setup instructions for localhost');
        console.log('');

        this.localhostStatus.setupInstructions = {
            quickStart: [
                '1. Check if Node.js is installed: node --version',
                '2. Install dependencies: npm install',
                '3. Set up environment variables: cp .env.example .env',
                '4. Start backend server: npm run dev:backend',
                '5. Start frontend server: npm run dev:frontend',
                '6. Access the application at http://localhost:3000'
            ],
            demoSetup: [
                '1. Run demo setup script: ./demos/setup-ceo-demo.sh',
                '2. Create demo data: ./demos/create-demo-data.sh',
                '3. Access demo at http://localhost:3000',
                '4. Use demo credentials from demo data script'
            ],
            troubleshooting: [
                '• Check if ports 3000 and 8000 are available',
                '• Ensure all dependencies are installed',
                '• Check environment variables are set correctly',
                '• Verify database connection if using local database'
            ]
        };

        console.log('📋 Setup Instructions Generated');
        console.log('');
    }

    async displayResults() {
        console.log('📊 LOCALHOST STATUS SUMMARY');
        console.log('============================');
        console.log('Product Manager: Here\'s the current localhost status');
        console.log('');

        // Current Status
        if (this.localhostStatus.runningServices.length > 0) {
            console.log('✅ CURRENTLY RUNNING:');
            this.localhostStatus.runningServices.forEach(service => {
                console.log(`   🌐 ${service.service}: ${service.url}`);
            });
            console.log('');
        } else {
            console.log('❌ NO SERVICES RUNNING');
            console.log('   You need to start the development servers');
            console.log('');
        }

        // Available URLs
        console.log('🌐 AVAILABLE URLs (when running):');
        console.log(`   • Frontend: ${this.localhostStatus.demoEnvironment.frontend}`);
        console.log(`   • Backend API: ${this.localhostStatus.demoEnvironment.backend}`);
        console.log(`   • Documentation: ${this.localhostStatus.demoEnvironment.documentation}`);
        console.log('');

        // Quick Start Instructions
        console.log('🚀 QUICK START:');
        this.localhostStatus.setupInstructions.quickStart.forEach(step => {
            console.log(`   ${step}`);
        });
        console.log('');

        // Demo Setup
        console.log('🎯 FOR CEO DEMO:');
        this.localhostStatus.setupInstructions.demoSetup.forEach(step => {
            console.log(`   ${step}`);
        });
        console.log('');

        // Troubleshooting
        console.log('🔧 TROUBLESHOOTING:');
        this.localhostStatus.setupInstructions.troubleshooting.forEach(tip => {
            console.log(`   ${tip}`);
        });
        console.log('');

        // Next Steps
        console.log('📋 NEXT STEPS:');
        if (this.localhostStatus.runningServices.length === 0) {
            console.log('   1. Start the development servers');
            console.log('   2. Access the application at http://localhost:3000');
            console.log('   3. Test the authentication system');
            console.log('   4. Prepare for CEO demo');
        } else {
            console.log('   1. Access the running application');
            console.log('   2. Test the current functionality');
            console.log('   3. Prepare demo data and scenarios');
            console.log('   4. Rehearse CEO demo presentation');
        }
        console.log('');
    }
}

// Run the localhost status checker
const checker = new MetaTeamLocalhostStatusChecker();
checker.checkLocalhostStatus().catch(console.error); 