#!/usr/bin/env node

const VerificationSystem = require('./verify-claims');
const fs = require('fs').promises;
const path = require('path');

class ClaimInterceptor {
  constructor() {
    this.verification = new VerificationSystem();
    this.interceptedClaims = [];
    this.hooksEnabled = true;
  }

  /**
   * Intercept and verify any completion claim
   */
  async interceptClaim(claim, agentName, claimType) {
    if (!this.hooksEnabled) {
      return { intercepted: false, reason: 'Hooks disabled' };
    }

    console.log('🚨 CLAIM INTERCEPTED');
    console.log('===================');
    console.log(`Agent: ${agentName}`);
    console.log(`Type: ${claimType}`);
    console.log(`Claim: ${claim.substring(0, 100)}...`);
    console.log('');

    const interception = {
      timestamp: new Date().toISOString(),
      agent: agentName,
      claimType: claimType,
      originalClaim: claim,
      verified: false,
      honest: false,
      evidence: {},
      action: 'PENDING'
    };

    try {
      // Analyze claim for suspicious patterns
      const suspiciousPatterns = this.detectSuspiciousPatterns(claim);
      if (suspiciousPatterns.length > 0) {
        interception.suspiciousPatterns = suspiciousPatterns;
        interception.action = 'REJECTED - Suspicious patterns detected';
        interception.honest = false;
        await this.logInterception(interception);
        return { intercepted: true, result: interception };
      }

      // Verify based on claim type
      let verificationResult;
      switch (claimType) {
        case 'development':
          verificationResult = await this.verifyDevelopmentClaim(claim, agentName);
          break;
        case 'qa':
          verificationResult = await this.verifyQAClaim(claim, agentName);
          break;
        case 'product_manager':
          verificationResult = await this.verifyPMClaim(claim, agentName);
          break;
        default:
          verificationResult = { honest: false, error: 'Unknown claim type' };
      }

      // Update interception with verification results
      Object.assign(interception, verificationResult);
      interception.verified = true;

      if (interception.honest) {
        interception.action = 'ACCEPTED - Claim verified';
      } else {
        interception.action = 'REJECTED - Claim not verified';
      }

    } catch (error) {
      interception.error = error.message;
      interception.action = 'ERROR - Verification failed';
      interception.honest = false;
    }

    await this.logInterception(interception);
    return { intercepted: true, result: interception };
  }

  /**
   * Detect suspicious patterns in claims
   */
  detectSuspiciousPatterns(claim) {
    const patterns = [
      { pattern: /should work/i, description: 'Assumption without proof' },
      { pattern: /probably works/i, description: 'Uncertainty disguised as fact' },
      { pattern: /might work/i, description: 'Speculation presented as truth' },
      { pattern: /appears to work/i, description: 'Visual assumption without testing' },
      { pattern: /seems to work/i, description: 'Subjective assessment without evidence' },
      { pattern: /looks like it works/i, description: 'Visual assessment without verification' },
      { pattern: /tests pass/i, description: 'Claim without test output' },
      { pattern: /all tests pass/i, description: 'Broad claim without evidence' },
      { pattern: /everything works/i, description: 'Overly broad claim' },
      { pattern: /complete and working/i, description: 'Completion claim without proof' },
      { pattern: /fully functional/i, description: 'Functionality claim without demonstration' },
      { pattern: /ready for production/i, description: 'Production readiness without validation' }
    ];

    const detected = [];
    for (const { pattern, description } of patterns) {
      if (pattern.test(claim)) {
        detected.push({ pattern: pattern.source, description });
      }
    }

    return detected;
  }

  /**
   * Verify development claims
   */
  async verifyDevelopmentClaim(claim, agentName) {
    // Extract claimed features from the claim
    const claimedFeatures = this.extractClaimedFeatures(claim);
    
    if (claimedFeatures.length === 0) {
      return {
        honest: false,
        error: 'No specific features identified in claim',
        evidence: { claim }
      };
    }

    // Run verification
    const result = await this.verification.verifyDevClaims(claimedFeatures, agentName);
    
    return {
      honest: result.honest,
      verifiedFeatures: result.verified,
      failedFeatures: result.failed,
      evidence: result.evidence,
      error: result.error
    };
  }

  /**
   * Verify QA claims
   */
  async verifyQAClaim(claim, agentName) {
    // Extract test report from claim
    const testReport = this.extractTestReport(claim);
    
    if (!testReport) {
      return {
        honest: false,
        error: 'No test report found in claim',
        evidence: { claim }
      };
    }

    // Run verification
    const result = await this.verification.verifyQAClaims(testReport, agentName);
    
    return {
      honest: result.honest,
      claimedCoverage: result.claimed,
      actualCoverage: result.actual,
      discrepancy: result.discrepancy,
      evidence: result.evidence,
      error: result.error
    };
  }

  /**
   * Verify Product Manager claims
   */
  async verifyPMClaim(claim, agentName) {
    // Extract sprint report from claim
    const sprintReport = this.extractSprintReport(claim);
    
    if (!sprintReport) {
      return {
        honest: false,
        error: 'No sprint report found in claim',
        evidence: { claim }
      };
    }

    // Run verification
    const result = await this.verification.verifyPMClaims(sprintReport, agentName);
    
    return {
      honest: result.honest,
      verifiedFeatures: result.verified,
      failedFeatures: result.failed,
      demoVerification: result.demoVerification,
      teamVerification: result.teamVerification,
      evidence: result.evidence,
      error: result.error
    };
  }

  /**
   * Extract claimed features from development claim
   */
  extractClaimedFeatures(claim) {
    // Look for feature mentions in the claim
    const featureKeywords = [
      'authentication', 'auth', 'login', 'logout',
      'user profile', 'profile', 'user management',
      'api', 'endpoint', 'backend', 'frontend',
      'database', 'db', 'storage',
      'dashboard', 'analytics', 'reporting',
      'trade', 'trading', 'journal', 'platform'
    ];

    const features = [];
    const lowerClaim = claim.toLowerCase();
    
    for (const keyword of featureKeywords) {
      if (lowerClaim.includes(keyword)) {
        features.push(keyword);
      }
    }

    return features;
  }

  /**
   * Extract test report from QA claim
   */
  extractTestReport(claim) {
    // Look for coverage numbers
    const coverageMatch = claim.match(/(\d+(?:\.\d+)?)%?\s*coverage/i);
    if (coverageMatch) {
      return {
        coverage: parseFloat(coverageMatch[1]),
        source: 'coverage percentage'
      };
    }

    // Look for test results
    const testMatch = claim.match(/(\d+)\s+passing.*?(\d+)\s+failing/i);
    if (testMatch) {
      return {
        passing: parseInt(testMatch[1]),
        failing: parseInt(testMatch[2]),
        source: 'test results'
      };
    }

    return null;
  }

  /**
   * Extract sprint report from PM claim
   */
  extractSprintReport(claim) {
    // Look for sprint status
    const statusMatch = claim.match(/sprint\s+(\w+)\s+(complete|done|finished)/i);
    if (statusMatch) {
      return {
        sprint: statusMatch[1],
        status: statusMatch[2],
        source: 'sprint status'
      };
    }

    // Look for feature counts
    const featureMatch = claim.match(/(\d+)\s+features?\s+(complete|done|finished)/i);
    if (featureMatch) {
      return {
        featuresComplete: parseInt(featureMatch[1]),
        status: featureMatch[2],
        source: 'feature count'
      };
    }

    return null;
  }

  /**
   * Log interception results
   */
  async logInterception(interception) {
    try {
      const logFile = path.join(__dirname, '../logs/interceptions.json');
      const logDir = path.dirname(logFile);
      
      // Ensure directory exists
      await fs.mkdir(logDir, { recursive: true });
      
      // Read existing log
      let log = [];
      try {
        const logData = await fs.readFile(logFile, 'utf8');
        log = JSON.parse(logData);
      } catch (error) {
        // File doesn't exist or is empty, start fresh
      }
      
      // Add new interception
      log.push(interception);
      
      // Keep only last 100 entries
      if (log.length > 100) {
        log = log.slice(-100);
      }
      
      // Write updated log
      await fs.writeFile(logFile, JSON.stringify(log, null, 2));
      
      // Console output
      console.log('📊 INTERCEPTION RESULT');
      console.log('=====================');
      console.log(`Action: ${interception.action}`);
      console.log(`Honest: ${interception.honest ? '✅ YES' : '❌ NO'}`);
      console.log(`Verified: ${interception.verified ? '✅ YES' : '❌ NO'}`);
      
      if (interception.suspiciousPatterns) {
        console.log('🚨 Suspicious Patterns:');
        interception.suspiciousPatterns.forEach(pattern => {
          console.log(`   - ${pattern.description}`);
        });
      }
      
      if (interception.error) {
        console.log(`❌ Error: ${interception.error}`);
      }
      
      console.log('');
      
    } catch (error) {
      console.error('Failed to log interception:', error.message);
    }
  }

  /**
   * Enable or disable hooks
   */
  setHooksEnabled(enabled) {
    this.hooksEnabled = enabled;
    console.log(`🔧 Hooks ${enabled ? 'ENABLED' : 'DISABLED'}`);
  }

  /**
   * Get interception statistics
   */
  async getInterceptionStats(days = 7) {
    try {
      const logFile = path.join(__dirname, '../logs/interceptions.json');
      const logData = await fs.readFile(logFile, 'utf8');
      const log = JSON.parse(logData);
      
      const cutoffDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));
      const recent = log.filter(entry => 
        new Date(entry.timestamp) > cutoffDate
      );
      
      const stats = {
        total: recent.length,
        honest: recent.filter(entry => entry.honest).length,
        dishonest: recent.filter(entry => !entry.honest).length,
        verified: recent.filter(entry => entry.verified).length,
        rejected: recent.filter(entry => entry.action.includes('REJECTED')).length,
        byAgent: {},
        byType: {}
      };
      
      // Group by agent
      recent.forEach(entry => {
        if (!stats.byAgent[entry.agent]) {
          stats.byAgent[entry.agent] = { total: 0, honest: 0, dishonest: 0 };
        }
        stats.byAgent[entry.agent].total++;
        if (entry.honest) {
          stats.byAgent[entry.agent].honest++;
        } else {
          stats.byAgent[entry.agent].dishonest++;
        }
      });
      
      // Group by type
      recent.forEach(entry => {
        if (!stats.byType[entry.claimType]) {
          stats.byType[entry.claimType] = { total: 0, honest: 0, dishonest: 0 };
        }
        stats.byType[entry.claimType].total++;
        if (entry.honest) {
          stats.byType[entry.claimType].honest++;
        } else {
          stats.byType[entry.claimType].dishonest++;
        }
      });
      
      return stats;
      
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * Auto-intercept function for easy integration
   */
  async autoIntercept(claim, agentName, claimType) {
    const result = await this.interceptClaim(claim, agentName, claimType);
    
    if (result.intercepted && !result.result.honest) {
      // Return rejection message
      return {
        accepted: false,
        reason: result.result.action,
        details: result.result,
        message: `🚨 CLAIM REJECTED: ${result.result.action}. Please provide actual evidence.`
      };
    }
    
    return {
      accepted: true,
      verified: result.result.verified,
      message: `✅ CLAIM ACCEPTED: Verification completed successfully.`
    };
  }
}

// Export for use
module.exports = ClaimInterceptor;

// CLI usage
if (require.main === module) {
  const interceptor = new ClaimInterceptor();
  
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.log('🚨 CLAIM INTERCEPTOR');
    console.log('===================');
    console.log('');
    console.log('Usage:');
    console.log('  node claim-interceptor.js "claim text" "agent name" "claim type"');
    console.log('');
    console.log('Claim Types:');
    console.log('  - development');
    console.log('  - qa');
    console.log('  - product_manager');
    console.log('');
    console.log('Examples:');
    console.log('  node claim-interceptor.js "Authentication system is complete" "Developer Agent" "development"');
    console.log('  node claim-interceptor.js "All tests pass with 85% coverage" "QA Agent" "qa"');
    console.log('  node claim-interceptor.js "Sprint 2 is complete" "PM Agent" "product_manager"');
    process.exit(1);
  }
  
  const [claim, agentName, claimType] = args;
  
  console.log('🚨 CLAIM INTERCEPTOR');
  console.log('===================');
  console.log('');
  console.log(`Claim: ${claim}`);
  console.log(`Agent: ${agentName}`);
  console.log(`Type: ${claimType}`);
  console.log('');
  
  // Run the interception
  interceptor.interceptClaim(claim, agentName, claimType)
    .then(result => {
      console.log('✅ Interception completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Interception failed:', error.message);
      process.exit(1);
    });
} 