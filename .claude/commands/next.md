# /next Command - Continue Workflow with Verification

## Overview

The `/next` command continues the workflow but includes mandatory verification checks to ensure all agent claims are truthful and supported by evidence.

## 🔍 Verification Process

When user types `/next`:

### 1. **Verification Check**
```javascript
const lastPhase = await getLastPhase();
const claims = await getAgentClaims(lastPhase);

if (claims.requiresVerification) {
  console.log('🔍 Verifying claims before proceeding...');
  const verification = await runVerification(claims);
  
  if (!verification.passed) {
    console.log('❌ Verification failed:');
    console.log(verification.issues);
    console.log('Please address these issues before continuing.');
    return;
  }
}
```

### 2. **Truth Enforcement**
```javascript
const TruthEnforcer = require('../middleware/truth-enforcer');
const enforcer = new TruthEnforcer();

// Check all recent agent claims
const recentClaims = await getRecentClaims();
for (const claim of recentClaims) {
  const result = await enforcer.interceptAgentClaim(claim.agent, claim.text);
  
  if (!result.allowed) {
    console.log('🚨 CLAIM BLOCKED:');
    console.log(result.message);
    console.log('Please provide evidence before continuing.');
    return;
  }
}
```

### 3. **Claim Validation**
```javascript
// Validate specific claim types
const claimTypes = ['development', 'qa', 'product_manager'];
for (const type of claimTypes) {
  const typeClaims = recentClaims.filter(c => c.type === type);
  
  if (typeClaims.length > 0) {
    const verification = await verifyClaimType(type, typeClaims);
    
    if (!verification.honest) {
      console.log(`❌ ${type} claims not verified:`);
      console.log(verification.issues);
      return;
    }
  }
}
```

## 🚨 Verification Requirements

### Development Claims:
- **Code must actually run** without errors
- **Tests must pass** with real output
- **Features must work** as specified
- **Build process** must succeed

### QA Claims:
- **Test coverage** must be accurate
- **All tests** must actually pass
- **Coverage numbers** must be real
- **Test results** must be valid

### Product Manager Claims:
- **Features** must actually work
- **Demo** must be ready and functional
- **Team status** must be accurate
- **Sprint completion** must be real

## 📋 Verification Checklist

### Before Proceeding:
- [ ] **All agent claims verified** with actual evidence
- [ ] **No suspicious patterns** detected in claims
- [ ] **Command output provided** for all assertions
- [ ] **Tests actually run** and show real results
- [ ] **Features actually work** as claimed
- [ ] **No false claims** identified
- [ ] **Violations addressed** and corrected

### If Verification Fails:
- [ ] **Block progression** until issues resolved
- [ ] **Request specific evidence** for failed claims
- [ ] **Log violations** for tracking
- [ ] **Provide clear guidance** on what's needed
- [ ] **Allow retry** after evidence provided

## 🔧 Implementation

### Truth Enforcer Integration:
```javascript
const TruthEnforcer = require('../middleware/truth-enforcer');

class WorkflowManager {
  async next() {
    console.log('🚨 WORKFLOW VERIFICATION');
    console.log('========================');
    
    // Initialize truth enforcer
    const enforcer = new TruthEnforcer();
    
    // Get recent claims
    const recentClaims = await this.getRecentClaims();
    
    // Verify each claim
    for (const claim of recentClaims) {
      const result = await enforcer.interceptAgentClaim(claim.agent, claim.text);
      
      if (!result.allowed) {
        console.log('❌ WORKFLOW BLOCKED');
        console.log(`Agent: ${claim.agent}`);
        console.log(`Issue: ${result.message}`);
        console.log('');
        console.log('Please provide evidence before continuing.');
        return { success: false, reason: result.message };
      }
      
      if (result.warnings && result.warnings.length > 0) {
        console.log('⚠️ WARNINGS:');
        result.warnings.forEach(warning => console.log(`  ${warning}`));
      }
    }
    
    // All claims verified, proceed
    console.log('✅ ALL CLAIMS VERIFIED');
    console.log('Proceeding with workflow...');
    
    return { success: true };
  }
}
```

### Claim Verification:
```javascript
async function verifyClaimType(type, claims) {
  const ClaimInterceptor = require('../hooks/claim-interceptor');
  const interceptor = new ClaimInterceptor();
  
  for (const claim of claims) {
    const result = await interceptor.interceptClaim(
      claim.text, 
      claim.agent, 
      type
    );
    
    if (result.intercepted && !result.result.honest) {
      return {
        honest: false,
        issues: [result.result]
      };
    }
  }
  
  return { honest: true };
}
```

## 📊 Verification Statistics

### Available Metrics:
```javascript
// Get enforcement statistics
const stats = await enforcer.getEnforcementStats(7);

console.log('📊 VERIFICATION STATISTICS');
console.log('==========================');
console.log(`Total Claims: ${stats.total}`);
console.log(`Allowed: ${stats.allowed}`);
console.log(`Blocked: ${stats.blocked}`);
console.log(`Violations: ${stats.violations}`);
```

### Agent Performance:
```javascript
// Check agent-specific statistics
for (const [agent, data] of Object.entries(stats.byAgent)) {
  console.log(`${agent}:`);
  console.log(`  Total: ${data.total}`);
  console.log(`  Allowed: ${data.allowed}`);
  console.log(`  Blocked: ${data.blocked}`);
  console.log(`  Success Rate: ${((data.allowed / data.total) * 100).toFixed(1)}%`);
}
```

## 🎯 Usage Examples

### Basic Usage:
```
/next
```

**Output if verification passes:**
```
🚨 WORKFLOW VERIFICATION
========================
✅ ALL CLAIMS VERIFIED
Proceeding with workflow...
```

**Output if verification fails:**
```
🚨 WORKFLOW VERIFICATION
========================
❌ WORKFLOW BLOCKED
Agent: Developer Agent
Issue: ❌ Developer Agent: Please provide actual command output to support your claim.

Please provide evidence before continuing.
```

### With Specific Verification:
```
/next --verify-all
```

**Additional verification steps:**
```
🔍 Running comprehensive verification...
📋 Checking development claims...
🧪 Verifying QA claims...
📋 Validating PM claims...
✅ All verifications passed
```

## 🚨 Error Handling

### Common Issues:
1. **No Evidence Provided**: Claims without command output or test results
2. **Suspicious Patterns**: Use of phrases like "should work" or "all tests pass"
3. **Made-up Numbers**: Percentages or metrics without proof
4. **False Claims**: Claims that don't match actual system state

### Resolution Steps:
1. **Provide Evidence**: Include actual command output and test results
2. **Fix Claims**: Correct any false or misleading statements
3. **Re-run Verification**: Test the corrected claims
4. **Proceed**: Continue only after all issues resolved

## 📋 Integration Points

### Agent Communication:
```javascript
// Integrate with agent communication system
class AgentCommunication {
  async sendMessage(agentName, message) {
    // Check if this is a completion claim
    if (this.isCompletionClaim(message)) {
      const enforcer = new TruthEnforcer();
      const result = await enforcer.interceptAgentClaim(agentName, message);
      
      if (!result.allowed) {
        return {
          success: false,
          message: result.message,
          requiresEvidence: true
        };
      }
    }
    
    // Proceed with normal communication
    return await this.sendMessageToRecipient(agentName, message);
  }
}
```

### Meta Team Integration:
```javascript
// Meta team uses verification for workflow decisions
class MetaTeam {
  async approveWorkflow() {
    const enforcer = new TruthEnforcer();
    const stats = await enforcer.getEnforcementStats(1); // Last 24 hours
    
    if (stats.blocked > 0) {
      return {
        approved: false,
        reason: `${stats.blocked} claims blocked in last 24 hours`,
        action: 'Address violations before proceeding'
      };
    }
    
    return { approved: true };
  }
}
```

## 🎯 Success Criteria

### Verification Must Pass:
- ✅ **All claims verified** with actual evidence
- ✅ **No suspicious patterns** detected
- ✅ **Command output provided** for assertions
- ✅ **Tests actually run** and show real results
- ✅ **Features actually work** as claimed
- ✅ **No false claims** identified

### Workflow Can Proceed:
- ✅ **Truth enforcement** passed
- ✅ **Claim verification** successful
- ✅ **No violations** pending
- ✅ **Evidence provided** for all claims
- ✅ **System state** matches claims

---

**🎯 REMEMBER**: The `/next` command ensures that all agent claims are truthful and supported by evidence before allowing the workflow to proceed. This prevents false claims and maintains system integrity. 