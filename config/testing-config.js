/**
 * Testing Configuration
 * Configuration for comprehensive testing framework
 */

module.exports = {
  testing: {
    enabled: true,
    requireAuth: true,
    requireValidation: true,
    timeout: 30000,
    retries: 3
  },
  automation: {
    enabled: true,
    runOnSave: false,
    runOnCommit: true,
    parallelExecution: true
  },
  metrics: {
    trackSuccessRate: true,
    trackDuration: true,
    trackCoverage: true,
    alertOnFailure: true
  },
  reporting: {
    enabled: true,
    generateReports: true,
    exportResults: true,
    notifyOnCompletion: true
  }
};