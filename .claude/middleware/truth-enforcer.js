#!/usr/bin/env node

const ClaimInterceptor = require('../hooks/claim-interceptor');
const VerificationSystem = require('../hooks/verify-claims');
const fs = require('fs').promises;
const path = require('path');

class TruthEnforcer {
  constructor() {
    this.violations = [];
    this.interceptor = new ClaimInterceptor();
    this.verification = new VerificationSystem();
    this.enforcementLog = path.join(__dirname, '../logs/enforcement-log.json');
    this.ensureLogDirectory();
  }

  async ensureLogDirectory() {
    const logDir = path.dirname(this.enforcementLog);
    try {
      await fs.mkdir(logDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
  }

  /**
   * Intercept and validate agent claims
   */
  async interceptAgentClaim(agent, claim) {
    console.log('🚨 TRUTH ENFORCER: Intercepting claim');
    console.log(`Agent: ${agent}`);
    console.log(`Claim: ${claim.substring(0, 100)}...`);
    console.log('');

    const enforcement = {
      timestamp: new Date().toISOString(),
      agent: agent,
      claim: claim,
      allowed: false,
      reason: '',
      warnings: [],
      evidence: {}
    };

    try {
      // Step 1: Check for suspicious phrases
      const suspiciousPhrases = [
        'all tests pass',
        'everything works',
        'implementation complete',
        '100% coverage',
        'no errors',
        'should work',
        'probably works',
        'might work',
        'appears to work',
        'seems to work',
        'looks like it works',
        'complete and working',
        'fully functional',
        'ready for production'
      ];

      const detectedPhrases = suspiciousPhrases.filter(phrase => 
        claim.toLowerCase().includes(phrase)
      );

      if (detectedPhrases.length > 0) {
        enforcement.warnings.push(`Suspicious phrases detected: ${detectedPhrases.join(', ')}`);
        enforcement.evidence.suspiciousPhrases = detectedPhrases;
      }

      // Step 2: Check for proof requirements
      const requiresProof = detectedPhrases.length > 0 || this.requiresProof(claim);
      
      if (requiresProof && !this.hasProof(claim)) {
        enforcement.allowed = false;
        enforcement.reason = 'Claim without proof';
        enforcement.evidence.missingProof = {
          requiresProof: requiresProof,
          hasCodeBlock: this.hasCodeBlock(claim),
          hasCommandOutput: this.hasCommandOutput(claim),
          hasEvidence: this.hasEvidence(claim)
        };

        await this.logViolation(enforcement);
        
        return {
          allowed: false,
          message: `❌ ${agent}: Please provide actual command output to support your claim.`,
          details: {
            suspiciousPhrases: detectedPhrases,
            missingProof: enforcement.evidence.missingProof
          }
        };
      }

      // Step 3: Run verification if claim type can be determined
      const claimType = this.determineClaimType(claim);
      if (claimType) {
        console.log(`🔍 Running verification for ${claimType} claim...`);
        
        const verificationResult = await this.interceptor.interceptClaim(claim, agent, claimType);
        
        if (verificationResult.intercepted && !verificationResult.result.honest) {
          enforcement.allowed = false;
          enforcement.reason = 'Verification failed';
          enforcement.evidence.verificationResult = verificationResult.result;
          
          await this.logViolation(enforcement);
          
          return {
            allowed: false,
            message: `❌ ${agent}: Claim verification failed. Please provide actual evidence.`,
            details: verificationResult.result
          };
        }
        
        enforcement.evidence.verificationResult = verificationResult.result;
      }

      // Step 4: Check for made-up data
      const honestyCheck = await this.enforceHonesty(agent, claim);
      if (honestyCheck) {
        enforcement.warnings.push(honestyCheck.warning);
      }

      // Step 5: Final decision
      if (enforcement.warnings.length > 0 && !this.hasProof(claim)) {
        enforcement.allowed = false;
        enforcement.reason = 'Multiple warnings without proof';
      } else {
        enforcement.allowed = true;
        enforcement.reason = 'Claim validated';
      }

    } catch (error) {
      enforcement.allowed = false;
      enforcement.reason = 'Enforcement error';
      enforcement.error = error.message;
    }

    await this.logEnforcement(enforcement);
    
    if (enforcement.allowed) {
      return { 
        allowed: true,
        warnings: enforcement.warnings
      };
    } else {
      return {
        allowed: false,
        message: `❌ ${agent}: ${enforcement.reason}`,
        details: enforcement.evidence
      };
    }
  }

  /**
   * Check if claim requires proof
   */
  requiresProof(claim) {
    const proofTriggers = [
      'complete', 'finished', 'done', 'working', 'functional',
      'test', 'coverage', 'pass', 'fail', 'error', 'bug',
      'implement', 'deploy', 'release', 'production'
    ];

    return proofTriggers.some(trigger => 
      claim.toLowerCase().includes(trigger)
    );
  }

  /**
   * Check if claim has proof
   */
  hasProof(claim) {
    return this.hasCodeBlock(claim) || 
           this.hasCommandOutput(claim) || 
           this.hasEvidence(claim);
  }

  /**
   * Check for code blocks
   */
  hasCodeBlock(claim) {
    return claim.includes('```') && claim.includes('```');
  }

  /**
   * Check for command output
   */
  hasCommandOutput(claim) {
    const outputPatterns = [
      /\$ [^\n]+\n[^\n]+/g,  // Command followed by output
      /npm test[^\n]*\n[^\n]+/g,  // npm test output
      /node [^\n]*\n[^\n]+/g,  // node command output
      /git [^\n]*\n[^\n]+/g,  // git command output
      /curl [^\n]*\n[^\n]+/g,  // curl command output
      /Error:/g,  // Error messages
      /Warning:/g,  // Warning messages
      /PASS/g,  // Test pass indicators
      /FAIL/g,  // Test fail indicators
      /coverage:/g,  // Coverage indicators
    ];

    return outputPatterns.some(pattern => pattern.test(claim));
  }

  /**
   * Check for evidence indicators
   */
  hasEvidence(claim) {
    const evidencePatterns = [
      /actual output/i,
      /real test/i,
      /command output/i,
      /terminal output/i,
      /test results/i,
      /coverage report/i,
      /error message/i,
      /verification/i,
      /evidence/i,
      /proof/i
    ];

    return evidencePatterns.some(pattern => pattern.test(claim));
  }

  /**
   * Determine claim type
   */
  determineClaimType(claim) {
    const lowerClaim = claim.toLowerCase();
    
    if (lowerClaim.includes('test') || lowerClaim.includes('coverage') || 
        lowerClaim.includes('qa') || lowerClaim.includes('quality')) {
      return 'qa';
    }
    
    if (lowerClaim.includes('sprint') || lowerClaim.includes('complete') || 
        lowerClaim.includes('demo') || lowerClaim.includes('deliverable')) {
      return 'product_manager';
    }
    
    if (lowerClaim.includes('implement') || lowerClaim.includes('code') || 
        lowerClaim.includes('feature') || lowerClaim.includes('bug')) {
      return 'development';
    }
    
    return null;
  }

  /**
   * Enforce honesty in agent messages
   */
  async enforceHonesty(agent, message) {
    const warnings = [];

    // Check for made-up percentages
    const percentagePattern = /\d+(\.\d+)?%/g;
    const percentages = message.match(percentagePattern);
    
    if (percentages && !this.hasProof(message)) {
      warnings.push(`⚠️ ${agent}: If citing metrics (${percentages.join(', ')}), please show how you obtained them.`);
    }

    // Check for made-up numbers
    const numberPattern = /\b\d{2,}\b/g;
    const numbers = message.match(numberPattern);
    
    if (numbers && !this.hasProof(message)) {
      const suspiciousNumbers = numbers.filter(n => parseInt(n) > 10);
      if (suspiciousNumbers.length > 0) {
        warnings.push(`⚠️ ${agent}: If citing numbers (${suspiciousNumbers.join(', ')}), please provide evidence.`);
      }
    }

    // Check for absolute statements
    const absolutePatterns = [
      /all tests pass/i,
      /everything works/i,
      /no errors/i,
      /100% complete/i,
      /fully functional/i,
      /ready for production/i
    ];

    const absoluteMatches = absolutePatterns.filter(pattern => pattern.test(message));
    if (absoluteMatches.length > 0 && !this.hasProof(message)) {
      warnings.push(`⚠️ ${agent}: Absolute statements (${absoluteMatches.join(', ')}) require proof.`);
    }

    return warnings.length > 0 ? { warning: warnings.join(' ') } : null;
  }

  /**
   * Log enforcement decision
   */
  async logEnforcement(enforcement) {
    try {
      let log = [];
      try {
        const logData = await fs.readFile(this.enforcementLog, 'utf8');
        log = JSON.parse(logData);
      } catch (error) {
        // File doesn't exist or is empty, start fresh
      }
      
      log.push(enforcement);
      
      // Keep only last 100 entries
      if (log.length > 100) {
        log = log.slice(-100);
      }
      
      await fs.writeFile(this.enforcementLog, JSON.stringify(log, null, 2));
      
    } catch (error) {
      console.error('Failed to log enforcement:', error.message);
    }
  }

  /**
   * Log violation
   */
  async logViolation(enforcement) {
    this.violations.push({
      timestamp: enforcement.timestamp,
      agent: enforcement.agent,
      claim: enforcement.claim,
      reason: enforcement.reason,
      evidence: enforcement.evidence
    });

    console.log('🚨 VIOLATION LOGGED');
    console.log(`Agent: ${enforcement.agent}`);
    console.log(`Reason: ${enforcement.reason}`);
    console.log(`Action: Requires immediate correction`);
  }

  /**
   * Get enforcement statistics
   */
  async getEnforcementStats(days = 7) {
    try {
      const logData = await fs.readFile(this.enforcementLog, 'utf8');
      const log = JSON.parse(logData);
      
      const cutoffDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));
      const recent = log.filter(entry => 
        new Date(entry.timestamp) > cutoffDate
      );
      
      const stats = {
        total: recent.length,
        allowed: recent.filter(entry => entry.allowed).length,
        blocked: recent.filter(entry => !entry.allowed).length,
        violations: this.violations.length,
        byAgent: {},
        byReason: {}
      };
      
      // Group by agent
      recent.forEach(entry => {
        if (!stats.byAgent[entry.agent]) {
          stats.byAgent[entry.agent] = { total: 0, allowed: 0, blocked: 0 };
        }
        stats.byAgent[entry.agent].total++;
        if (entry.allowed) {
          stats.byAgent[entry.agent].allowed++;
        } else {
          stats.byAgent[entry.agent].blocked++;
        }
      });
      
      // Group by reason
      recent.forEach(entry => {
        if (!stats.byReason[entry.reason]) {
          stats.byReason[entry.reason] = 0;
        }
        stats.byReason[entry.reason]++;
      });
      
      return stats;
      
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * Get recent violations
   */
  getRecentViolations(count = 10) {
    return this.violations.slice(-count);
  }

  /**
   * Clear violations (for testing)
   */
  clearViolations() {
    this.violations = [];
    console.log('🧹 Violations cleared');
  }

  /**
   * Enable/disable enforcement
   */
  setEnforcementEnabled(enabled) {
    this.enforcementEnabled = enabled;
    console.log(`🔧 Truth enforcement ${enabled ? 'ENABLED' : 'DISABLED'}`);
  }
}

// Export for use
module.exports = TruthEnforcer;

// CLI usage
if (require.main === module) {
  const enforcer = new TruthEnforcer();
  
  console.log('🚨 TRUTH ENFORCER');
  console.log('=================');
  console.log('');
  console.log('Usage:');
  console.log('  node truth-enforcer.js "claim text" "agent name"');
  console.log('');
  console.log('Examples:');
  console.log('  node truth-enforcer.js "All tests pass" "Developer Agent"');
  console.log('  node truth-enforcer.js "85% coverage achieved" "QA Agent"');
  console.log('  node truth-enforcer.js "Sprint complete" "PM Agent"');
  
  const args = process.argv.slice(2);
  if (args.length >= 2) {
    const [claim, agent] = args;
    
    console.log('');
    console.log('Testing enforcement...');
    console.log(`Claim: ${claim}`);
    console.log(`Agent: ${agent}`);
    console.log('');
    
    enforcer.interceptAgentClaim(agent, claim)
      .then(result => {
        console.log('Result:', result);
        process.exit(0);
      })
      .catch(error => {
        console.error('Error:', error.message);
        process.exit(1);
      });
  }
} 