#!/usr/bin/env node

/**
 * Claude Code Usage Tracker Test
 * Test the Claude Code usage tracking functionality
 */

const { claudeCodeTracker } = require('../utils/claude-code-usage-tracker');
const { ClaudeCodeAPI } = require('../utils/claude-code-api-fix');

async function testClaudeCodeUsageTracker() {
  console.log('🧪 Testing Claude Code Usage Tracker...\n');
  
  try {
    // Start a test session
    claudeCodeTracker.startSession('Claude Code Usage Test', 'Testing usage tracking with Claude Code API');
    
    const claudeCode = new ClaudeCodeAPI();
    
    // Test 1: Successful Claude Code call
    console.log('📋 Test 1: Successful Claude Code Call');
    try {
      const response = await claudeCode.query('What is 2+2?');
      console.log('✅ Claude Code call successful:', response.substring(0, 50) + '...');
    } catch (error) {
      console.log('❌ Claude Code call failed:', error.message);
    }
    
    // Test 2: Another successful call
    console.log('\n📋 Test 2: Another Claude Code Call');
    try {
      const response = await claudeCode.query('Generate a simple JavaScript function.');
      console.log('✅ Claude Code call successful:', response.substring(0, 50) + '...');
    } catch (error) {
      console.log('❌ Claude Code call failed:', error.message);
    }
    
    // Test 3: Record a fallback call
    console.log('\n📋 Test 3: Recording Fallback Call');
    claudeCodeTracker.recordFallbackCall('Manual code generation', 'API not available');
    
    // Test 4: Record a failed Claude Code call
    console.log('\n📋 Test 4: Recording Failed Claude Code Call');
    claudeCodeTracker.recordFailedClaudeCodeCall('Test prompt', new Error('Simulated API failure'), 5000);
    
    // End the session
    console.log('\n📋 Ending Session');
    const sessionResult = claudeCodeTracker.endSession();
    
    // Display global stats
    console.log('\n📋 Displaying Global Stats');
    claudeCodeTracker.displayGlobalStats();
    
    // Get retrospective data
    console.log('\n📋 Getting Retrospective Data');
    const retrospectiveData = claudeCodeTracker.getRetrospectiveData();
    console.log('Retrospective Data:', JSON.stringify(retrospectiveData, null, 2));
    
    console.log('🎉 Claude Code Usage Tracker Test Completed!');
    
  } catch (error) {
    console.error('❌ Claude Code usage tracker test failed:', error.message);
  }
}

if (require.main === module) {
  testClaudeCodeUsageTracker().catch(console.error);
}

module.exports = { testClaudeCodeUsageTracker }; 