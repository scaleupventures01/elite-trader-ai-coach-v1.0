/**
 * 🚨 TRUTHFULNESS ENFORCER
 * This system prevents AI agents from making false claims
 * It requires actual evidence before accepting any completion claims
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class TruthfulnessEnforcer {
    constructor() {
        this.verificationRules = path.join(__dirname, '../../.claude/verification/verification-rules.md');
        this.verificationScript = path.join(__dirname, 'verification-check.sh');
        this.reportsDir = path.join(__dirname, '../reports');
    }

    /**
     * Enforce verification before accepting any completion claim
     */
    async enforceVerification(claimType, agentName) {
        console.log('🚨 TRUTHFULNESS ENFORCEMENT ACTIVATED');
        console.log('=====================================');
        console.log(`Agent: ${agentName}`);
        console.log(`Claim Type: ${claimType}`);
        console.log('');

        // Check if verification script exists
        if (!fs.existsSync(this.verificationScript)) {
            throw new Error('❌ VERIFICATION SCRIPT NOT FOUND - Cannot verify claims');
        }

        // Run verification
        console.log('🔍 RUNNING MANDATORY VERIFICATION...');
        try {
            const output = execSync(`bash ${this.verificationScript}`, { 
                encoding: 'utf8',
                cwd: process.cwd()
            });
            
            console.log('📋 VERIFICATION OUTPUT:');
            console.log(output);
            
            // Generate verification report
            const report = this.generateVerificationReport(claimType, agentName, output);
            
            // Save report
            const reportFile = path.join(this.reportsDir, `verification-${Date.now()}.md`);
            fs.writeFileSync(reportFile, report);
            
            console.log(`📄 Verification report saved: ${reportFile}`);
            
            return {
                verified: true,
                output: output,
                reportFile: reportFile
            };
            
        } catch (error) {
            console.log('❌ VERIFICATION FAILED:');
            console.log(error.message);
            
            const failureReport = this.generateFailureReport(claimType, agentName, error);
            const reportFile = path.join(this.reportsDir, `verification-failure-${Date.now()}.md`);
            fs.writeFileSync(reportFile, failureReport);
            
            throw new Error(`❌ CLAIM REJECTED: Verification failed. See ${reportFile}`);
        }
    }

    /**
     * Generate verification report
     */
    generateVerificationReport(claimType, agentName, output) {
        return `# 🚨 TRUTHFULNESS VERIFICATION REPORT

**Date**: ${new Date().toISOString()}
**Agent**: ${agentName}
**Claim Type**: ${claimType}
**Status**: VERIFICATION COMPLETED

## 📋 VERIFICATION OUTPUT

\`\`\`bash
${output}
\`\`\`

## 🎯 TRUTHFULNESS ASSESSMENT

### Required Evidence Checklist:
- [ ] Actual command output provided
- [ ] Real test results shown
- [ ] Actual error messages included (if any)
- [ ] Runtime verification completed
- [ ] Feature functionality demonstrated

### Verification Status:
**OVERALL STATUS**: [PASS/FAIL] based on actual results

## 📄 EVIDENCE REQUIREMENTS

For this claim to be accepted, the following evidence MUST be provided:

1. **Actual Command Output**: Real terminal output from verification script
2. **Test Results**: Actual test results with coverage numbers
3. **Runtime Verification**: Proof that features actually work
4. **Error Reporting**: Any actual errors encountered
5. **Demonstration**: Ability to demonstrate functionality

## 🚨 ENFORCEMENT RULES

### MANDATORY REQUIREMENTS:
1. **NEVER** claim completion without running actual verification
2. **ALWAYS** paste real command output
3. **ALWAYS** report actual errors and failures
4. **NEVER** invent test results or metrics
5. **ALWAYS** demonstrate actual functionality

### VIOLATION CONSEQUENCES:
- ❌ Claim rejected immediately
- ❌ Agent flagged for truthfulness violation
- ❌ Additional verification required
- ❌ System shutdown if repeated violations

## 📞 NEXT STEPS

1. **If Verification PASSED**: Provide additional evidence as required
2. **If Verification FAILED**: Fix issues and re-verify
3. **If Evidence Missing**: Provide actual evidence before proceeding

---

**🎯 REMEMBER**: Truthfulness is non-negotiable. Only claim success with actual proof.
`;
    }

    /**
     * Generate failure report
     */
    generateFailureReport(claimType, agentName, error) {
        return `# ❌ TRUTHFULNESS VERIFICATION FAILURE

**Date**: ${new Date().toISOString()}
**Agent**: ${agentName}
**Claim Type**: ${claimType}
**Status**: VERIFICATION FAILED

## 🚨 FAILURE DETAILS

### Error Encountered:
\`\`\`
${error.message}
\`\`\`

### Claim Rejected:
The claim "${claimType}" by agent "${agentName}" has been **REJECTED** due to verification failure.

## 🔍 REQUIRED ACTIONS

### Immediate Actions:
1. **STOP** making completion claims
2. **FIX** the issues identified in verification
3. **RE-RUN** verification after fixes
4. **PROVIDE** actual evidence of functionality

### Before Making New Claims:
1. Run verification script: \`bash scripts/verification/verification-check.sh\`
2. Fix any issues found
3. Provide actual command output
4. Demonstrate actual functionality
5. Report actual errors (not imagined success)

## 🚨 TRUTHFULNESS VIOLATION

This failure indicates a potential truthfulness violation:
- ❌ Claim made without actual verification
- ❌ No evidence provided
- ❌ Verification failed when attempted

### Consequences:
- Agent flagged for truthfulness violation
- Additional verification required for future claims
- System monitoring increased

## 📄 CORRECTIVE ACTIONS

1. **IMMEDIATE**: Stop making unverified claims
2. **FIX**: Address verification failures
3. **VERIFY**: Run actual tests and provide output
4. **DEMONSTRATE**: Show actual working functionality
5. **DOCUMENT**: Provide real evidence

---

**🎯 REMEMBER**: Better to report failure honestly than claim false success.
`;
    }

    /**
     * Validate completion claim format
     */
    validateClaimFormat(claim) {
        const requiredElements = [
            'actual command output',
            'real test results',
            'actual error messages',
            'runtime verification',
            'feature demonstration'
        ];

        const missingElements = requiredElements.filter(element => 
            !claim.toLowerCase().includes(element)
        );

        if (missingElements.length > 0) {
            throw new Error(`❌ CLAIM FORMAT INVALID: Missing required elements: ${missingElements.join(', ')}`);
        }

        return true;
    }

    /**
     * Check for common false claim patterns
     */
    detectFalseClaims(claim) {
        const falseClaimPatterns = [
            'should work',
            'probably works',
            'might work',
            'appears to work',
            'seems to work',
            'looks like it works',
            'tests pass',
            'all tests pass',
            'everything works',
            'complete and working',
            'fully functional',
            'ready for production'
        ];

        const detectedPatterns = falseClaimPatterns.filter(pattern => 
            claim.toLowerCase().includes(pattern)
        );

        if (detectedPatterns.length > 0) {
            throw new Error(`❌ FALSE CLAIM DETECTED: Found suspicious patterns: ${detectedPatterns.join(', ')}`);
        }

        return true;
    }

    /**
     * Require evidence for any completion claim
     */
    requireEvidence(claim, evidence) {
        if (!evidence || evidence.trim() === '') {
            throw new Error('❌ EVIDENCE REQUIRED: No evidence provided for completion claim');
        }

        if (!evidence.includes('actual output') && !evidence.includes('real result')) {
            throw new Error('❌ EVIDENCE INVALID: Evidence must include actual output or real results');
        }

        return true;
    }
}

// Export for use by AI agents
module.exports = TruthfulnessEnforcer;

// Example usage
if (require.main === module) {
    const enforcer = new TruthfulnessEnforcer();
    
    console.log('🚨 TRUTHFULNESS ENFORCER ACTIVE');
    console.log('================================');
    console.log('This system prevents false claims by AI agents.');
    console.log('');
    console.log('Usage:');
    console.log('  const enforcer = new TruthfulnessEnforcer();');
    console.log('  await enforcer.enforceVerification("sprint completion", "AI Agent");');
    console.log('');
    console.log('Rules:');
    console.log('  1. Never claim completion without proof');
    console.log('  2. Always run code before claiming it works');
    console.log('  3. Data must be real');
    console.log('  4. Provide actual command output');
    console.log('  5. Report actual errors');
} 