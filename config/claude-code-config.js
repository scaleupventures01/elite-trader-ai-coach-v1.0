/**
 * Claude Code API Configuration
 * Proper configuration for Anthropic API integration
 */

module.exports = {
  apiKey: process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY,
  endpoint: 'https://api.anthropic.com/v1/messages',
  headers: {
    'x-api-key': process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json'
  },
  models: {
    opus: 'claude-3-opus-20240229',
    sonnet: 'claude-3-5-sonnet-20241022',
    haiku: 'claude-3-haiku-20240307'
  },
  defaultModel: 'claude-3-5-sonnet-20241022',
  timeout: 30000,
  maxRetries: 3
};