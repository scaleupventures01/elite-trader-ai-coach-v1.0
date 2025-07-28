/**
 * Authentication Configuration
 * Configuration for authentication testing and validation
 */

module.exports = {
  claudeCode: {
    apiKeyEnv: 'CLAUDE_API_KEY',
    testEndpoint: 'https://api.anthropic.com/v1/messages',
    timeout: 10000,
    retries: 3
  },
  validation: {
    requireAuthBeforeIntegration: true,
    testAllIntegrations: true,
    logAuthResults: true,
    cacheAuthResults: true,
    cacheTimeout: 300000 // 5 minutes
  },
  metrics: {
    trackAuthSuccess: true,
    trackAuthFailures: true,
    trackAuthLatency: true,
    alertOnAuthFailure: true
  }
};