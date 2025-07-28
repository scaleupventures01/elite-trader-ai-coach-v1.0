/**
 * API Configuration
 * Configuration for direct API integration
 */

module.exports = {
  claudeCode: {
    service: 'claude-code',
    hostname: 'api.anthropic.com',
    path: '/v1/messages',
    method: 'POST',
    headers: {
      'x-api-key': process.env.CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    }
  },
  retries: 3,
  retryDelay: 1000,
  timeout: 30000,
  rateLimiting: {
    enabled: true,
    maxRequests: 100,
    timeWindow: 60000
  },
  metrics: {
    trackSuccessRate: true,
    trackDuration: true,
    trackErrors: true
  }
};