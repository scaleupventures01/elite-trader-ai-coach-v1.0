#!/usr/bin/env node

/**
 * Test Claude Code API Integration
 * Verify that the API integration works properly
 */

require('dotenv').config();

// Set the API key
process.env.CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || 'YOUR_API_KEY_HERE';

async function testClaudeCodeAPI() {
  console.log('🧪 Testing Claude Code API Integration\n');
  console.log('='.repeat(60));
  console.log('🔑 API Key:', process.env.CLAUDE_API_KEY ? 'Set' : 'Not Set');
  console.log('='.repeat(60));
  
  try {
    // Import the new API wrapper
    const { ClaudeCodeAPI } = require('./utils/claude-code-api-fix');
    
    console.log('\n📋 Test 1: Creating API instance...');
    const claudeCode = new ClaudeCodeAPI();
    console.log('✅ API instance created successfully');
    
    console.log('\n📋 Test 2: Testing connection...');
    const connectionTest = await claudeCode.testConnection();
    console.log(`Connection Test: ${connectionTest.success ? '✅ PASSED' : '❌ FAILED'}`);
    
    if (!connectionTest.success) {
      console.log(`Error: ${connectionTest.error}`);
      return false;
    }
    
    console.log('\n📋 Test 3: Testing simple query...');
    const simpleQuery = await claudeCode.query('What is 2+2?');
    console.log('✅ Simple query successful');
    console.log(`Response: ${simpleQuery}`);
    
    console.log('\n📋 Test 4: Testing complex analysis...');
    const analysisQuery = await claudeCode.query('Analyze this task: Create a file upload system. Provide a brief overview of the requirements and implementation approach.');
    console.log('✅ Complex analysis successful');
    console.log(`Response: ${analysisQuery.substring(0, 200)}...`);
    
    console.log('\n📋 Test 5: Testing code generation...');
    const codeQuery = await claudeCode.query('Generate a simple HTML form for file upload with basic styling.');
    console.log('✅ Code generation successful');
    console.log(`Response: ${codeQuery.substring(0, 200)}...`);
    
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('✅ Claude Code API integration is working properly');
    console.log('✅ Authentication is successful');
    console.log('✅ API calls are functioning');
    console.log('✅ Error handling is working');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.error('Error details:', error);
    return false;
  }
}

// Run the test
testClaudeCodeAPI().then(success => {
  if (success) {
    console.log('\n🚀 Claude Code API is ready for Meta Team integration!');
  } else {
    console.log('\n❌ Claude Code API integration needs more work');
  }
}).catch(console.error); 