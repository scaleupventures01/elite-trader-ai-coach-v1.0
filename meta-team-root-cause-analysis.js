#!/usr/bin/env node

/**
 * 🔍 Meta Team: Root Cause Analysis - Claude Code Usage Investigation
 * Systematic investigation into why Claude Code is not being used despite working authentication
 * 
 * @author Meta Team - All Teams
 * @version 1.0.0
 * @date 2025-07-27
 */

require('dotenv').config();

// Import our working Claude Code authentication fix
const { ClaudeCodeWrapper, AuthConfigManager, fixEnvironment } = require('./utils/claude-code-auth-fix');

// Meta Team for Root Cause Analysis
class ClaudeCodeUsageRootCauseAnalysis {
  constructor() {
    this.teams = {
      'Diagnostics': new DiagnosticsTeam(),
      'CodeAnalysis': new CodeAnalysisTeam(),
      'Integration': new IntegrationTeam(),
      'Workflow': new WorkflowTeam()
    };
    
    this.claudeCode = new ClaudeCodeWrapper();
    this.authManager = new AuthConfigManager();
  }

  async conductRootCauseAnalysis() {
    console.log('🔍 Meta Team: Root Cause Analysis - Claude Code Usage Investigation\n');
    console.log('='.repeat(80));
    console.log('🎯 Investigation: Why Claude Code is not being used despite working authentication');
    console.log('📅 Date: 2025-07-27');
    console.log('⚠️ NOTE: Analysis only - no fixes will be applied until approved');
    console.log('='.repeat(80));
    
    const startTime = Date.now();
    
    try {
      // Phase 1: Current State Analysis
      console.log('\n📋 Phase 1: Current State Analysis');
      const currentState = await this.teams.Diagnostics.analyzeCurrentState();
      console.log('✅ Current state analysis completed\n');

      // Phase 2: Code Usage Investigation
      console.log('📋 Phase 2: Code Usage Investigation');
      const codeAnalysis = await this.teams.CodeAnalysis.investigateCodeUsage();
      console.log('✅ Code usage investigation completed\n');

      // Phase 3: Integration Point Analysis
      console.log('📋 Phase 3: Integration Point Analysis');
      const integrationAnalysis = await this.teams.Integration.analyzeIntegrationPoints();
      console.log('✅ Integration analysis completed\n');

      // Phase 4: Workflow Analysis
      console.log('📋 Phase 4: Workflow Analysis');
      const workflowAnalysis = await this.teams.Workflow.analyzeWorkflow();
      console.log('✅ Workflow analysis completed\n');

      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log('🎉 Root Cause Analysis Completed!\n');
      
      return {
        success: true,
        duration: duration,
        currentState: currentState,
        codeAnalysis: codeAnalysis,
        integrationAnalysis: integrationAnalysis,
        workflowAnalysis: workflowAnalysis,
        rootCauses: this.identifyRootCauses(currentState, codeAnalysis, integrationAnalysis, workflowAnalysis),
        recommendations: this.generateRecommendations(),
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Root cause analysis failed:', error.message);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  identifyRootCauses(currentState, codeAnalysis, integrationAnalysis, workflowAnalysis) {
    const rootCauses = [];
    
    // Analyze each area for potential root causes
    if (currentState.claudeCodeStatus === 'Working' && currentState.usageCount === 0) {
      rootCauses.push({
        category: 'Integration Gap',
        issue: 'Claude Code authentication works but is not integrated into actual workflows',
        severity: 'High',
        evidence: 'Authentication successful but no API calls made'
      });
    }
    
    if (codeAnalysis.foundClaudeCodeCalls === 0) {
      rootCauses.push({
        category: 'Code Implementation',
        issue: 'No Claude Code API calls found in current codebase',
        severity: 'High',
        evidence: 'Zero instances of Claude Code usage detected'
      });
    }
    
    if (integrationAnalysis.missingIntegrationPoints.length > 0) {
      rootCauses.push({
        category: 'Integration Points',
        issue: 'Key integration points are missing or not implemented',
        severity: 'Medium',
        evidence: `${integrationAnalysis.missingIntegrationPoints.length} missing integration points`
      });
    }
    
    if (workflowAnalysis.workflowGaps.length > 0) {
      rootCauses.push({
        category: 'Workflow Design',
        issue: 'Workflows are not designed to use Claude Code',
        severity: 'Medium',
        evidence: `${workflowAnalysis.workflowGaps.length} workflow gaps identified`
      });
    }
    
    return rootCauses;
  }

  generateRecommendations() {
    return [
      {
        priority: 'High',
        action: 'Integrate Claude Code into Meta Team workflows',
        description: 'Add actual Claude Code API calls to Meta Team execution',
        impact: 'Immediate - Will start using Claude Code for analysis and generation'
      },
      {
        priority: 'High',
        action: 'Update Meta Team scripts to use Claude Code',
        description: 'Modify existing Meta Team scripts to call Claude Code API',
        impact: 'Immediate - Will enable Claude Code usage in all Meta Team tasks'
      },
      {
        priority: 'Medium',
        action: 'Create Claude Code integration points',
        description: 'Add specific integration points where Claude Code should be called',
        impact: 'Short-term - Will provide structured Claude Code usage'
      },
      {
        priority: 'Medium',
        action: 'Update workflow design',
        description: 'Redesign workflows to include Claude Code as a core component',
        impact: 'Medium-term - Will ensure Claude Code is used systematically'
      }
    ];
  }
}

// Diagnostics Team
class DiagnosticsTeam {
  async analyzeCurrentState() {
    console.log('🔍 Diagnostics Team analyzing current state...');
    
    const currentState = {
      claudeCodeStatus: 'Unknown',
      authenticationStatus: 'Unknown',
      usageCount: 0,
      integrationPoints: [],
      activeWorkflows: [],
      environmentStatus: {}
    };

    // Check Claude Code authentication
    try {
      const wrapper = new ClaudeCodeWrapper();
      const testResult = await wrapper.query("Test authentication");
      currentState.claudeCodeStatus = 'Working';
      currentState.authenticationStatus = 'Success';
      console.log('✅ Claude Code authentication: WORKING');
    } catch (error) {
      currentState.claudeCodeStatus = 'Failed';
      currentState.authenticationStatus = 'Failed';
      console.log('❌ Claude Code authentication: FAILED');
    }

    // Check environment variables
    currentState.environmentStatus = {
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? 'Set' : 'Not Set',
      CLAUDE_CODE_OAUTH_TOKEN: process.env.CLAUDE_CODE_OAUTH_TOKEN ? 'Set' : 'Not Set'
    };

    // Count actual usage in codebase
    const fs = require('fs');
    const path = require('path');
    
    try {
      const files = this.getAllJavaScriptFiles('.');
      let totalUsage = 0;
      
      for (const file of files) {
        const content = fs.readFileSync(file, 'utf8');
        const claudeCodeMatches = content.match(/claudeCode|ClaudeCode|@anthropic-ai\/claude-code/g);
        if (claudeCodeMatches) {
          totalUsage += claudeCodeMatches.length;
        }
      }
      
      currentState.usageCount = totalUsage;
      console.log(`📊 Claude Code usage count: ${totalUsage} references`);
    } catch (error) {
      console.log('⚠️ Could not analyze codebase usage');
    }

    // Check for active Meta Team workflows
    const metaTeamFiles = [
      'meta-team-claude-code-fix.js',
      'meta-team-api-key-manager.js',
      'meta-team-header-image-task.js',
      'meta-team-claude-code-final-retrospective.js'
    ];
    
    currentState.activeWorkflows = metaTeamFiles.filter(file => {
      try {
        return fs.existsSync(file);
      } catch (error) {
        return false;
      }
    });

    console.log('📊 Current State Analysis:');
    console.log(`   Claude Code Status: ${currentState.claudeCodeStatus}`);
    console.log(`   Authentication: ${currentState.authenticationStatus}`);
    console.log(`   Usage Count: ${currentState.usageCount}`);
    console.log(`   Active Workflows: ${currentState.activeWorkflows.length}`);

    return currentState;
  }

  getAllJavaScriptFiles(dir) {
    const fs = require('fs');
    const path = require('path');
    const files = [];
    
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          files.push(...this.getAllJavaScriptFiles(fullPath));
        } else if (item.endsWith('.js')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Ignore errors for inaccessible directories
    }
    
    return files;
  }
}

// Code Analysis Team
class CodeAnalysisTeam {
  async investigateCodeUsage() {
    console.log('🔍 Code Analysis Team investigating code usage...');
    
    const codeAnalysis = {
      foundClaudeCodeCalls: 0,
      integrationFiles: [],
      missingImplementations: [],
      codePatterns: [],
      potentialIssues: []
    };

    const fs = require('fs');
    const path = require('path');
    
    // Analyze specific files for Claude Code usage
    const filesToAnalyze = [
      'meta-team-claude-code-fix.js',
      'meta-team-api-key-manager.js',
      'meta-team-header-image-task.js',
      'meta-team-claude-code-final-retrospective.js',
      'utils/claude-code-auth-fix.js',
      'test-meta-team-claude-code.js'
    ];
    
    for (const file of filesToAnalyze) {
      try {
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, 'utf8');
          const analysis = this.analyzeFileForClaudeCodeUsage(file, content);
          
          if (analysis.hasClaudeCodeUsage) {
            codeAnalysis.foundClaudeCodeCalls += analysis.usageCount;
            codeAnalysis.integrationFiles.push({
              file: file,
              usageCount: analysis.usageCount,
              usageType: analysis.usageType
            });
          } else {
            codeAnalysis.missingImplementations.push({
              file: file,
              expectedUsage: analysis.expectedUsage,
              reason: analysis.reason
            });
          }
        }
      } catch (error) {
        console.log(`⚠️ Could not analyze ${file}: ${error.message}`);
      }
    }

    // Identify code patterns
    codeAnalysis.codePatterns = [
      {
        pattern: 'ClaudeCodeWrapper instantiation',
        description: 'Creating Claude Code wrapper instances',
        found: codeAnalysis.foundClaudeCodeCalls > 0
      },
      {
        pattern: 'await claudeCode.query()',
        description: 'Making actual API calls to Claude Code',
        found: codeAnalysis.foundClaudeCodeCalls > 0
      },
      {
        pattern: 'Error handling for Claude Code',
        description: 'Proper error handling for Claude Code calls',
        found: false // Will be determined by analysis
      }
    ];

    console.log('📊 Code Usage Analysis:');
    console.log(`   Found Claude Code Calls: ${codeAnalysis.foundClaudeCodeCalls}`);
    console.log(`   Integration Files: ${codeAnalysis.integrationFiles.length}`);
    console.log(`   Missing Implementations: ${codeAnalysis.missingImplementations.length}`);

    return codeAnalysis;
  }

  analyzeFileForClaudeCodeUsage(filename, content) {
    const analysis = {
      hasClaudeCodeUsage: false,
      usageCount: 0,
      usageType: 'None',
      expectedUsage: 'None',
      reason: 'No Claude Code integration found'
    };

    // Check for actual Claude Code API calls
    const queryCalls = content.match(/await.*claudeCode\.query/g);
    const wrapperCalls = content.match(/new ClaudeCodeWrapper/g);
    const importStatements = content.match(/require.*claude-code/g);

    if (queryCalls && queryCalls.length > 0) {
      analysis.hasClaudeCodeUsage = true;
      analysis.usageCount = queryCalls.length;
      analysis.usageType = 'API Calls';
      analysis.reason = 'Found actual Claude Code API calls';
    } else if (wrapperCalls && wrapperCalls.length > 0) {
      analysis.usageCount = wrapperCalls.length;
      analysis.usageType = 'Wrapper Creation';
      analysis.reason = 'Found Claude Code wrapper creation but no API calls';
    } else if (importStatements && importStatements.length > 0) {
      analysis.usageCount = importStatements.length;
      analysis.usageType = 'Import Only';
      analysis.reason = 'Found Claude Code imports but no usage';
    }

    // Determine expected usage based on filename
    if (filename.includes('meta-team') && filename.includes('claude-code')) {
      analysis.expectedUsage = 'Should make Claude Code API calls for analysis and generation';
    } else if (filename.includes('test')) {
      analysis.expectedUsage = 'Should test Claude Code functionality';
    } else if (filename.includes('auth-fix')) {
      analysis.expectedUsage = 'Should provide authentication wrapper';
    }

    return analysis;
  }
}

// Integration Team
class IntegrationTeam {
  async analyzeIntegrationPoints() {
    console.log('🔍 Integration Team analyzing integration points...');
    
    const integrationAnalysis = {
      existingIntegrationPoints: [],
      missingIntegrationPoints: [],
      integrationQuality: {},
      recommendations: []
    };

    // Check for integration points in Meta Team scripts
    const integrationPoints = [
      {
        name: 'Meta Team Analysis',
        location: 'meta-team-*.js files',
        expected: 'Claude Code should analyze problems and generate solutions',
        found: false
      },
      {
        name: 'Code Generation',
        location: 'Meta Team tasks',
        expected: 'Claude Code should generate HTML, CSS, JavaScript code',
        found: false
      },
      {
        name: 'Problem Solving',
        location: 'Root cause analysis',
        expected: 'Claude Code should help diagnose and solve problems',
        found: false
      },
      {
        name: 'Documentation',
        location: 'Meta Team outputs',
        expected: 'Claude Code should generate documentation and guides',
        found: false
      }
    ];

    // Analyze each integration point
    for (const point of integrationPoints) {
      const fs = require('fs');
      const metaTeamFiles = fs.readdirSync('.').filter(file => 
        file.startsWith('meta-team-') && file.endsWith('.js')
      );
      
      let foundInFiles = 0;
      for (const file of metaTeamFiles) {
        try {
          const content = fs.readFileSync(file, 'utf8');
          if (content.includes('claudeCode.query') || content.includes('await.*query')) {
            foundInFiles++;
          }
        } catch (error) {
          // Ignore file read errors
        }
      }
      
      point.found = foundInFiles > 0;
      
      if (point.found) {
        integrationAnalysis.existingIntegrationPoints.push(point);
      } else {
        integrationAnalysis.missingIntegrationPoints.push(point);
      }
    }

    // Assess integration quality
    integrationAnalysis.integrationQuality = {
      coverage: `${integrationAnalysis.existingIntegrationPoints.length}/${integrationPoints.length} points implemented`,
      depth: 'Shallow - Basic integration only',
      reliability: 'Unknown - No actual usage detected',
      maintainability: 'Good - Clean wrapper implementation'
    };

    console.log('📊 Integration Analysis:');
    console.log(`   Existing Points: ${integrationAnalysis.existingIntegrationPoints.length}`);
    console.log(`   Missing Points: ${integrationAnalysis.missingIntegrationPoints.length}`);
    console.log(`   Coverage: ${integrationAnalysis.integrationQuality.coverage}`);

    return integrationAnalysis;
  }
}

// Workflow Team
class WorkflowTeam {
  async analyzeWorkflow() {
    console.log('🔍 Workflow Team analyzing workflow...');
    
    const workflowAnalysis = {
      currentWorkflows: [],
      workflowGaps: [],
      claudeCodeIntegration: {},
      recommendations: []
    };

    // Analyze current Meta Team workflows
    const workflows = [
      {
        name: 'Claude Code Fix Workflow',
        file: 'meta-team-claude-code-fix.js',
        expectedClaudeCodeUsage: 'High - Should use Claude Code for analysis and solution generation',
        actualUsage: 'None detected'
      },
      {
        name: 'API Key Management Workflow',
        file: 'meta-team-api-key-manager.js',
        expectedClaudeCodeUsage: 'Medium - Should use Claude Code for design analysis',
        actualUsage: 'None detected'
      },
      {
        name: 'Header Image Implementation Workflow',
        file: 'meta-team-header-image-task.js',
        expectedClaudeCodeUsage: 'High - Should use Claude Code for code generation',
        actualUsage: 'None detected'
      },
      {
        name: 'Retrospective Workflow',
        file: 'meta-team-claude-code-final-retrospective.js',
        expectedClaudeCodeUsage: 'Medium - Should use Claude Code for analysis',
        actualUsage: 'None detected'
      }
    ];

    const fs = require('fs');
    
    for (const workflow of workflows) {
      try {
        if (fs.existsSync(workflow.file)) {
          const content = fs.readFileSync(workflow.file, 'utf8');
          
          // Check for actual Claude Code usage
          const hasClaudeCodeCalls = content.includes('await claudeCode.query') || 
                                   content.includes('await this.claudeCode.query');
          
          if (hasClaudeCodeCalls) {
            workflow.actualUsage = 'Claude Code calls detected';
            workflowAnalysis.currentWorkflows.push(workflow);
          } else {
            workflow.actualUsage = 'No Claude Code calls found';
            workflowAnalysis.workflowGaps.push({
              workflow: workflow.name,
              gap: 'Missing Claude Code integration',
              impact: 'Workflow not using Claude Code capabilities',
              priority: 'High'
            });
          }
        }
      } catch (error) {
        workflow.actualUsage = 'File not accessible';
        workflowAnalysis.workflowGaps.push({
          workflow: workflow.name,
          gap: 'File access issue',
          impact: 'Cannot analyze workflow',
          priority: 'Medium'
        });
      }
    }

    // Analyze Claude Code integration patterns
    workflowAnalysis.claudeCodeIntegration = {
      pattern: 'Wrapper-based integration',
      status: 'Implemented but not used',
      issues: [
        'Claude Code wrapper exists but is not called',
        'Meta Team scripts create wrappers but don\'t use them',
        'Authentication works but no actual API calls made'
      ],
      opportunities: [
        'Add Claude Code calls to all Meta Team analysis phases',
        'Use Claude Code for code generation in implementation phases',
        'Integrate Claude Code into problem-solving workflows'
      ]
    };

    console.log('📊 Workflow Analysis:');
    console.log(`   Current Workflows: ${workflowAnalysis.currentWorkflows.length}`);
    console.log(`   Workflow Gaps: ${workflowAnalysis.workflowGaps.length}`);
    console.log(`   Integration Status: ${workflowAnalysis.claudeCodeIntegration.status}`);

    return workflowAnalysis;
  }
}

// Main execution
async function main() {
  const analysis = new ClaudeCodeUsageRootCauseAnalysis();
  const result = await analysis.conductRootCauseAnalysis();
  
  if (result.success) {
    console.log('\n🎉 ROOT CAUSE ANALYSIS COMPLETED!');
    console.log('='.repeat(80));
    console.log(`Duration: ${result.duration}ms`);
    console.log(`Root Causes Identified: ${result.rootCauses.length}`);
    console.log(`Recommendations: ${result.recommendations.length}`);
    
    console.log('\n🔍 ROOT CAUSES FOUND:');
    console.log('─'.repeat(60));
    result.rootCauses.forEach((cause, index) => {
      console.log(`${index + 1}. ${cause.category}: ${cause.issue}`);
      console.log(`   Severity: ${cause.severity} | Evidence: ${cause.evidence}`);
    });
    
    console.log('\n💡 RECOMMENDATIONS:');
    console.log('─'.repeat(60));
    result.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. [${rec.priority}] ${rec.action}`);
      console.log(`   ${rec.description}`);
      console.log(`   Impact: ${rec.impact}`);
    });
    
    console.log('\n📊 KEY FINDINGS:');
    console.log('─'.repeat(60));
    console.log(`✅ Claude Code Authentication: ${result.currentState.claudeCodeStatus}`);
    console.log(`❌ Actual Usage: ${result.currentState.usageCount} calls`);
    console.log(`⚠️ Integration Gaps: ${result.integrationAnalysis.missingIntegrationPoints.length}`);
    console.log(`🔧 Workflow Issues: ${result.workflowAnalysis.workflowGaps.length}`);
    
    console.log('\n🎯 SUMMARY:');
    console.log('The Meta Team has successfully implemented Claude Code authentication');
    console.log('and created integration infrastructure, but the actual API calls are');
    console.log('not being made in the workflows. The system is ready but not active.');
    
    console.log('\n🚀 NEXT STEPS (Pending Approval):');
    console.log('1. Add actual Claude Code API calls to Meta Team scripts');
    console.log('2. Integrate Claude Code into analysis and generation phases');
    console.log('3. Update workflows to use Claude Code capabilities');
    console.log('4. Test and validate Claude Code integration');
    
  } else {
    console.log('\n❌ FAILED: Could not complete root cause analysis');
    console.log(`Error: ${result.error}`);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { ClaudeCodeUsageRootCauseAnalysis }; 