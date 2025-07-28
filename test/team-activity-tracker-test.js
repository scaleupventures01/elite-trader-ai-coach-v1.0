#!/usr/bin/env node

/**
 * Team Activity Tracker Test
 * Test the team activity tracking functionality
 */

const { teamTracker } = require('../utils/team-activity-tracker');

async function testTeamActivityTracker() {
  console.log('🧪 Testing Team Activity Tracker...\n');
  
  try {
    // Test 1: Start Authentication Team Activity
    console.log('📋 Test 1: Starting Authentication Team Activity');
    teamTracker.startActivity('Authentication', 'AuthTester', 'Testing Claude Code authentication', 'Phase 1');
    
    // Simulate some work
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update activity
    teamTracker.updateActivity('Validating API keys', 'Phase 2');
    
    // Simulate more work
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Complete activity
    const authResult = teamTracker.completeActivity({ success: true, message: 'Authentication test passed' });
    console.log(`✅ Authentication activity completed: ${authResult.duration}ms\n`);
    
    // Test 2: Start Error Handling Team Activity
    console.log('📋 Test 2: Starting Error Handling Team Activity');
    teamTracker.startActivity('ErrorHandling', 'ErrorHandler', 'Implementing comprehensive error handling', 'Analysis');
    
    // Simulate work
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Fail activity (simulate error)
    const errorResult = teamTracker.failActivity('API connection timeout');
    console.log(`❌ Error handling activity failed: ${errorResult.duration}ms\n`);
    
    // Test 3: Start Testing Team Activity
    console.log('📋 Test 3: Starting Testing Team Activity');
    teamTracker.startActivity('Testing', 'TestFrameworkDeveloper', 'Creating comprehensive testing framework', 'Development');
    
    // Simulate work
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Complete activity
    const testingResult = teamTracker.completeActivity({ success: true, framework: 'TDD Framework' });
    console.log(`✅ Testing activity completed: ${testingResult.duration}ms\n`);
    
    // Test 4: Display Team Status
    console.log('📋 Test 4: Displaying Team Status');
    teamTracker.displayTeamStatus();
    
    console.log('🎉 Team Activity Tracker Test Completed!');
    
  } catch (error) {
    console.error('❌ Team activity tracker test failed:', error.message);
  }
}

if (require.main === module) {
  testTeamActivityTracker().catch(console.error);
}

module.exports = { testTeamActivityTracker }; 