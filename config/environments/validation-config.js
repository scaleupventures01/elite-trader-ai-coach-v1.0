/**
 * Validation Configuration
 * Configuration for validation checkpoints system
 */

module.exports = {
  checkpoints: {
    enabled: true,
    requirePreValidation: true,
    requirePostValidation: true,
    autoRetryFailed: true,
    maxRetries: 3
  },
  incremental: {
    enabled: true,
    testEachComponent: true,
    validateDependencies: true,
    stopOnFailure: false
  },
  realData: {
    enabled: true,
    validateAllData: true,
    sampleSize: 10,
    timeout: 30000
  },
  reporting: {
    enabled: true,
    logAllValidations: true,
    trackSuccessRate: true,
    alertOnFailure: true
  }
};