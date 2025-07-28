/**
 * Claude Code API Integration Fix
 * Proper implementation using Anthropic API directly
 */

const https = require('https');
const config = require('../config/claude-code-config');
const { claudeCodeTracker } = require('./claude-code-usage-tracker');

class ClaudeCodeAPI {
  constructor() {
    this.apiKey = config.apiKey;
    this.endpoint = config.endpoint;
    this.headers = config.headers;
    this.defaultModel = config.defaultModel;
    
    if (!this.apiKey) {
      throw new Error('CLAUDE_API_KEY environment variable is required');
    }
  }

  async query(prompt, options = {}) {
    const model = options.model || this.defaultModel;
    
    const requestBody = {
      model: model,
      max_tokens: options.maxTokens || 4000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    };

    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(requestBody);
      
      const requestOptions = {
        hostname: 'api.anthropic.com',
        port: 443,
        path: '/v1/messages',
        method: 'POST',
        headers: {
          ...this.headers,
          'content-length': Buffer.byteLength(postData)
        }
      };

      console.log(`🔗 Making Claude Code API call to ${model}...`);
      const startTime = Date.now();

      const req = https.request(requestOptions, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
                        res.on('end', () => {
                  const endTime = Date.now();
                  const duration = endTime - startTime;
                  console.log(`✅ Claude Code API call completed in ${duration}ms`);
                  
                  if (res.statusCode === 200) {
                    try {
                      const response = JSON.parse(data);
                      const responseText = response.content[0].text;
                      
                      // Track successful Claude Code usage
                      claudeCodeTracker.recordClaudeCodeCall(prompt, responseText, response.usage?.input_tokens + response.usage?.output_tokens || 0, duration);
                      
                      resolve(responseText);
                    } catch (error) {
                      claudeCodeTracker.recordFailedClaudeCodeCall(prompt, error, duration);
                      reject(new Error(`Failed to parse response: ${error.message}`));
                    }
                  } else {
                    console.error(`❌ API Error: ${res.statusCode} - ${data}`);
                    claudeCodeTracker.recordFailedClaudeCodeCall(prompt, new Error(`API request failed: ${res.statusCode} - ${data}`), duration);
                    reject(new Error(`API request failed: ${res.statusCode} - ${data}`));
                  }
                });
      });

                    req.on('error', (error) => {
                console.error(`❌ Request Error: ${error.message}`);
                const endTime = Date.now();
                const duration = endTime - startTime;
                claudeCodeTracker.recordFailedClaudeCodeCall(prompt, error, duration);
                reject(error);
              });

      req.write(postData);
      req.end();
    });
  }

  async testConnection() {
    try {
      const response = await this.query('Hello, this is a test message.');
      return {
        success: true,
        response: response.substring(0, 100) + '...',
        message: 'API connection successful'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'API connection failed'
      };
    }
  }
}

module.exports = { ClaudeCodeAPI };