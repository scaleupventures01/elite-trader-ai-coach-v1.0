#!/usr/bin/env node

const fs = require('fs').promises;
const { exec } = require('child_process');
const path = require('path');

// Promisify exec for older Node.js versions
const util = require('util');
const execAsync = util.promisify(exec);

class VerificationSystem {
  constructor() {
    this.verificationLog = path.join(__dirname, '../logs/verification-log.json');
    this.violationsLog = path.join(__dirname, '../logs/violations-log.json');
    this.ensureLogDirectories();
  }

  async ensureLogDirectories() {
    const logDir = path.dirname(this.verificationLog);
    try {
      await fs.mkdir(logDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
  }

  async verifyDevClaims(claimedFeatures, agentName) {
    console.log('🔍 Verifying developer claims...');
    console.log(`Agent: ${agentName}`);
    console.log(`Claimed Features: ${claimedFeatures.join(', ')}`);
    
    const results = {
      timestamp: new Date().toISOString(),
      agent: agentName,
      claimType: 'development',
      claimed: claimedFeatures,
      verified: [],
      failed: [],
      evidence: {},
      honest: true
    };
    
    try {
      // Run actual tests
      console.log('📋 Running actual tests...');
      const { stdout, stderr } = await execAsync('npm test -- --json --silent', { 
        timeout: 30000,
        cwd: process.cwd()
      });
      
      results.evidence.testOutput = stdout;
      results.evidence.testError = stderr;
      
      let testResults;
      try {
        testResults = JSON.parse(stdout);
      } catch (parseError) {
        // If JSON parsing fails, treat as test failure
        results.failed = claimedFeatures.map(f => ({
          feature: f,
          reason: 'Test output not parseable',
          details: stdout
        }));
        results.honest = false;
        await this.logVerification(results);
        return results;
      }
      
      // Check each claimed feature
      for (const feature of claimedFeatures) {
        console.log(`🔍 Checking feature: ${feature}`);
        
        // Look for tests related to this feature
        const featureTests = testResults.tests?.filter(t => 
          t.name.toLowerCase().includes(feature.toLowerCase()) ||
          t.fullName.toLowerCase().includes(feature.toLowerCase())
        ) || [];
        
        if (featureTests.length === 0) {
          // No tests found for this feature
          results.failed.push({
            feature,
            reason: 'No tests found for claimed feature',
            details: 'Feature was claimed but no corresponding tests exist'
          });
          results.honest = false;
        } else if (featureTests.every(t => t.status === 'passed')) {
          results.verified.push(feature);
        } else {
          const failedTests = featureTests.filter(t => t.status !== 'passed');
          results.failed.push({
            feature,
            reason: 'Tests failing',
            details: failedTests.map(t => ({
              test: t.name,
              status: t.status,
              error: t.error
            }))
          });
          results.honest = false;
        }
      }
      
      // Check if build works
      console.log('🔨 Checking build process...');
      try {
        const { stdout: buildOutput } = await execAsync('npm run build', { 
          timeout: 60000,
          cwd: process.cwd()
        });
        results.evidence.buildOutput = buildOutput;
        results.evidence.buildSuccess = true;
      } catch (buildError) {
        results.evidence.buildOutput = buildError.stdout || '';
        results.evidence.buildError = buildError.stderr || buildError.message;
        results.evidence.buildSuccess = false;
        results.honest = false;
      }
      
    } catch (error) {
      console.log('❌ Verification failed:', error.message);
      results.error = error.message;
      results.failed = claimedFeatures.map(f => ({
        feature: f,
        reason: 'Could not verify - tests errored',
        details: error.message
      }));
      results.honest = false;
    }
    
    await this.logVerification(results);
    return results;
  }
  
  async verifyQAClaims(testReport, agentName) {
    console.log('🔍 Verifying QA claims...');
    console.log(`Agent: ${agentName}`);
    console.log(`Claimed Coverage: ${testReport.coverage}%`);
    
    const results = {
      timestamp: new Date().toISOString(),
      agent: agentName,
      claimType: 'qa',
      claimed: testReport,
      actual: {},
      discrepancy: 0,
      honest: true
    };
    
    try {
      // Actually run the tests QA claims to have run
      console.log('🧪 Running actual test suite...');
      const { stdout, stderr } = await execAsync('npm test -- --coverage --json', { 
        timeout: 60000,
        cwd: process.cwd()
      });
      
      results.evidence.testOutput = stdout;
      results.evidence.testError = stderr;
      
      // Parse actual coverage
      const actualCoverage = this.parseCoverage(stdout);
      results.actual = actualCoverage;
      
      // Compare with claimed coverage
      const claimedCoverage = testReport.coverage || 0;
      results.discrepancy = Math.abs(actualCoverage.total - claimedCoverage);
      
      // Determine if claim was honest (within 1% tolerance)
      results.honest = results.discrepancy < 1;
      
      if (!results.honest) {
        console.log(`❌ Coverage discrepancy detected:`);
        console.log(`   Claimed: ${claimedCoverage}%`);
        console.log(`   Actual: ${actualCoverage.total}%`);
        console.log(`   Difference: ${results.discrepancy}%`);
      }
      
      // Check if all tests actually pass
      try {
        const testResults = JSON.parse(stdout);
        const totalTests = testResults.numTotalTests || 0;
        const passedTests = testResults.numPassedTests || 0;
        const failedTests = testResults.numFailedTests || 0;
        
        results.actual.testResults = {
          total: totalTests,
          passed: passedTests,
          failed: failedTests,
          allPassing: failedTests === 0
        };
        
        if (failedTests > 0) {
          results.honest = false;
          console.log(`❌ ${failedTests} tests are failing`);
        }
        
      } catch (parseError) {
        results.actual.testResults = {
          error: 'Could not parse test results',
          rawOutput: stdout
        };
      }
      
    } catch (error) {
      console.log('❌ QA verification failed:', error.message);
      results.error = error.message;
      results.honest = false;
    }
    
    await this.logVerification(results);
    return results;
  }
  
  async verifyPMClaims(sprintReport, agentName) {
    console.log('🔍 Verifying Product Manager claims...');
    console.log(`Agent: ${agentName}`);
    console.log(`Claimed Sprint Status: ${sprintReport.status}`);
    
    const results = {
      timestamp: new Date().toISOString(),
      agent: agentName,
      claimType: 'product_manager',
      claimed: sprintReport,
      verified: [],
      failed: [],
      honest: true
    };
    
    try {
      // Verify each claimed feature actually works
      for (const feature of sprintReport.features || []) {
        console.log(`🔍 Verifying feature: ${feature.name}`);
        
        // Try to test the feature
        const featureResult = await this.testFeature(feature);
        
        if (featureResult.working) {
          results.verified.push({
            feature: feature.name,
            status: 'WORKING',
            evidence: featureResult.evidence
          });
        } else {
          results.failed.push({
            feature: feature.name,
            status: 'BROKEN',
            reason: featureResult.error,
            evidence: featureResult.evidence
          });
          results.honest = false;
        }
      }
      
      // Check if demo actually works
      if (sprintReport.demoReady) {
        console.log('🎬 Verifying demo readiness...');
        const demoResult = await this.verifyDemo();
        results.demoVerification = demoResult;
        
        if (!demoResult.ready) {
          results.honest = false;
        }
      }
      
      // Verify team status claims
      if (sprintReport.teamStatus) {
        console.log('👥 Verifying team status...');
        const teamResult = await this.verifyTeamStatus(sprintReport.teamStatus);
        results.teamVerification = teamResult;
        
        if (!teamResult.accurate) {
          results.honest = false;
        }
      }
      
    } catch (error) {
      console.log('❌ PM verification failed:', error.message);
      results.error = error.message;
      results.honest = false;
    }
    
    await this.logVerification(results);
    return results;
  }
  
  async testFeature(feature) {
    const result = {
      working: false,
      error: '',
      evidence: {}
    };
    
    try {
      // Try to start the application
      const { stdout } = await execAsync('node src/backend/api/trading-journal-working.js', {
        timeout: 10000,
        cwd: process.cwd()
      });
      
      result.evidence.startupOutput = stdout;
      
      // Test health endpoint
      const { stdout: healthOutput } = await execAsync('curl -s http://localhost:3000/api/health', {
        timeout: 5000
      });
      
      result.evidence.healthCheck = healthOutput;
      
      if (healthOutput.includes('"status":"healthy"')) {
        result.working = true;
      } else {
        result.error = 'Health check failed';
      }
      
      // Kill the server
      await execAsync('pkill -f "trading-journal-working.js"', { timeout: 5000 });
      
    } catch (error) {
      result.error = error.message;
      result.evidence.error = error.message;
    }
    
    return result;
  }
  
  async verifyDemo() {
    const result = {
      ready: false,
      issues: [],
      evidence: {}
    };
    
    try {
      // Check if demo files exist
      const demoFiles = [
        'src/frontend/pages/index.html',
        'src/backend/api/trading-journal-working.js'
      ];
      
      for (const file of demoFiles) {
        try {
          await fs.access(file);
        } catch (error) {
          result.issues.push(`Demo file missing: ${file}`);
        }
      }
      
      // Try to start demo server
      const { stdout } = await execAsync('node src/backend/api/trading-journal-working.js', {
        timeout: 10000,
        cwd: process.cwd()
      });
      
      result.evidence.startupOutput = stdout;
      
      if (stdout.includes('Trading Journal Platform running')) {
        result.ready = true;
      } else {
        result.issues.push('Demo server failed to start');
      }
      
      // Kill the server
      await execAsync('pkill -f "trading-journal-working.js"', { timeout: 5000 });
      
    } catch (error) {
      result.issues.push(`Demo verification error: ${error.message}`);
    }
    
    return result;
  }
  
  async verifyTeamStatus(teamStatus) {
    const result = {
      accurate: true,
      discrepancies: [],
      evidence: {}
    };
    
    try {
      // Check if team members have actually committed recently
      const { stdout } = await execAsync('git log --since="1 week ago" --pretty=format:"%an" | sort | uniq -c', {
        timeout: 10000,
        cwd: process.cwd()
      });
      
      result.evidence.recentCommits = stdout;
      
      // Parse team activity
      const activityLines = stdout.split('\n').filter(line => line.trim());
      const actualContributors = activityLines.length;
      
      if (teamStatus.activeMembers && actualContributors < teamStatus.activeMembers * 0.5) {
        result.discrepancies.push(`Claimed ${teamStatus.activeMembers} active members, but only ${actualContributors} recent contributors`);
        result.accurate = false;
      }
      
    } catch (error) {
      result.discrepancies.push(`Could not verify team status: ${error.message}`);
      result.accurate = false;
    }
    
    return result;
  }
  
  parseCoverage(output) {
    try {
      // Look for coverage percentage in output
      const coverageMatch = output.match(/All files\s+\|\s+(\d+(?:\.\d+)?)/);
      if (coverageMatch) {
        return {
          total: parseFloat(coverageMatch[1]),
          source: 'jest coverage'
        };
      }
      
      // Look for other coverage formats
      const linesMatch = output.match(/Lines\s+:\s+(\d+(?:\.\d+)?)%/);
      if (linesMatch) {
        return {
          total: parseFloat(linesMatch[1]),
          source: 'lines coverage'
        };
      }
      
      return {
        total: 0,
        source: 'no coverage found',
        rawOutput: output
      };
      
    } catch (error) {
      return {
        total: 0,
        source: 'parse error',
        error: error.message,
        rawOutput: output
      };
    }
  }
  
  async logVerification(results) {
    try {
      // Read existing log
      let log = [];
      try {
        const logData = await fs.readFile(this.verificationLog, 'utf8');
        log = JSON.parse(logData);
      } catch (error) {
        // File doesn't exist or is empty, start fresh
      }
      
      // Add new result
      log.push(results);
      
      // Keep only last 100 entries
      if (log.length > 100) {
        log = log.slice(-100);
      }
      
      // Write updated log
      await fs.writeFile(this.verificationLog, JSON.stringify(log, null, 2));
      
      // Log violations separately
      if (!results.honest) {
        await this.logViolation(results);
      }
      
    } catch (error) {
      console.error('Failed to log verification:', error.message);
    }
  }
  
  async logViolation(results) {
    try {
      // Read existing violations
      let violations = [];
      try {
        const violationData = await fs.readFile(this.violationsLog, 'utf8');
        violations = JSON.parse(violationData);
      } catch (error) {
        // File doesn't exist or is empty, start fresh
      }
      
      // Add violation
      const violation = {
        timestamp: new Date().toISOString(),
        agent: results.agent,
        claimType: results.claimType,
        violation: 'False claim detected',
        details: results,
        action: 'Requires immediate correction'
      };
      
      violations.push(violation);
      
      // Keep only last 50 violations
      if (violations.length > 50) {
        violations = violations.slice(-50);
      }
      
      // Write updated violations
      await fs.writeFile(this.violationsLog, JSON.stringify(violations, null, 2));
      
      console.log('🚨 VIOLATION LOGGED');
      console.log(`Agent: ${results.agent}`);
      console.log(`Type: ${results.claimType}`);
      console.log(`Action: ${violation.action}`);
      
    } catch (error) {
      console.error('Failed to log violation:', error.message);
    }
  }
  
  async getVerificationHistory(agentName = null, days = 7) {
    try {
      const logData = await fs.readFile(this.verificationLog, 'utf8');
      const log = JSON.parse(logData);
      
      const cutoffDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));
      
      let filtered = log.filter(entry => 
        new Date(entry.timestamp) > cutoffDate
      );
      
      if (agentName) {
        filtered = filtered.filter(entry => entry.agent === agentName);
      }
      
      return filtered;
      
    } catch (error) {
      return [];
    }
  }
  
  async getViolationHistory(agentName = null, days = 7) {
    try {
      const violationData = await fs.readFile(this.violationsLog, 'utf8');
      const violations = JSON.parse(violationData);
      
      const cutoffDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));
      
      let filtered = violations.filter(entry => 
        new Date(entry.timestamp) > cutoffDate
      );
      
      if (agentName) {
        filtered = filtered.filter(entry => entry.agent === agentName);
      }
      
      return filtered;
      
    } catch (error) {
      return [];
    }
  }
}

// Export for use
module.exports = VerificationSystem;

// CLI usage
if (require.main === module) {
  const verification = new VerificationSystem();
  
  console.log('🚨 VERIFICATION SYSTEM');
  console.log('======================');
  console.log('');
  console.log('Usage:');
  console.log('  node verify-claims.js dev [feature1,feature2] [agentName]');
  console.log('  node verify-claims.js qa [coverage] [agentName]');
  console.log('  node verify-claims.js pm [sprintReport] [agentName]');
  console.log('');
  console.log('Examples:');
  console.log('  node verify-claims.js dev "auth,profile" "Developer Agent"');
  console.log('  node verify-claims.js qa "85" "QA Agent"');
  console.log('  node verify-claims.js pm "sprint2.json" "PM Agent"');
} 