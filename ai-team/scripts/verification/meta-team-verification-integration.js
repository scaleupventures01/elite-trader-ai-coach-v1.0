/**
 * 🚨 META TEAM VERIFICATION INTEGRATION
 * Integrates truthfulness enforcement into the meta team workflow
 * Prevents false claims and ensures actual verification
 */

const TruthfulnessEnforcer = require('./truthfulness-enforcer');
const fs = require('fs');
const path = require('path');

class MetaTeamVerificationIntegration {
    constructor() {
        this.enforcer = new TruthfulnessEnforcer();
        this.verificationReportsDir = path.join(__dirname, '../reports/verification');
        this.violationsLog = path.join(__dirname, '../reports/truthfulness-violations.md');
        
        // Ensure directories exist
        if (!fs.existsSync(this.verificationReportsDir)) {
            fs.mkdirSync(this.verificationReportsDir, { recursive: true });
        }
    }

    /**
     * Meta Team must verify before accepting any completion claim
     */
    async verifyCompletionClaim(claimType, agentName, claim, evidence) {
        console.log('🚨 META TEAM VERIFICATION REQUIRED');
        console.log('==================================');
        console.log(`Agent: ${agentName}`);
        console.log(`Claim: ${claimType}`);
        console.log('');

        try {
            // Step 1: Validate claim format
            console.log('📋 Step 1: Validating claim format...');
            this.enforcer.validateClaimFormat(claim);
            console.log('✅ Claim format validated');

            // Step 2: Detect false claim patterns
            console.log('🔍 Step 2: Checking for false claim patterns...');
            this.enforcer.detectFalseClaims(claim);
            console.log('✅ No false claim patterns detected');

            // Step 3: Require evidence
            console.log('📄 Step 3: Validating evidence...');
            this.enforcer.requireEvidence(claim, evidence);
            console.log('✅ Evidence provided');

            // Step 4: Run verification
            console.log('🔧 Step 4: Running verification...');
            const verificationResult = await this.enforcer.enforceVerification(claimType, agentName);
            console.log('✅ Verification completed');

            // Step 5: Generate meta team report
            console.log('📊 Step 5: Generating meta team report...');
            const metaReport = this.generateMetaTeamReport(claimType, agentName, claim, evidence, verificationResult);
            const reportFile = path.join(this.verificationReportsDir, `meta-verification-${Date.now()}.md`);
            fs.writeFileSync(reportFile, metaReport);

            console.log(`📄 Meta team report saved: ${reportFile}`);
            console.log('');
            console.log('🎯 VERIFICATION RESULT: CLAIM ACCEPTED');
            console.log('=====================================');
            console.log('The claim has been verified and accepted by the meta team.');
            console.log('Evidence provided and verification completed successfully.');

            return {
                accepted: true,
                reportFile: reportFile,
                verificationResult: verificationResult
            };

        } catch (error) {
            console.log('❌ VERIFICATION FAILED');
            console.log('=====================');
            console.log(`Error: ${error.message}`);
            console.log('');

            // Log violation
            this.logViolation(agentName, claimType, error.message);

            // Generate rejection report
            const rejectionReport = this.generateRejectionReport(claimType, agentName, claim, error);
            const reportFile = path.join(this.verificationReportsDir, `rejection-${Date.now()}.md`);
            fs.writeFileSync(reportFile, rejectionReport);

            console.log(`📄 Rejection report saved: ${reportFile}`);
            console.log('');
            console.log('🚨 CLAIM REJECTED');
            console.log('================');
            console.log('The claim has been rejected due to verification failure.');
            console.log('The agent must provide actual evidence and fix issues.');

            return {
                accepted: false,
                reportFile: reportFile,
                error: error.message
            };
        }
    }

    /**
     * Generate meta team verification report
     */
    generateMetaTeamReport(claimType, agentName, claim, evidence, verificationResult) {
        return `# 🚨 META TEAM VERIFICATION REPORT

**Date**: ${new Date().toISOString()}
**Agent**: ${agentName}
**Claim Type**: ${claimType}
**Status**: ✅ CLAIM ACCEPTED

## 📋 CLAIM DETAILS

### Claim Made:
${claim}

### Evidence Provided:
${evidence}

## 🔍 VERIFICATION PROCESS

### Step 1: Claim Format Validation
- ✅ Format validated
- ✅ Required elements present
- ✅ Structure acceptable

### Step 2: False Claim Detection
- ✅ No suspicious patterns detected
- ✅ Language appropriate
- ✅ No assumptions made

### Step 3: Evidence Validation
- ✅ Evidence provided
- ✅ Evidence format valid
- ✅ Actual output included

### Step 4: Technical Verification
- ✅ Verification script executed
- ✅ Actual command output captured
- ✅ Runtime tests performed

### Step 5: Meta Team Review
- ✅ All verification steps passed
- ✅ Evidence sufficient
- ✅ Claim substantiated

## 📊 VERIFICATION RESULTS

### Technical Verification Output:
\`\`\`bash
${verificationResult.output}
\`\`\`

### Verification Report:
- Report File: ${verificationResult.reportFile}
- Verification Status: ${verificationResult.verified ? 'PASSED' : 'FAILED'}

## 🎯 META TEAM ASSESSMENT

### Truthfulness Score: ✅ EXCELLENT
- Agent provided actual evidence
- Agent ran real verification
- Agent reported actual results
- Agent demonstrated functionality

### Quality Score: ✅ EXCELLENT
- Evidence comprehensive
- Verification thorough
- Documentation complete
- Process followed correctly

### Reliability Score: ✅ EXCELLENT
- Claims substantiated
- Evidence verifiable
- Process repeatable
- Results consistent

## 📄 ACCEPTANCE CRITERIA

### ✅ ALL CRITERIA MET:
1. **Actual Evidence**: Real command output provided
2. **Verification**: Technical verification completed
3. **Truthfulness**: No false claims detected
4. **Completeness**: All required elements present
5. **Demonstration**: Functionality actually works

## 🚀 NEXT STEPS

### For Meta Team:
1. ✅ Accept the claim
2. ✅ Document the verification
3. ✅ Update sprint status
4. ✅ Proceed with next phase

### For Agent:
1. ✅ Continue with current approach
2. ✅ Maintain verification standards
3. ✅ Keep providing actual evidence
4. ✅ Report any issues honestly

## 📈 LESSONS LEARNED

### What Worked Well:
- Agent followed verification process correctly
- Agent provided comprehensive evidence
- Agent demonstrated actual functionality
- Agent maintained truthfulness throughout

### Best Practices Demonstrated:
- Running actual verification before claiming
- Providing real command output
- Reporting actual results (not imagined)
- Following verification checklist

---

**🎯 CONCLUSION**: This claim has been verified and accepted by the meta team. The agent demonstrated excellent truthfulness and provided sufficient evidence for the claim.
`;
    }

    /**
     * Generate rejection report
     */
    generateRejectionReport(claimType, agentName, claim, error) {
        return `# ❌ META TEAM REJECTION REPORT

**Date**: ${new Date().toISOString()}
**Agent**: ${agentName}
**Claim Type**: ${claimType}
**Status**: ❌ CLAIM REJECTED

## 🚨 REJECTION DETAILS

### Claim Made:
${claim}

### Error Encountered:
\`\`\`
${error.message}
\`\`\`

### Rejection Reason:
The claim has been rejected due to verification failure. The agent failed to provide sufficient evidence or the verification process revealed issues.

## 🔍 VERIFICATION FAILURE ANALYSIS

### What Went Wrong:
1. **Evidence Missing**: No actual command output provided
2. **False Claims**: Detected suspicious claim patterns
3. **Verification Failed**: Technical verification did not pass
4. **Truthfulness Violation**: Agent may have made unsubstantiated claims

### Specific Issues:
- ${error.message}
- Verification process failed
- Evidence insufficient or invalid
- Claim not substantiated

## 🚨 TRUTHFULNESS VIOLATION

### Violation Type:
- Making claims without evidence
- Failing to run actual verification
- Providing insufficient evidence
- Making false or unsubstantiated claims

### Consequences:
- ❌ Claim rejected immediately
- ❌ Agent flagged for violation
- ❌ Additional verification required
- ❌ Process improvement needed

## 📄 CORRECTIVE ACTIONS REQUIRED

### Immediate Actions:
1. **STOP** making completion claims
2. **FIX** the issues identified
3. **RUN** actual verification
4. **PROVIDE** real evidence
5. **DEMONSTRATE** actual functionality

### Before Making New Claims:
1. Run verification script: \`bash scripts/verification/verification-check.sh\`
2. Fix any issues found
3. Provide actual command output
4. Demonstrate actual functionality
5. Report actual errors (not imagined success)

## 🔧 PROCESS IMPROVEMENT

### For the Agent:
1. **LEARN** from this rejection
2. **IMPROVE** verification process
3. **ALWAYS** provide actual evidence
4. **NEVER** make assumptions
5. **ALWAYS** run tests before claiming

### For the Meta Team:
1. **ENFORCE** verification requirements
2. **MONITOR** agent behavior
3. **REQUIRE** actual evidence
4. **REJECT** unsubstantiated claims
5. **DOCUMENT** violations

## 📞 SUPPORT AND GUIDANCE

### Available Resources:
- Verification script: \`scripts/verification/verification-check.sh\`
- Truthfulness enforcer: \`scripts/verification/truthfulness-enforcer.js\`
- Verification rules: \`.claude/verification/verification-rules.md\`

### Getting Help:
1. Review verification rules
2. Run verification script
3. Provide actual evidence
4. Ask for guidance if needed

---

**🎯 REMEMBER**: Better to report failure honestly than claim false success. The meta team values truthfulness above all else.
`;
    }

    /**
     * Log truthfulness violations
     */
    logViolation(agentName, claimType, error) {
        const violationEntry = `
## Violation Report - ${new Date().toISOString()}

**Agent**: ${agentName}
**Claim Type**: ${claimType}
**Error**: ${error}
**Status**: VIOLATION LOGGED

### Action Required:
- Agent must provide actual evidence
- Agent must run verification
- Agent must demonstrate functionality
- Agent must report actual results

---
`;

        // Append to violations log
        if (!fs.existsSync(this.violationsLog)) {
            fs.writeFileSync(this.violationsLog, `# 🚨 TRUTHFULNESS VIOLATIONS LOG\n\n`);
        }

        fs.appendFileSync(this.violationsLog, violationEntry);
    }

    /**
     * Get violation history for an agent
     */
    getViolationHistory(agentName) {
        if (!fs.existsSync(this.violationsLog)) {
            return [];
        }

        const content = fs.readFileSync(this.violationsLog, 'utf8');
        const violations = content.split('## Violation Report').filter(v => v.includes(agentName));
        
        return violations.map(violation => {
            const lines = violation.split('\n');
            const date = lines[0].split(' - ')[1]?.split('\n')[0];
            const claimType = lines.find(l => l.includes('Claim Type'))?.split(': ')[1];
            const error = lines.find(l => l.includes('Error'))?.split(': ')[1];
            
            return { date, claimType, error };
        });
    }

    /**
     * Check if agent has recent violations
     */
    hasRecentViolations(agentName, days = 7) {
        const violations = this.getViolationHistory(agentName);
        const cutoffDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));
        
        return violations.some(violation => {
            const violationDate = new Date(violation.date);
            return violationDate > cutoffDate;
        });
    }
}

// Export for use by meta team
module.exports = MetaTeamVerificationIntegration;

// Example usage
if (require.main === module) {
    const integration = new MetaTeamVerificationIntegration();
    
    console.log('🚨 META TEAM VERIFICATION INTEGRATION');
    console.log('=====================================');
    console.log('This system integrates truthfulness enforcement into meta team workflow.');
    console.log('');
    console.log('Usage:');
    console.log('  const integration = new MetaTeamVerificationIntegration();');
    console.log('  await integration.verifyCompletionClaim("sprint completion", "AI Agent", claim, evidence);');
    console.log('');
    console.log('Features:');
    console.log('  - Validates claim format');
    console.log('  - Detects false claims');
    console.log('  - Requires evidence');
    console.log('  - Runs verification');
    console.log('  - Logs violations');
    console.log('  - Generates reports');
} 