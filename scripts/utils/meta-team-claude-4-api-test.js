/**
 * Claude Sonnet 4 API Test and Root Cause Analysis
 * Tests actual API availability and identifies why Claude 4 isn't working
 */

const https = require('https');

class Claude4APITest {
    constructor() {
        this.apiKey = process.env.CLAUDE_API_KEY;
        this.endpoint = 'https://api.anthropic.com/v1/messages';
        this.testModels = [
            'claude-sonnet-4-20250514',
            'claude-3-5-sonnet-20241022',
            'claude-3-sonnet-20240229'
        ];
    }

    async testModel(modelName) {
        return new Promise((resolve) => {
            const postData = JSON.stringify({
                model: modelName,
                max_tokens: 50,
                messages: [{
                    role: 'user',
                    content: 'Respond with just your model name and version.'
                }]
            });

            const options = {
                hostname: 'api.anthropic.com',
                port: 443,
                path: '/v1/messages',
                method: 'POST',
                headers: {
                    'x-api-key': this.apiKey,
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json',
                    'content-length': Buffer.byteLength(postData)
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve({
                        model: modelName,
                        statusCode: res.statusCode,
                        response: data,
                        success: res.statusCode === 200
                    });
                });
            });

            req.on('error', (error) => {
                resolve({
                    model: modelName,
                    statusCode: 0,
                    response: error.message,
                    success: false,
                    error: error
                });
            });

            req.write(postData);
            req.end();
        });
    }

    async runTests() {
        console.log('🔍 Claude Sonnet 4 API Test and Root Cause Analysis');
        console.log('==================================================');
        console.log('');

        if (!this.apiKey) {
            console.log('❌ ERROR: No API key found in environment');
            console.log('   Set CLAUDE_API_KEY environment variable');
            return;
        }

        console.log('🔑 API Key Status: ✅ Found');
        console.log('🔗 Testing models...');
        console.log('');

        const results = [];
        
        for (const model of this.testModels) {
            console.log(`🧪 Testing model: ${model}`);
            const result = await this.testModel(model);
            results.push(result);
            
            if (result.success) {
                console.log(`   ✅ SUCCESS (${result.statusCode})`);
                console.log(`   📝 Response: ${result.response.substring(0, 100)}...`);
            } else {
                console.log(`   ❌ FAILED (${result.statusCode})`);
                console.log(`   📝 Error: ${result.response}`);
            }
            console.log('');
        }

        this.analyzeResults(results);
    }

    analyzeResults(results) {
        console.log('📊 ANALYSIS RESULTS');
        console.log('==================');
        console.log('');

        const workingModels = results.filter(r => r.success);
        const failedModels = results.filter(r => !r.success);

        console.log(`✅ Working Models: ${workingModels.length}`);
        workingModels.forEach(model => {
            console.log(`   - ${model.model}`);
        });
        console.log('');

        console.log(`❌ Failed Models: ${failedModels.length}`);
        failedModels.forEach(model => {
            console.log(`   - ${model.model}: ${model.response}`);
        });
        console.log('');

        // Root Cause Analysis
        console.log('🔍 ROOT CAUSE ANALYSIS');
        console.log('=====================');
        console.log('');

        const claude4Model = results.find(r => r.model === 'claude-sonnet-4-20250514');
        const claude35Model = results.find(r => r.model === 'claude-3-5-sonnet-20241022');

        if (claude4Model && claude4Model.success) {
            console.log('✅ Claude Sonnet 4 (claude-sonnet-4-20250514) is WORKING');
            console.log('   This confirms the model is available and accessible');
        } else if (claude4Model && !claude4Model.success) {
            console.log('❌ Claude Sonnet 4 (claude-sonnet-4-20250514) is NOT WORKING');
            console.log(`   Error: ${claude4Model.response}`);
            
            if (claude4Model.response.includes('model_not_found')) {
                console.log('   🎯 ROOT CAUSE: Model does not exist in API');
                console.log('   💡 SOLUTION: Use available model like claude-3-5-sonnet-20241022');
            } else if (claude4Model.response.includes('authentication_error')) {
                console.log('   🎯 ROOT CAUSE: API key authentication issue');
                console.log('   💡 SOLUTION: Check API key validity and permissions');
            } else {
                console.log('   🎯 ROOT CAUSE: Unknown API error');
                console.log('   💡 SOLUTION: Check API documentation and status');
            }
        }

        if (claude35Model && claude35Model.success) {
            console.log('✅ Claude 3.5 Sonnet (claude-3-5-sonnet-20241022) is WORKING');
            console.log('   This is the current latest available model');
        }

        console.log('');
        console.log('📋 RECOMMENDATIONS');
        console.log('==================');
        console.log('');

        if (workingModels.length > 0) {
            const bestModel = workingModels[0];
            console.log(`1. ✅ Use working model: ${bestModel.model}`);
            console.log('2. 🔧 Update configuration to use working model');
            console.log('3. 📝 Update documentation to reflect actual model');
        } else {
            console.log('1. 🔑 Check API key validity and permissions');
            console.log('2. 🌐 Check Anthropic API status');
            console.log('3. 📚 Review API documentation for available models');
        }

        console.log('');
        console.log('🎯 CONCLUSION');
        console.log('=============');
        console.log('');

        if (workingModels.length > 0) {
            console.log('✅ Claude API is working with available models');
            console.log('   The issue is likely configuration or model selection');
        } else {
            console.log('❌ Claude API is not accessible');
            console.log('   Check API key, network, and service status');
        }
    }
}

// Run the test
const tester = new Claude4APITest();
tester.runTests().catch(console.error); 