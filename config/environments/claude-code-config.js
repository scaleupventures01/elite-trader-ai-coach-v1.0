/**
 * Claude Code API Configuration
 * Updated to actual Claude Sonnet 4: claude-sonnet-4-20250514
 * Last updated: 2025-07-28T02:23:07.292Z
 * 
 * Current Model: claude-sonnet-4-20250514 (Actual Claude Sonnet 4)
 * This is the latest Claude Sonnet 4 model available as of July 2025
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
    sonnet: 'claude-sonnet-4-20250514', // Latest Claude 4.0 Sonnet
    haiku: 'claude-3-haiku-20240307',
    claude4: 'claude-sonnet-4-20250514', // Latest Claude 4.0 Sonnet
    latest: 'claude-sonnet-4-20250514', // Latest Claude 4.0 Sonnet
    'sonnet-20240229': 'claude-3-sonnet-20240229',
    'sonnet-20241022': 'claude-3-5-sonnet-20241022',
    'haiku-20241022': 'claude-3-5-haiku-20241022'
  },
  defaultModel: 'claude-sonnet-4-20250514', // Latest Claude 4.0 Sonnet
  timeout: 30000,
  maxRetries: 3,
  version: 'sonnet-4-latest',
  lastUpdated: '2025-07-28T02:16:37.055Z'
};