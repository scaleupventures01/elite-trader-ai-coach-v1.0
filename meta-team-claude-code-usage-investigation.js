#!/usr/bin/env node

/**
 * 🔍 Meta Team: Claude Code Usage Investigation
 * Root cause analysis to determine why Claude Code API wasn't actually used
 */

require('dotenv').config();

const fs = require('fs');
const path = require('path');

class ClaudeCodeUsageInvestigation {
  constructor() {
    this.investigation = {
      timestamp: new Date().toISOString(),
      claims: [],
      actualUsage: [],
      discrepancies: [],
      rootCauses: []
    };
  }

  async investigate() {
    console.log('🔍 Meta Team: Claude Code Usage Investigation\n');
    console.log('='.repeat(80));
    console.log('🎯 Investigation: Why Claude Code API wasn\'t actually used');
    console.log('📅 Date: 2025-07-27');
    console.log('⚠️ Analysis only - no fixes will be applied');
    console.log('='.repeat(80));
    
    const startTime = Date.now();
    
    try {
      // Phase 1: Analyze Claims vs Reality
      console.log('\n📋 Phase 1: Analyzing Claims vs Reality');
      const claimsAnalysis = await this.analyzeClaimsVsReality();
      console.log('✅ Claims vs reality analysis completed');

      // Phase 2: Investigate Code Execution
      console.log('\n📋 Phase 2: Investigating Code Execution');
      const executionAnalysis = await this.investigateCodeExecution();
      console.log('✅ Code execution investigation completed');

      // Phase 3: Analyze Error Handling
      console.log('\n📋 Phase 3: Analyzing Error Handling');
      const errorAnalysis = await this.analyzeErrorHandling();
      console.log('✅ Error handling analysis completed');

      // Phase 4: Determine Root Causes
      console.log('\n📋 Phase 4: Determining Root Causes');
      const rootCauses = await this.determineRootCauses();
      console.log('✅ Root causes determined');

      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log('\n🎉 Investigation Completed!\n');
      
      return {
        success: true,
        duration: duration,
        investigation: this.investigation,
        summary: this.generateSummary()
      };

    } catch (error) {
      console.error('❌ Investigation failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async analyzeClaimsVsReality() {
    console.log('🔍 Analyzing claims vs reality...');
    
    // Analyze the upload page creation script
    const uploadScript = 'meta-team-upload-page.js';
    if (fs.existsSync(uploadScript)) {
      const content = fs.readFileSync(uploadScript, 'utf8');
      
      // Find all claims about Claude Code usage
      const claudeCodeClaims = content.match(/Claude Code|claudeCode\.query|await.*claudeCode/g);
      
      // Find actual Claude Code API calls
      const actualCalls = content.match(/await this\.claudeCode\.query\(/g);
      
      // Find fallback usage
      const fallbackUsage = content.match(/fallback|Fallback/g);
      
      this.investigation.claims = {
        totalClaims: claudeCodeClaims ? claudeCodeClaims.length : 0,
        actualCalls: actualCalls ? actualCalls.length : 0,
        fallbackUsage: fallbackUsage ? fallbackUsage.length : 0,
        claims: claudeCodeClaims || [],
        actualCallsFound: actualCalls || []
      };
      
      console.log('📊 Claims Analysis:');
      console.log(`   Total Claims: ${this.investigation.claims.totalClaims}`);
      console.log(`   Actual API Calls: ${this.investigation.claims.actualCalls}`);
      console.log(`   Fallback Usage: ${this.investigation.claims.fallbackUsage}`);
    }
    
    return this.investigation.claims;
  }

  async investigateCodeExecution() {
    console.log('🔍 Investigating code execution...');
    
    const executionAnalysis = {
      scriptExecution: false,
      claudeCodeCalls: 0,
      fallbackExecutions: 0,
      errorMessages: [],
      executionFlow: []
    };
    
    // Check if the script was actually executed
    const uploadScript = 'meta-team-upload-page.js';
    if (fs.existsSync(uploadScript)) {
      const content = fs.readFileSync(uploadScript, 'utf8');
      
      // Look for execution patterns
      const executionPatterns = [
        { pattern: /console\.log.*Claude Code.*call/g, description: 'Claude Code call logs' },
        { pattern: /⚠️.*Claude Code.*failed/g, description: 'Claude Code failure logs' },
        { pattern: /fallback/g, description: 'Fallback executions' },
        { pattern: /Creating fallback/g, description: 'Fallback creation' }
      ];
      
      executionPatterns.forEach(pattern => {
        const matches = content.match(pattern.pattern);
        if (matches) {
          executionAnalysis.executionFlow.push({
            type: pattern.description,
            count: matches.length,
            examples: matches.slice(0, 3)
          });
        }
      });
      
      // Count actual Claude Code calls vs fallbacks
      const claudeCodeCalls = content.match(/await this\.claudeCode\.query\(/g);
      const fallbackExecutions = content.match(/fallback.*implementation/g);
      
      executionAnalysis.claudeCodeCalls = claudeCodeCalls ? claudeCodeCalls.length : 0;
      executionAnalysis.fallbackExecutions = fallbackExecutions ? fallbackExecutions.length : 0;
    }
    
    this.investigation.actualUsage = executionAnalysis;
    
    console.log('📊 Execution Analysis:');
    console.log(`   Claude Code Calls: ${executionAnalysis.claudeCodeCalls}`);
    console.log(`   Fallback Executions: ${executionAnalysis.fallbackExecutions}`);
    console.log(`   Execution Flow Steps: ${executionAnalysis.executionFlow.length}`);
    
    return executionAnalysis;
  }

  async analyzeErrorHandling() {
    console.log('🔍 Analyzing error handling...');
    
    const errorAnalysis = {
      errorHandlingPatterns: [],
      fallbackTriggers: [],
      errorMessages: [],
      successRate: 0
    };
    
    // Analyze the upload page script for error handling
    const uploadScript = 'meta-team-upload-page.js';
    if (fs.existsSync(uploadScript)) {
      const content = fs.readFileSync(uploadScript, 'utf8');
      
      // Find error handling patterns
      const errorPatterns = [
        { pattern: /catch.*error/g, description: 'Catch blocks' },
        { pattern: /⚠️.*failed/g, description: 'Failure warnings' },
        { pattern: /using fallback/g, description: 'Fallback usage' },
        { pattern: /Claude Code.*failed/g, description: 'Claude Code failures' }
      ];
      
      errorPatterns.forEach(pattern => {
        const matches = content.match(pattern.pattern);
        if (matches) {
          errorAnalysis.errorHandlingPatterns.push({
            type: pattern.description,
            count: matches.length,
            examples: matches.slice(0, 2)
          });
        }
      });
      
      // Calculate success rate
      const totalAttempts = content.match(/await.*claudeCode/g) || [];
      const failures = content.match(/failed.*using fallback/g) || [];
      errorAnalysis.successRate = totalAttempts.length > 0 ? 
        ((totalAttempts.length - failures.length) / totalAttempts.length * 100).toFixed(1) : 0;
    }
    
    this.investigation.errorAnalysis = errorAnalysis;
    
    console.log('📊 Error Analysis:');
    console.log(`   Error Handling Patterns: ${errorAnalysis.errorHandlingPatterns.length}`);
    console.log(`   Success Rate: ${errorAnalysis.successRate}%`);
    
    return errorAnalysis;
  }

  async determineRootCauses() {
    console.log('🔍 Determining root causes...');
    
    const rootCauses = [];
    
    // Root Cause 1: Fallback Execution
    if (this.investigation.actualUsage.fallbackExecutions > 0) {
      rootCauses.push({
        cause: 'Fallback Execution',
        description: 'Claude Code API calls failed and fell back to local implementation',
        evidence: `${this.investigation.actualUsage.fallbackExecutions} fallback executions detected`,
        severity: 'High',
        impact: 'No actual Claude Code API usage occurred'
      });
    }
    
    // Root Cause 2: Error Handling Override
    if (this.investigation.errorAnalysis.successRate < 100) {
      rootCauses.push({
        cause: 'Error Handling Override',
        description: 'Error handling caught Claude Code failures and used fallbacks',
        evidence: `Success rate: ${this.investigation.errorAnalysis.successRate}%`,
        severity: 'Medium',
        impact: 'Fallback code executed instead of Claude Code'
      });
    }
    
    // Root Cause 3: Misleading Logging
    if (this.investigation.claims.totalClaims > this.investigation.claims.actualCalls) {
      rootCauses.push({
        cause: 'Misleading Logging',
        description: 'Script logged Claude Code usage but actually used fallbacks',
        evidence: `${this.investigation.claims.totalClaims} claims vs ${this.investigation.claims.actualCalls} actual calls`,
        severity: 'Medium',
        impact: 'False reporting of Claude Code usage'
      });
    }
    
    // Root Cause 4: Authentication Issues
    if (this.investigation.errorAnalysis.errorHandlingPatterns.some(p => p.type === 'Claude Code failures')) {
      rootCauses.push({
        cause: 'Authentication Issues',
        description: 'Claude Code API authentication may have failed',
        evidence: 'Claude Code failure patterns detected in error handling',
        severity: 'High',
        impact: 'API calls failed due to authentication problems'
      });
    }
    
    this.investigation.rootCauses = rootCauses;
    
    console.log('📊 Root Causes:');
    rootCauses.forEach((cause, index) => {
      console.log(`   ${index + 1}. ${cause.cause}: ${cause.description}`);
    });
    
    return rootCauses;
  }

  generateSummary() {
    const summary = {
      totalClaims: this.investigation.claims.totalClaims,
      actualCalls: this.investigation.claims.actualCalls,
      fallbackUsage: this.investigation.claims.fallbackUsage,
      successRate: this.investigation.errorAnalysis.successRate,
      rootCauses: this.investigation.rootCauses.length,
      conclusion: this.generateConclusion()
    };
    
    return summary;
  }

  generateConclusion() {
    const actualCalls = this.investigation.claims.actualCalls;
    const fallbackUsage = this.investigation.claims.fallbackUsage;
    
    if (actualCalls === 0 && fallbackUsage > 0) {
      return 'Claude Code API was NOT used. All functionality was implemented using fallback code.';
    } else if (actualCalls > 0 && fallbackUsage > 0) {
      return 'Claude Code API was partially used, but most functionality came from fallback code.';
    } else if (actualCalls > 0 && fallbackUsage === 0) {
      return 'Claude Code API was fully used as claimed.';
    } else {
      return 'Unable to determine Claude Code usage patterns.';
    }
  }
}

// Main execution
async function main() {
  const investigation = new ClaudeCodeUsageInvestigation();
  const result = await investigation.investigate();
  
  if (result.success) {
    console.log('\n🎉 CLAUDE CODE USAGE INVESTIGATION COMPLETED!');
    console.log('='.repeat(80));
    console.log(`Duration: ${result.duration}ms`);
    console.log(`Root Causes Found: ${result.summary.rootCauses}`);
    
    console.log('\n📊 INVESTIGATION SUMMARY:');
    console.log('─'.repeat(60));
    console.log(`Total Claims: ${result.summary.totalClaims}`);
    console.log(`Actual API Calls: ${result.summary.actualCalls}`);
    console.log(`Fallback Usage: ${result.summary.fallbackUsage}`);
    console.log(`Success Rate: ${result.summary.successRate}%`);
    console.log(`Root Causes: ${result.summary.rootCauses}`);
    
    console.log('\n🔍 ROOT CAUSES:');
    console.log('─'.repeat(60));
    result.investigation.rootCauses.forEach((cause, index) => {
      console.log(`${index + 1}. ${cause.cause}`);
      console.log(`   Description: ${cause.description}`);
      console.log(`   Evidence: ${cause.evidence}`);
      console.log(`   Severity: ${cause.severity}`);
      console.log(`   Impact: ${cause.impact}`);
      console.log('');
    });
    
    console.log('\n🎯 CONCLUSION:');
    console.log('─'.repeat(60));
    console.log(result.summary.conclusion);
    
    console.log('\n📋 DETAILED FINDINGS:');
    console.log('─'.repeat(60));
    console.log('Claims vs Reality:');
    console.log(`   - Script claimed Claude Code usage: ${result.investigation.claims.totalClaims} times`);
    console.log(`   - Actual API calls made: ${result.investigation.claims.actualCalls} times`);
    console.log(`   - Fallback code used: ${result.investigation.claims.fallbackUsage} times`);
    
    console.log('\nExecution Flow:');
    result.investigation.actualUsage.executionFlow.forEach(flow => {
      console.log(`   - ${flow.type}: ${flow.count} occurrences`);
    });
    
    console.log('\nError Handling:');
    result.investigation.errorAnalysis.errorHandlingPatterns.forEach(pattern => {
      console.log(`   - ${pattern.type}: ${pattern.count} occurrences`);
    });
    
  } else {
    console.log('\n❌ FAILED: Could not complete investigation');
    console.log(`Error: ${result.error}`);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { ClaudeCodeUsageInvestigation }; 