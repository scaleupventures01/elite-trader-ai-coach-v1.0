#!/usr/bin/env node

/**
 * Meta Team: Claude Code Usage Retrospective
 * Conduct a retrospective with Claude Code usage tracking
 */

require('dotenv').config();

// Set the API key for Claude Code
process.env.CLAUDE_API_KEY = 'YOUR_API_KEY_HERE';

const { ClaudeCodeAPI } = require('./utils/claude-code-api-fix');
const { teamTracker } = require('./utils/team-activity-tracker');
const { claudeCodeTracker } = require('./utils/claude-code-usage-tracker');

class MetaTeamClaudeCodeUsageRetrospective {
  constructor() {
    this.claudeCode = new ClaudeCodeAPI();
    this.teams = {
      'KnowledgeManagement': new KnowledgeManagementTeam(),
      'ProcessImprovement': new ProcessImprovementTeam(),
      'TechnicalAnalysis': new TechnicalAnalysisTeam()
    };
  }

  async conductClaudeCodeUsageRetrospective() {
    console.log('🤖 Meta Team: Claude Code Usage Retrospective\n');
    console.log('='.repeat(100));
    console.log('🎯 Task: Conduct retrospective with Claude Code usage tracking');
    console.log('📅 Date: 2025-07-27');
    console.log('🔧 Using Claude Code with usage tracking');
    console.log('='.repeat(100));
    
    const startTime = Date.now();
    
    try {
      // Start Claude Code usage tracking session
      claudeCodeTracker.startSession('Claude Code Usage Retrospective', 'Analyzing Claude Code usage patterns and effectiveness');
      
      // Phase 1: Knowledge Management Team Analysis
      console.log('\n📋 Phase 1: Knowledge Management Team Analysis');
      teamTracker.startActivity('KnowledgeManagement', 'KnowledgeCapturer', 'Analyzing Claude Code usage patterns', 'Analysis');
      
      const knowledgeAnalysis = await this.teams.KnowledgeManagement.analyzeClaudeCodeUsage();
      teamTracker.completeActivity(knowledgeAnalysis);
      console.log('✅ Knowledge management analysis completed with Claude Code');

      // Phase 2: Process Improvement Team Analysis
      console.log('\n📋 Phase 2: Process Improvement Team Analysis');
      teamTracker.startActivity('ProcessImprovement', 'ProcessAnalyst', 'Analyzing process improvements for Claude Code usage', 'Analysis');
      
      const processAnalysis = await this.teams.ProcessImprovement.analyzeProcessImprovements();
      teamTracker.completeActivity(processAnalysis);
      console.log('✅ Process improvement analysis completed with Claude Code');

      // Phase 3: Technical Analysis Team Analysis
      console.log('\n📋 Phase 3: Technical Analysis Team Analysis');
      teamTracker.startActivity('TechnicalAnalysis', 'TechnicalAnalyst', 'Analyzing technical aspects of Claude Code usage', 'Analysis');
      
      const technicalAnalysis = await this.teams.TechnicalAnalysis.analyzeTechnicalAspects();
      teamTracker.completeActivity(technicalAnalysis);
      console.log('✅ Technical analysis completed with Claude Code');

      // End Claude Code usage tracking session
      const sessionResult = claudeCodeTracker.endSession();
      
      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log('\n🎉 Claude Code Usage Retrospective Completed!\n');
      
      // Display final team status
      teamTracker.displayTeamStatus();
      
      // Display Claude Code usage statistics
      claudeCodeTracker.displayGlobalStats();
      
      return {
        success: true,
        duration: duration,
        knowledgeAnalysis: knowledgeAnalysis,
        processAnalysis: processAnalysis,
        technicalAnalysis: technicalAnalysis,
        claudeCodeUsage: sessionResult
      };

    } catch (error) {
      console.error('❌ Claude Code usage retrospective failed:', error.message);
      
      // Mark current activity as failed if there is one
      if (teamTracker.getCurrentActivity()) {
        teamTracker.failActivity(error.message);
      }
      
      // End Claude Code usage session
      claudeCodeTracker.endSession();
      
      return {
        success: false,
        error: error.message
      };
    }
  }
}

class KnowledgeManagementTeam {
  async analyzeClaudeCodeUsage() {
    console.log('📚 Analyzing Claude Code usage patterns with Claude Code...');
    
    try {
      const claudeCode = new ClaudeCodeAPI();
      
      const retrospectiveData = claudeCodeTracker.getRetrospectiveData();
      
      const analysisPrompt = `Analyze the Claude Code usage patterns from this retrospective data:

${JSON.stringify(retrospectiveData, null, 2)}

Please provide a comprehensive analysis covering:

1. **Usage Patterns**: How much coding is done with Claude Code vs without it
2. **Effectiveness**: How effective Claude Code has been in different scenarios
3. **Trends**: Whether Claude Code usage is improving, declining, or stable
4. **Knowledge Gaps**: What areas need more Claude Code integration
5. **Best Practices**: What patterns work best for Claude Code usage
6. **Recommendations**: How to improve Claude Code usage going forward

Focus on actionable insights and specific recommendations.`;

      const analysis = await claudeCode.query(analysisPrompt);
      console.log('📚 Claude Code Knowledge Analysis:', analysis.substring(0, 200) + '...');
      
      return {
        analysis: analysis,
        retrospectiveData: retrospectiveData,
        insights: 'Claude Code usage patterns analyzed'
      };
    } catch (error) {
      console.error('❌ Claude Code knowledge analysis failed:', error.message);
      throw error;
    }
  }
}

class ProcessImprovementTeam {
  async analyzeProcessImprovements() {
    console.log('🔄 Analyzing process improvements for Claude Code usage...');
    
    try {
      const claudeCode = new ClaudeCodeAPI();
      
      const retrospectiveData = claudeCodeTracker.getRetrospectiveData();
      
      const analysisPrompt = `Based on this Claude Code usage data, analyze process improvements needed:

${JSON.stringify(retrospectiveData, null, 2)}

Please provide a comprehensive analysis covering:

1. **Current Process Issues**: What problems exist in current Claude Code usage processes
2. **Efficiency Gaps**: Where Claude Code usage could be more efficient
3. **Integration Opportunities**: How to better integrate Claude Code into workflows
4. **Quality Improvements**: How to improve the quality of Claude Code outputs
5. **Process Automation**: What processes could be automated with Claude Code
6. **Team Coordination**: How to improve team coordination around Claude Code usage
7. **Implementation Plan**: Specific steps to improve Claude Code usage processes

Focus on practical, implementable improvements.`;

      const analysis = await claudeCode.query(analysisPrompt);
      console.log('🔄 Claude Code Process Analysis:', analysis.substring(0, 200) + '...');
      
      return {
        analysis: analysis,
        improvements: 'Process improvements identified',
        implementationPlan: 'Implementation plan created'
      };
    } catch (error) {
      console.error('❌ Claude Code process analysis failed:', error.message);
      throw error;
    }
  }
}

class TechnicalAnalysisTeam {
  async analyzeTechnicalAspects() {
    console.log('🔧 Analyzing technical aspects of Claude Code usage...');
    
    try {
      const claudeCode = new ClaudeCodeAPI();
      
      const retrospectiveData = claudeCodeTracker.getRetrospectiveData();
      
      const analysisPrompt = `Analyze the technical aspects of Claude Code usage from this data:

${JSON.stringify(retrospectiveData, null, 2)}

Please provide a comprehensive technical analysis covering:

1. **API Performance**: How well the Claude Code API is performing
2. **Integration Quality**: How well Claude Code integrates with existing systems
3. **Error Handling**: How effectively errors are handled in Claude Code usage
4. **Token Efficiency**: How efficiently tokens are being used
5. **Response Quality**: The quality and relevance of Claude Code responses
6. **Technical Debt**: Any technical debt related to Claude Code integration
7. **Scalability**: How well the current Claude Code usage scales
8. **Technical Recommendations**: Specific technical improvements needed

Focus on technical details and specific technical recommendations.`;

      const analysis = await claudeCode.query(analysisPrompt);
      console.log('🔧 Claude Code Technical Analysis:', analysis.substring(0, 200) + '...');
      
      return {
        analysis: analysis,
        technicalInsights: 'Technical aspects analyzed',
        recommendations: 'Technical recommendations provided'
      };
    } catch (error) {
      console.error('❌ Claude Code technical analysis failed:', error.message);
      throw error;
    }
  }
}

// Main execution
async function main() {
  const retrospective = new MetaTeamClaudeCodeUsageRetrospective();
  const result = await retrospective.conductClaudeCodeUsageRetrospective();
  
  if (result.success) {
    console.log('\n🎉 CLAUDE CODE USAGE RETROSPECTIVE COMPLETED!');
    console.log('='.repeat(100));
    console.log(`Duration: ${result.duration}ms`);
    console.log(`Teams Worked: 3`);
    console.log(`Claude Code Usage: ${result.claudeCodeUsage.claudeCodePercentage}%`);
    
    console.log('\n📊 CLAUDE CODE USAGE ANALYSIS:');
    console.log('─'.repeat(80));
    console.log(`🔗 Claude Code Calls: ${result.claudeCodeUsage.claudeCodeCalls}`);
    console.log(`🔄 Fallback Calls: ${result.claudeCodeUsage.fallbackCalls}`);
    console.log(`📈 Total Calls: ${result.claudeCodeUsage.totalCalls}`);
    console.log(`🎯 Tokens Used: ${result.claudeCodeUsage.tokensUsed}`);
    console.log(`⏱️  Time Spent: ${result.claudeCodeUsage.timeSpent}ms`);
    
    console.log('\n📋 RETROSPECTIVE FINDINGS:');
    console.log('─'.repeat(80));
    console.log('📚 Knowledge Management: Claude Code usage patterns analyzed');
    console.log('🔄 Process Improvement: Process improvements identified');
    console.log('🔧 Technical Analysis: Technical aspects analyzed');
    
    console.log('\n🎯 KEY INSIGHTS:');
    console.log('─'.repeat(80));
    console.log('✅ Claude Code usage is being tracked comprehensively');
    console.log('✅ Usage patterns are being analyzed for improvement');
    console.log('✅ Process improvements are being identified');
    console.log('✅ Technical aspects are being evaluated');
    console.log('✅ Retrospectives now include usage statistics');
    
    console.log('\n🚀 NEXT STEPS:');
    console.log('─'.repeat(80));
    console.log('1. Implement process improvements identified');
    console.log('2. Apply technical recommendations');
    console.log('3. Continue tracking Claude Code usage');
    console.log('4. Regular retrospectives with usage analysis');
    
    console.log('\n🎉 The Meta Team now has comprehensive Claude Code usage tracking');
    console.log('   and analysis capabilities for continuous improvement!');
    
  } else {
    console.log('\n❌ FAILED: Could not complete Claude Code usage retrospective');
    console.log(`Error: ${result.error}`);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { MetaTeamClaudeCodeUsageRetrospective }; 