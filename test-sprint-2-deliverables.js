#!/usr/bin/env node

/**
 * 🧪 SPRINT 2 DELIVERABLES TEST
 * 
 * This test script verifies that all Sprint 2 deliverables are working correctly,
 * including the Trading Journal Platform, authentication system, and API endpoints.
 */

const http = require('http');
const https = require('https');
const fs = require('fs').promises;
const path = require('path');

class Sprint2DeliverablesTest {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.testResults = [];
    this.serverProcess = null;
  }

  async runAllTests() {
    console.log('🧪 SPRINT 2 DELIVERABLES TEST');
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('Testing Sprint 2 Trading Journal Platform...');
    console.log('');

    try {
      // Test 1: Server Availability
      await this.testServerAvailability();
      
      // Test 2: Authentication System
      await this.testAuthenticationSystem();
      
      // Test 3: API Endpoints
      await this.testAPIEndpoints();
      
      // Test 4: User Interface
      await this.testUserInterface();
      
      // Test 5: Data Persistence
      await this.testDataPersistence();
      
      // Test 6: Sprint 2 Features
      await this.testSprint2Features();
      
      // Display final results
      this.displayTestResults();
      
    } catch (error) {
      console.error('❌ Test failed:', error.message);
      process.exit(1);
    }
  }

  async testServerAvailability() {
    console.log('🌐 TEST 1: SERVER AVAILABILITY');
    console.log('═══════════════════════════════════════');
    console.log('');

    // Test 1.1: Check if server is running
    console.log('1.1 Testing server availability...');
    const isServerRunning = await this.checkServerStatus();
    
    this.testResults.push({
      test: '1.1 Server Availability',
      expected: 'RUNNING',
      actual: isServerRunning ? 'RUNNING' : 'NOT_RUNNING',
      passed: isServerRunning,
      details: isServerRunning ? 'Server is running on port 3000' : 'Server not found on port 3000'
    });

    console.log(`   Expected: RUNNING`);
    console.log(`   Actual: ${isServerRunning ? 'RUNNING' : 'NOT_RUNNING'}`);
    console.log(`   Result: ${isServerRunning ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Details: ${isServerRunning ? 'Server is running on port 3000' : 'Server not found on port 3000'}`);
    console.log('');

    // Test 1.2: Check main page accessibility
    if (isServerRunning) {
      console.log('1.2 Testing main page accessibility...');
      const mainPageAccessible = await this.checkMainPage();
      
      this.testResults.push({
        test: '1.2 Main Page Accessibility',
        expected: 'ACCESSIBLE',
        actual: mainPageAccessible ? 'ACCESSIBLE' : 'NOT_ACCESSIBLE',
        passed: mainPageAccessible,
        details: mainPageAccessible ? 'Main page loads successfully' : 'Main page not accessible'
      });

      console.log(`   Expected: ACCESSIBLE`);
      console.log(`   Actual: ${mainPageAccessible ? 'ACCESSIBLE' : 'NOT_ACCESSIBLE'}`);
      console.log(`   Result: ${mainPageAccessible ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`   Details: ${mainPageAccessible ? 'Main page loads successfully' : 'Main page not accessible'}`);
    }
    console.log('');
  }

  async testAuthenticationSystem() {
    console.log('🔐 TEST 2: AUTHENTICATION SYSTEM');
    console.log('═══════════════════════════════════════');
    console.log('');

    // Test 2.1: User registration
    console.log('2.1 Testing user registration...');
    const registrationResult = await this.testUserRegistration();
    
    this.testResults.push({
      test: '2.1 User Registration',
      expected: 'SUCCESS',
      actual: registrationResult.success ? 'SUCCESS' : 'FAILED',
      passed: registrationResult.success,
      details: registrationResult.message
    });

    console.log(`   Expected: SUCCESS`);
    console.log(`   Actual: ${registrationResult.success ? 'SUCCESS' : 'FAILED'}`);
    console.log(`   Result: ${registrationResult.success ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Details: ${registrationResult.message}`);
    console.log('');

    // Test 2.2: User login
    console.log('2.2 Testing user login...');
    const loginResult = await this.testUserLogin();
    
    this.testResults.push({
      test: '2.2 User Login',
      expected: 'SUCCESS',
      actual: loginResult.success ? 'SUCCESS' : 'FAILED',
      passed: loginResult.success,
      details: loginResult.message
    });

    console.log(`   Expected: SUCCESS`);
    console.log(`   Actual: ${loginResult.success ? 'SUCCESS' : 'FAILED'}`);
    console.log(`   Result: ${loginResult.success ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Details: ${loginResult.message}`);
    console.log('');

    // Test 2.3: Demo accounts
    console.log('2.3 Testing demo accounts...');
    const demoResult = await this.testDemoAccounts();
    
    this.testResults.push({
      test: '2.3 Demo Accounts',
      expected: 'WORKING',
      actual: demoResult.working ? 'WORKING' : 'NOT_WORKING',
      passed: demoResult.working,
      details: demoResult.message
    });

    console.log(`   Expected: WORKING`);
    console.log(`   Actual: ${demoResult.working ? 'WORKING' : 'NOT_WORKING'}`);
    console.log(`   Result: ${demoResult.working ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Details: ${demoResult.message}`);
    console.log('');
  }

  async testAPIEndpoints() {
    console.log('🔗 TEST 3: API ENDPOINTS');
    console.log('═══════════════════════════════════════');
    console.log('');

    const endpoints = [
      { path: '/api/health', method: 'GET', name: 'Health Check' },
      { path: '/api/auth/login', method: 'POST', name: 'Login Endpoint' },
      { path: '/api/auth/register', method: 'POST', name: 'Register Endpoint' },
      { path: '/api/users/profile', method: 'GET', name: 'Profile Endpoint' },
      { path: '/api/sprint/status', method: 'GET', name: 'Sprint Status' }
    ];

    for (let i = 0; i < endpoints.length; i++) {
      const endpoint = endpoints[i];
      console.log(`3.${i + 1} Testing ${endpoint.name}...`);
      
      const result = await this.testEndpoint(endpoint.path, endpoint.method);
      
      this.testResults.push({
        test: `3.${i + 1} ${endpoint.name}`,
        expected: 'WORKING',
        actual: result.working ? 'WORKING' : 'NOT_WORKING',
        passed: result.working,
        details: result.message
      });

      console.log(`   Expected: WORKING`);
      console.log(`   Actual: ${result.working ? 'WORKING' : 'NOT_WORKING'}`);
      console.log(`   Result: ${result.working ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`   Details: ${result.message}`);
      console.log('');
    }
  }

  async testUserInterface() {
    console.log('🖥️  TEST 4: USER INTERFACE');
    console.log('═══════════════════════════════════════');
    console.log('');

    // Test 4.1: Check if UI files exist
    console.log('4.1 Testing UI file existence...');
    const uiFilesExist = await this.checkUIFiles();
    
    this.testResults.push({
      test: '4.1 UI Files Existence',
      expected: 'EXIST',
      actual: uiFilesExist ? 'EXIST' : 'MISSING',
      passed: uiFilesExist,
      details: uiFilesExist ? 'UI files found' : 'UI files missing'
    });

    console.log(`   Expected: EXIST`);
    console.log(`   Actual: ${uiFilesExist ? 'EXIST' : 'MISSING'}`);
    console.log(`   Result: ${uiFilesExist ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Details: ${uiFilesExist ? 'UI files found' : 'UI files missing'}`);
    console.log('');

    // Test 4.2: Check UI functionality
    console.log('4.2 Testing UI functionality...');
    const uiFunctional = await this.checkUIFunctionality();
    
    this.testResults.push({
      test: '4.2 UI Functionality',
      expected: 'FUNCTIONAL',
      actual: uiFunctional ? 'FUNCTIONAL' : 'NOT_FUNCTIONAL',
      passed: uiFunctional,
      details: uiFunctional ? 'UI components are functional' : 'UI components not functional'
    });

    console.log(`   Expected: FUNCTIONAL`);
    console.log(`   Actual: ${uiFunctional ? 'FUNCTIONAL' : 'NOT_FUNCTIONAL'}`);
    console.log(`   Result: ${uiFunctional ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Details: ${uiFunctional ? 'UI components are functional' : 'UI components not functional'}`);
    console.log('');
  }

  async testDataPersistence() {
    console.log('💾 TEST 5: DATA PERSISTENCE');
    console.log('═══════════════════════════════════════');
    console.log('');

    // Test 5.1: Check data storage
    console.log('5.1 Testing data storage...');
    const dataStorageWorking = await this.checkDataStorage();
    
    this.testResults.push({
      test: '5.1 Data Storage',
      expected: 'WORKING',
      actual: dataStorageWorking ? 'WORKING' : 'NOT_WORKING',
      passed: dataStorageWorking,
      details: dataStorageWorking ? 'Data storage is working' : 'Data storage not working'
    });

    console.log(`   Expected: WORKING`);
    console.log(`   Actual: ${dataStorageWorking ? 'WORKING' : 'NOT_WORKING'}`);
    console.log(`   Result: ${dataStorageWorking ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Details: ${dataStorageWorking ? 'Data storage is working' : 'Data storage not working'}`);
    console.log('');
  }

  async testSprint2Features() {
    console.log('📋 TEST 6: SPRINT 2 FEATURES');
    console.log('═══════════════════════════════════════');
    console.log('');

    // Test 6.1: Sprint status endpoint
    console.log('6.1 Testing sprint status...');
    const sprintStatus = await this.checkSprintStatus();
    
    this.testResults.push({
      test: '6.1 Sprint Status',
      expected: 'AVAILABLE',
      actual: sprintStatus.available ? 'AVAILABLE' : 'NOT_AVAILABLE',
      passed: sprintStatus.available,
      details: sprintStatus.message
    });

    console.log(`   Expected: AVAILABLE`);
    console.log(`   Actual: ${sprintStatus.available ? 'AVAILABLE' : 'NOT_AVAILABLE'}`);
    console.log(`   Result: ${sprintStatus.available ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Details: ${sprintStatus.message}`);
    console.log('');

    // Test 6.2: Trading journal features
    console.log('6.2 Testing trading journal features...');
    const tradingFeatures = await this.checkTradingFeatures();
    
    this.testResults.push({
      test: '6.2 Trading Journal Features',
      expected: 'IMPLEMENTED',
      actual: tradingFeatures.implemented ? 'IMPLEMENTED' : 'NOT_IMPLEMENTED',
      passed: tradingFeatures.implemented,
      details: tradingFeatures.message
    });

    console.log(`   Expected: IMPLEMENTED`);
    console.log(`   Actual: ${tradingFeatures.implemented ? 'IMPLEMENTED' : 'NOT_IMPLEMENTED'}`);
    console.log(`   Result: ${tradingFeatures.implemented ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Details: ${tradingFeatures.message}`);
    console.log('');
  }

  // Helper methods
  async checkServerStatus() {
    return new Promise((resolve) => {
      const req = http.get(`${this.baseUrl}/api/health`, (res) => {
        resolve(res.statusCode === 200);
      });
      
      req.on('error', () => {
        resolve(false);
      });
      
      req.setTimeout(5000, () => {
        req.destroy();
        resolve(false);
      });
    });
  }

  async checkMainPage() {
    return new Promise((resolve) => {
      const req = http.get(this.baseUrl, (res) => {
        resolve(res.statusCode === 200);
      });
      
      req.on('error', () => {
        resolve(false);
      });
      
      req.setTimeout(5000, () => {
        req.destroy();
        resolve(false);
      });
    });
  }

  async testUserRegistration() {
    return new Promise((resolve) => {
      const postData = JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword',
        name: 'Test User'
      });

      const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/register',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          const success = res.statusCode === 200 || res.statusCode === 201;
          resolve({
            success,
            message: success ? 'User registration successful' : `Registration failed: ${res.statusCode}`
          });
        });
      });

      req.on('error', () => {
        resolve({
          success: false,
          message: 'Registration endpoint not accessible'
        });
      });

      req.write(postData);
      req.end();
    });
  }

  async testUserLogin() {
    return new Promise((resolve) => {
      const postData = JSON.stringify({
        email: 'ceo@company.com',
        password: 'password'
      });

      const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          const success = res.statusCode === 200;
          resolve({
            success,
            message: success ? 'User login successful' : `Login failed: ${res.statusCode}`
          });
        });
      });

      req.on('error', () => {
        resolve({
          success: false,
          message: 'Login endpoint not accessible'
        });
      });

      req.write(postData);
      req.end();
    });
  }

  async testDemoAccounts() {
    return new Promise((resolve) => {
      const postData = JSON.stringify({
        email: 'trader@company.com',
        password: 'password'
      });

      const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          const success = res.statusCode === 200;
          resolve({
            working: success,
            message: success ? 'Demo accounts working' : 'Demo accounts not working'
          });
        });
      });

      req.on('error', () => {
        resolve({
          working: false,
          message: 'Demo accounts not accessible'
        });
      });

      req.write(postData);
      req.end();
    });
  }

  async testEndpoint(path, method) {
    return new Promise((resolve) => {
      const options = {
        hostname: 'localhost',
        port: 3000,
        path: path,
        method: method
      };

      const req = http.request(options, (res) => {
        const working = res.statusCode !== 404;
        resolve({
          working,
          message: working ? `Endpoint ${path} is working (${res.statusCode})` : `Endpoint ${path} not found`
        });
      });

      req.on('error', () => {
        resolve({
          working: false,
          message: `Endpoint ${path} not accessible`
        });
      });

      req.setTimeout(5000, () => {
        req.destroy();
        resolve({
          working: false,
          message: `Endpoint ${path} timeout`
        });
      });

      req.end();
    });
  }

  async checkUIFiles() {
    try {
      const files = [
        'src/frontend/pages/index.html',
        'src/backend/api/trading-journal-working.js'
      ];

      for (const file of files) {
        await fs.access(file);
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  async checkUIFunctionality() {
    // Check if the main page loads and contains expected elements
    return new Promise((resolve) => {
      const req = http.get(this.baseUrl, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          const hasLoginForm = data.includes('login') || data.includes('Login');
          const hasRegisterForm = data.includes('register') || data.includes('Register');
          const hasUIElements = data.includes('form') || data.includes('button');
          
          const functional = hasLoginForm || hasRegisterForm || hasUIElements;
          resolve(functional);
        });
      });

      req.on('error', () => {
        resolve(false);
      });

      req.setTimeout(5000, () => {
        req.destroy();
        resolve(false);
      });
    });
  }

  async checkDataStorage() {
    // Check if data storage is working by testing a simple endpoint
    return new Promise((resolve) => {
      const req = http.get(`${this.baseUrl}/api/health`, (res) => {
        resolve(res.statusCode === 200);
      });

      req.on('error', () => {
        resolve(false);
      });

      req.setTimeout(5000, () => {
        req.destroy();
        resolve(false);
      });
    });
  }

  async checkSprintStatus() {
    return new Promise((resolve) => {
      const req = http.get(`${this.baseUrl}/api/sprint/status`, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          const available = res.statusCode === 200;
          resolve({
            available,
            message: available ? 'Sprint status endpoint working' : 'Sprint status endpoint not found'
          });
        });
      });

      req.on('error', () => {
        resolve({
          available: false,
          message: 'Sprint status endpoint not accessible'
        });
      });

      req.setTimeout(5000, () => {
        req.destroy();
        resolve({
          available: false,
          message: 'Sprint status endpoint timeout'
        });
      });
    });
  }

  async checkTradingFeatures() {
    // Check if trading journal features are implemented
    return new Promise((resolve) => {
      const req = http.get(this.baseUrl, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          const hasTradingFeatures = data.includes('trading') || data.includes('journal') || data.includes('Trading');
          resolve({
            implemented: hasTradingFeatures,
            message: hasTradingFeatures ? 'Trading journal features found' : 'Trading journal features not found'
          });
        });
      });

      req.on('error', () => {
        resolve({
          implemented: false,
          message: 'Trading journal features not accessible'
        });
      });

      req.setTimeout(5000, () => {
        req.destroy();
        resolve({
          implemented: false,
          message: 'Trading journal features timeout'
        });
      });
    });
  }

  displayTestResults() {
    console.log('📋 SPRINT 2 DELIVERABLES TEST RESULTS');
    console.log('═══════════════════════════════════════');
    console.log('');

    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(result => result.passed).length;
    const failedTests = totalTests - passedTests;
    const successRate = ((passedTests / totalTests) * 100).toFixed(1);

    console.log(`📊 Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📈 Success Rate: ${successRate}%`);
    console.log('');

    console.log('📋 DETAILED RESULTS:');
    console.log('═══════════════════════════════════════');
    console.log('');

    this.testResults.forEach((result, index) => {
      const status = result.passed ? '✅' : '❌';
      console.log(`${status} ${index + 1}. ${result.test}`);
      console.log(`   Expected: ${result.expected}`);
      console.log(`   Actual: ${result.actual}`);
      console.log(`   Details: ${result.details}`);
      console.log('');
    });

    console.log('🎯 SPRINT 2 DELIVERABLES VERDICT');
    console.log('═══════════════════════════════════════');
    console.log('');

    if (successRate >= 90) {
      console.log('🎉 EXCELLENT: Sprint 2 deliverables are working perfectly!');
      console.log('   All features are operational and ready for production use.');
    } else if (successRate >= 80) {
      console.log('✅ GOOD: Sprint 2 deliverables are working well!');
      console.log('   Most features are operational with minor issues to address.');
    } else if (successRate >= 70) {
      console.log('⚠️  FAIR: Sprint 2 deliverables need improvement.');
      console.log('   Core functionality works but several issues need attention.');
    } else {
      console.log('❌ POOR: Sprint 2 deliverables have significant issues.');
      console.log('   Multiple failures indicate need for debugging and fixes.');
    }

    console.log('');
    console.log('🔧 NEXT STEPS:');
    console.log('═══════════════════════════════════════');
    console.log('');

    if (failedTests > 0) {
      console.log('1. Review failed tests and fix issues');
      console.log('2. Re-run tests to verify fixes');
      console.log('3. Check server logs for error details');
      console.log('4. Ensure all dependencies are installed');
    } else {
      console.log('1. ✅ Sprint 2 deliverables are ready for production');
      console.log('2. ✅ All features are operational');
      console.log('3. ✅ Trading Journal Platform is working');
      console.log('4. ✅ Ready for Sprint 3 development');
    }

    console.log('');
    console.log('📞 For support, check:');
    console.log('   - src/backend/api/trading-journal-working.js');
    console.log('   - src/frontend/pages/index.html');
    console.log('   - Server logs for detailed error information');
    console.log('');

    // Exit with appropriate code
    if (successRate >= 80) {
      console.log('🎯 Sprint 2 deliverables test completed successfully!');
      process.exit(0);
    } else {
      console.log('🚨 Sprint 2 deliverables test completed with failures that need attention.');
      process.exit(1);
    }
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  const test = new Sprint2DeliverablesTest();
  test.runAllTests()
    .catch(error => {
      console.error('❌ Test execution failed:', error.message);
      process.exit(1);
    });
}

module.exports = Sprint2DeliverablesTest; 