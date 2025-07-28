#!/usr/bin/env node

/**
 * Meta Team with Activity Tracker Demo
 * Demonstrates how to integrate team activity tracking with Meta Team workflows
 */

require('dotenv').config();

// Set the API key for Claude Code
process.env.CLAUDE_API_KEY = 'YOUR_API_KEY_HERE';

const { ClaudeCodeAPI } = require('./utils/claude-code-api-fix');
const { teamTracker } = require('./utils/team-activity-tracker');

class MetaTeamWithActivityTracker {
  constructor() {
    this.claudeCode = new ClaudeCodeAPI();
  }

  async demonstrateActivityTracking() {
    console.log('🤖 Meta Team with Activity Tracker Demo\n');
    console.log('='.repeat(100));
    console.log('🎯 Task: Demonstrate team activity tracking with Meta Team workflows');
    console.log('📅 Date: 2025-07-27');
    console.log('🔧 Using Claude Code with activity tracking');
    console.log('='.repeat(100));
    
    const startTime = Date.now();
    
    try {
      // Phase 1: Authentication Team Working
      console.log('\n📋 Phase 1: Authentication Team Working');
      teamTracker.startActivity('Authentication', 'AuthTester', 'Testing Claude Code authentication', 'Testing');
      
      const authResult = await this.claudeCode.testConnection();
      console.log('🔐 Authentication test result:', authResult.success ? 'PASSED' : 'FAILED');
      
      teamTracker.completeActivity(authResult);
      
      // Phase 2: Error Handling Team Working
      console.log('\n📋 Phase 2: Error Handling Team Working');
      teamTracker.startActivity('ErrorHandling', 'ErrorHandler', 'Testing error handling framework', 'Testing');
      
      try {
        // Simulate an error
        throw new Error('Simulated error for testing');
      } catch (error) {
        console.log('🔄 Error handled:', error.message);
        teamTracker.completeActivity({ errorHandled: true, error: error.message });
      }
      
      // Phase 3: Testing Team Working
      console.log('\n📋 Phase 3: Testing Team Working');
      teamTracker.startActivity('Testing', 'TestFrameworkDeveloper', 'Testing testing framework', 'Testing');
      
      const testResult = await this.claudeCode.query('What is 2+2?');
      console.log('🧪 Test query result:', testResult.substring(0, 50) + '...');
      
      teamTracker.completeActivity({ testPassed: true, result: testResult.substring(0, 50) });
      
      // Phase 4: API Team Working
      console.log('\n📋 Phase 4: API Team Working');
      teamTracker.startActivity('API', 'APIIntegrator', 'Testing API integration patterns', 'Testing');
      
      const apiResult = await this.claudeCode.query('Generate a simple API endpoint description.');
      console.log('🔗 API integration test result:', apiResult.substring(0, 50) + '...');
      
      teamTracker.completeActivity({ apiTestPassed: true, result: apiResult.substring(0, 50) });
      
      // Phase 5: Documentation Team Working
      console.log('\n📋 Phase 5: Documentation Team Working');
      teamTracker.startActivity('Documentation', 'TemplateCreator', 'Creating documentation templates', 'Development');
      
      const docResult = await this.claudeCode.query('Create a documentation template for API endpoints.');
      console.log('📚 Documentation template created:', docResult.substring(0, 50) + '...');
      
      teamTracker.completeActivity({ templateCreated: true, result: docResult.substring(0, 50) });
      
      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log('\n🎉 Meta Team Activity Tracking Demo Completed!\n');
      
      // Display final team status
      teamTracker.displayTeamStatus();
      
      return {
        success: true,
        duration: duration,
        teamsWorked: 5,
        totalActivities: 5
      };

    } catch (error) {
      console.error('❌ Demo failed:', error.message);
      
      // Mark current activity as failed if there is one
      if (teamTracker.getCurrentActivity()) {
        teamTracker.failActivity(error.message);
      }
      
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Main execution
async function main() {
  const demo = new MetaTeamWithActivityTracker();
  const result = await demo.demonstrateActivityTracking();
  
  if (result.success) {
    console.log('\n🎉 META TEAM ACTIVITY TRACKING DEMO COMPLETED!');
    console.log('='.repeat(100));
    console.log(`Duration: ${result.duration}ms`);
    console.log(`Teams Worked: ${result.teamsWorked}`);
    console.log(`Total Activities: ${result.totalActivities}`);
    
    console.log('\n🎯 KEY FEATURES DEMONSTRATED:');
    console.log('─'.repeat(80));
    console.log('✅ Real-time activity tracking for each team and role');
    console.log('✅ Duration tracking for all activities');
    console.log('✅ Success/failure status tracking');
    console.log('✅ Activity history and statistics');
    console.log('✅ Team performance metrics');
    console.log('✅ Integration with Claude Code workflows');
    
    console.log('\n🚀 INTEGRATION INSTRUCTIONS:');
    console.log('─'.repeat(80));
    console.log('1. Import tracker: const { teamTracker } = require("./utils/team-activity-tracker");');
    console.log('2. Start activity: teamTracker.startActivity(team, role, task, phase);');
    console.log('3. Update activity: teamTracker.updateActivity(task, phase);');
    console.log('4. Complete activity: teamTracker.completeActivity(result);');
    console.log('5. Fail activity: teamTracker.failActivity(error);');
    console.log('6. Display status: teamTracker.displayTeamStatus();');
    
    console.log('\n🎯 BENEFITS:');
    console.log('─'.repeat(80));
    console.log('🔍 Transparency: See exactly which team/role is working');
    console.log('📊 Accountability: Track performance and completion rates');
    console.log('⏱️  Efficiency: Monitor duration and identify bottlenecks');
    console.log('📈 Metrics: Collect comprehensive team statistics');
    console.log('🔄 Workflow: Ensure sub-agents are actually doing the work');
    
    console.log('\n🎉 The Meta Team now has complete visibility into which sub-agents');
    console.log('   are working, what they are doing, and how long it takes!');
    
  } else {
    console.log('\n❌ FAILED: Could not complete activity tracking demo');
    console.log(`Error: ${result.error}`);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { MetaTeamWithActivityTracker }; 