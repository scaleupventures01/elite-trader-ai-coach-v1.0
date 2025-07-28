/**
 * Error Handling Configuration
 * Configuration for comprehensive error handling
 */

module.exports = {
  logging: {
    enabled: true,
    logLevel: 'ERROR',
    logFile: 'logs/errors.log',
    maxLogSize: '10MB',
    maxLogFiles: 5
  },
  recovery: {
    enabled: true,
    maxRetries: 3,
    retryDelay: 1000,
    exponentialBackoff: true
  },
  reporting: {
    enabled: true,
    reportCritical: true,
    reportHigh: true,
    reportMedium: false,
    reportLow: false
  },
  metrics: {
    trackErrorCounts: true,
    trackErrorTypes: true,
    trackRecoverySuccess: true,
    alertThreshold: 5
  }
};