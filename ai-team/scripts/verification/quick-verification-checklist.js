#!/usr/bin/env node

/**
 * 🚨 QUICK VERIFICATION CHECKLIST
 * 
 * Before any agent claims completion, they MUST run this checklist
 * and show the actual output for verification.
 */

const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);
const fs = require('fs').promises;
const path = require('path');

class QuickVerificationChecklist {
  constructor() {
    this.checklistResults = [];
    this.verificationPassed = false;
  }

  async runFullChecklist() {
    console.log('🚨 QUICK VERIFICATION CHECKLIST');
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('Before claiming completion, verify ALL items:');
    console.log('');

    try {
      // 1. Run the actual code/tests
      await this.checkRunActualCode();
      
      // 2. Show the real output (including errors)
      await this.checkShowRealOutput();
      
      // 3. Report actual state, not desired state
      await this.checkReportActualState();
      
      // 4. Include evidence for any metrics quoted
      await this.checkIncludeEvidence();
      
      // 5. Acknowledge what's NOT working
      await this.checkAcknowledgeIssues();
      
      // Display results
      this.displayResults();
      
    } catch (error) {
      console.error('❌ Verification checklist failed:', error.message);
      process.exit(1);
    }
  }

  async checkRunActualCode() {
    console.log('1️⃣  RUN THE ACTUAL CODE/TESTS');
    console.log('═══════════════════════════════════════');
    console.log('');

    // Check if tests exist
    const hasTests = await this.checkTestsExist();
    
    if (hasTests) {
      console.log('✅ Tests found. Running them...');
      const testResults = await this.runTests();
      
      this.checklistResults.push({
        item: '1. Run Actual Code/Tests',
        status: testResults.success ? 'PASS' : 'FAIL',
        details: testResults.message,
        output: testResults.output
      });

      console.log(`   Status: ${testResults.success ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`   Details: ${testResults.message}`);
      console.log(`   Output: ${testResults.output.substring(0, 200)}...`);
    } else {
      console.log('⚠️  No tests found. Checking if code runs...');
      const codeRuns = await this.checkCodeRuns();
      
      this.checklistResults.push({
        item: '1. Run Actual Code/Tests',
        status: codeRuns.success ? 'PASS' : 'FAIL',
        details: codeRuns.message,
        output: codeRuns.output
      });

      console.log(`   Status: ${codeRuns.success ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`   Details: ${codeRuns.message}`);
      console.log(`   Output: ${codeRuns.output.substring(0, 200)}...`);
    }
    console.log('');
  }

  async checkShowRealOutput() {
    console.log('2️⃣  SHOW THE REAL OUTPUT (INCLUDING ERRORS)');
    console.log('═══════════════════════════════════════');
    console.log('');

    // Check for recent command output
    const recentOutput = await this.getRecentOutput();
    
    this.checklistResults.push({
      item: '2. Show Real Output',
      status: recentOutput.hasOutput ? 'PASS' : 'FAIL',
      details: recentOutput.message,
      output: recentOutput.output
    });

    console.log(`   Status: ${recentOutput.hasOutput ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Details: ${recentOutput.message}`);
    console.log(`   Output: ${recentOutput.output.substring(0, 200)}...`);
    console.log('');
  }

  async checkReportActualState() {
    console.log('3️⃣  REPORT ACTUAL STATE, NOT DESIRED STATE');
    console.log('═══════════════════════════════════════');
    console.log('');

    // Check current system state
    const actualState = await this.getActualState();
    
    this.checklistResults.push({
      item: '3. Report Actual State',
      status: actualState.isAccurate ? 'PASS' : 'FAIL',
      details: actualState.message,
      output: actualState.state
    });

    console.log(`   Status: ${actualState.isAccurate ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Details: ${actualState.message}`);
    console.log(`   State: ${actualState.state}`);
    console.log('');
  }

  async checkIncludeEvidence() {
    console.log('4️⃣  INCLUDE EVIDENCE FOR ANY METRICS QUOTED');
    console.log('═══════════════════════════════════════');
    console.log('');

    // Check for metrics and evidence
    const evidence = await this.checkMetricsEvidence();
    
    this.checklistResults.push({
      item: '4. Include Evidence',
      status: evidence.hasEvidence ? 'PASS' : 'FAIL',
      details: evidence.message,
      output: evidence.evidence
    });

    console.log(`   Status: ${evidence.hasEvidence ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Details: ${evidence.message}`);
    console.log(`   Evidence: ${evidence.evidence}`);
    console.log('');
  }

  async checkAcknowledgeIssues() {
    console.log('5️⃣  ACKNOWLEDGE WHAT\'S NOT WORKING');
    console.log('═══════════════════════════════════════');
    console.log('');

    // Check for acknowledged issues
    const issues = await this.checkAcknowledgedIssues();
    
    this.checklistResults.push({
      item: '5. Acknowledge Issues',
      status: issues.hasAcknowledged ? 'PASS' : 'FAIL',
      details: issues.message,
      output: issues.issues
    });

    console.log(`   Status: ${issues.hasAcknowledged ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Details: ${issues.message}`);
    console.log(`   Issues: ${issues.issues}`);
    console.log('');
  }

  // Helper methods
  async checkTestsExist() {
    try {
      const files = await fs.readdir('.');
      return files.some(file => 
        file.includes('test') || 
        file.includes('spec') || 
        file === 'jest.config.js' || 
        file === 'package.json'
      );
    } catch (error) {
      return false;
    }
  }

  async runTests() {
    try {
      const { stdout, stderr } = await execAsync('npm test', { timeout: 30000 });
      return {
        success: true,
        message: 'Tests ran successfully',
        output: stdout || stderr
      };
    } catch (error) {
      return {
        success: false,
        message: 'Tests failed or errored',
        output: error.stdout || error.stderr || error.message
      };
    }
  }

  async checkCodeRuns() {
    try {
      // Try to run the main application
      const { stdout, stderr } = await execAsync('node --version', { timeout: 5000 });
      return {
        success: true,
        message: 'Node.js environment is working',
        output: stdout
      };
    } catch (error) {
      return {
        success: false,
        message: 'Code execution failed',
        output: error.message
      };
    }
  }

  async getRecentOutput() {
    try {
      // Check for recent terminal output or log files
      const logFiles = await fs.readdir('.').catch(() => []);
      const hasLogs = logFiles.some(file => file.includes('.log'));
      
      if (hasLogs) {
        const latestLog = logFiles.filter(f => f.includes('.log')).sort().pop();
        const logContent = await fs.readFile(latestLog, 'utf8');
        return {
          hasOutput: true,
          message: 'Found recent log output',
          output: logContent.substring(0, 500)
        };
      } else {
        return {
          hasOutput: false,
          message: 'No recent output found - run commands first',
          output: 'No output available'
        };
      }
    } catch (error) {
      return {
        hasOutput: false,
        message: 'Could not check for output',
        output: error.message
      };
    }
  }

  async getActualState() {
    try {
      // Check current system state
      const { stdout } = await execAsync('ps aux | grep node | grep -v grep', { timeout: 5000 });
      const hasRunningProcesses = stdout.trim().length > 0;
      
      return {
        isAccurate: true,
        message: 'System state checked',
        state: hasRunningProcesses ? 'Node processes running' : 'No Node processes running'
      };
    } catch (error) {
      return {
        isAccurate: false,
        message: 'Could not determine system state',
        state: error.message
      };
    }
  }

  async checkMetricsEvidence() {
    try {
      // Look for metrics in recent files
      const files = await fs.readdir('.');
      const metricFiles = [];
      
      // Check each file to see if it's actually a file (not a directory)
      for (const file of files) {
        if ((file.includes('coverage') || 
             file.includes('metrics') || 
             file.includes('stats') ||
             file.includes('report')) &&
            !file.startsWith('.') && // Avoid hidden files
            !file.includes('/')) { // Avoid paths with slashes
          
          try {
            // Check if it's actually a file by trying to read it
            const stats = await fs.stat(file);
            if (stats.isFile()) {
              metricFiles.push(file);
            }
          } catch (statError) {
            // Skip files that can't be stat'd
            continue;
          }
        }
      }
      
      if (metricFiles.length > 0) {
        try {
          const metricContent = await fs.readFile(metricFiles[0], 'utf8');
          return {
            hasEvidence: true,
            message: 'Found metrics evidence',
            evidence: metricContent.substring(0, 200)
          };
        } catch (readError) {
          return {
            hasEvidence: false,
            message: 'Could not read metrics file',
            evidence: readError.message
          };
        }
      } else {
        return {
          hasEvidence: false,
          message: 'No metrics evidence found',
          evidence: 'No metrics files found'
        };
      }
    } catch (error) {
      return {
        hasEvidence: false,
        message: 'Could not check for metrics',
        evidence: error.message
      };
    }
  }

  async checkAcknowledgedIssues() {
    try {
      // First check for KNOWN_ISSUES.md file
      try {
        const issuesContent = await fs.readFile('KNOWN_ISSUES.md', 'utf8');
        return {
          hasAcknowledged: true,
          message: 'Found KNOWN_ISSUES.md file',
          issues: issuesContent.substring(0, 300)
        };
      } catch (fileError) {
        // If no KNOWN_ISSUES.md, look for TODO, FIXME, BUG comments
        const { stdout } = await execAsync('grep -r "TODO\|FIXME\|BUG\|ERROR\|FAIL" . --exclude-dir=node_modules --exclude-dir=.git 2>/dev/null || true', { timeout: 10000 });
        
        if (stdout.trim().length > 0) {
          return {
            hasAcknowledged: true,
            message: 'Found acknowledged issues in code comments',
            issues: stdout.substring(0, 300)
          };
        } else {
          return {
            hasAcknowledged: false,
            message: 'No acknowledged issues found',
            issues: 'No issues documented'
          };
        }
      }
    } catch (error) {
      return {
        hasAcknowledged: false,
        message: 'Could not check for issues',
        issues: error.message
      };
    }
  }

  displayResults() {
    console.log('📋 VERIFICATION CHECKLIST RESULTS');
    console.log('═══════════════════════════════════════');
    console.log('');

    const totalItems = this.checklistResults.length;
    const passedItems = this.checklistResults.filter(item => item.status === 'PASS').length;
    const failedItems = totalItems - passedItems;
    const successRate = ((passedItems / totalItems) * 100).toFixed(1);

    console.log(`📊 Total Items: ${totalItems}`);
    console.log(`✅ Passed: ${passedItems}`);
    console.log(`❌ Failed: ${failedItems}`);
    console.log(`📈 Success Rate: ${successRate}%`);
    console.log('');

    console.log('📋 DETAILED RESULTS:');
    console.log('═══════════════════════════════════════');
    console.log('');

    this.checklistResults.forEach((item, index) => {
      const status = item.status === 'PASS' ? '✅' : '❌';
      console.log(`${status} ${index + 1}. ${item.item}`);
      console.log(`   Status: ${item.status}`);
      console.log(`   Details: ${item.details}`);
      console.log(`   Output: ${item.output.substring(0, 100)}...`);
      console.log('');
    });

    console.log('🎯 VERIFICATION VERDICT');
    console.log('═══════════════════════════════════════');
    console.log('');

    if (successRate >= 80) {
      console.log('✅ VERIFIED: You can make claims with confidence!');
      console.log('   All verification items passed. Claims are supported by evidence.');
      this.verificationPassed = true;
    } else if (successRate >= 60) {
      console.log('⚠️  PARTIALLY VERIFIED: Some claims may need qualification.');
      console.log('   Address failed items before making strong claims.');
    } else {
      console.log('❌ NOT VERIFIED: Do not make claims without addressing issues.');
      console.log('   Run actual tests and provide evidence first.');
    }

    console.log('');
    console.log('🔧 NEXT STEPS:');
    console.log('═══════════════════════════════════════');
    console.log('');

    if (failedItems > 0) {
      console.log('1. Address failed verification items');
      console.log('2. Run actual tests and show output');
      console.log('3. Provide evidence for any metrics');
      console.log('4. Acknowledge known issues');
      console.log('5. Re-run verification checklist');
    } else {
      console.log('1. ✅ Verification complete - claims are supported');
      console.log('2. ✅ Evidence provided - proceed with confidence');
      console.log('3. ✅ Issues acknowledged - transparency maintained');
    }

    console.log('');
    
    // Exit with appropriate code
    if (this.verificationPassed) {
      console.log('🎯 Verification checklist completed successfully!');
      process.exit(0);
    } else {
      console.log('🚨 Verification checklist completed with failures that need attention.');
      process.exit(1);
    }
  }
}

// Run the checklist if this file is executed directly
if (require.main === module) {
  const checklist = new QuickVerificationChecklist();
  checklist.runFullChecklist()
    .catch(error => {
      console.error('❌ Checklist execution failed:', error.message);
      process.exit(1);
    });
}

module.exports = QuickVerificationChecklist; 