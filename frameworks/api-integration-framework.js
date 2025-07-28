/**
 * Direct API Integration Framework
 * Direct API integration patterns for Meta Team
 */

const https = require('https');
const { AuthTestingFramework } = require('../utils/auth-testing-framework');
const { ComprehensiveErrorHandler } = require('../utils/comprehensive-error-handler');
const config = require('../config/api-config');

class DirectAPIIntegration {
  constructor() {
    this.authFramework = new AuthTestingFramework();
    this.errorHandler = new ComprehensiveErrorHandler();
    this.apiMetrics = new Map();
    this.rateLimiters = new Map();
  }

  async makeAPICall(apiConfig, requestData) {
    console.log(`🔗 Making direct API call to ${apiConfig.service}`);
    
    // Validate authentication
    await this.authFramework.validateBeforeIntegration(apiConfig.service);
    
    const startTime = Date.now();
    
    try {
      // Check rate limiting
      await this.checkRateLimit(apiConfig.service);
      
      // Make the API call
      const response = await this.executeAPICall(apiConfig, requestData);
      
      // Update metrics
      this.updateMetrics(apiConfig.service, true, Date.now() - startTime);
      
      return response;
      
    } catch (error) {
      // Update metrics
      this.updateMetrics(apiConfig.service, false, Date.now() - startTime);
      
      // Handle API error
      await this.errorHandler.handleError(error, `api-call-${apiConfig.service}`);
      
      // Attempt recovery
      return await this.attemptAPIRecovery(apiConfig, requestData, error);
    }
  }

  async executeAPICall(apiConfig, requestData) {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(requestData);
      
      const requestOptions = {
        hostname: apiConfig.hostname,
        port: apiConfig.port || 443,
        path: apiConfig.path,
        method: apiConfig.method || 'POST',
        headers: {
          ...apiConfig.headers,
          'content-length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(requestOptions, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              const response = JSON.parse(data);
              resolve(response);
            } catch (error) {
              reject(new Error(`Failed to parse response: ${error.message}`));
            }
          } else {
            reject(new Error(`API request failed: ${res.statusCode} - ${data}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(postData);
      req.end();
    });
  }

  async checkRateLimit(service) {
    const limiter = this.rateLimiters.get(service);
    if (limiter && limiter.isLimited()) {
      throw new Error(`Rate limit exceeded for ${service}`);
    }
  }

  async attemptAPIRecovery(apiConfig, requestData, originalError) {
    console.log(`🔄 Attempting API recovery for ${apiConfig.service}`);
    
    // Implement retry logic
    for (let attempt = 1; attempt <= config.retries; attempt++) {
      try {
        console.log(`  Retry attempt ${attempt}/${config.retries}`);
        
        // Wait before retry
        await this.delay(config.retryDelay * attempt);
        
        // Retry the API call
        return await this.executeAPICall(apiConfig, requestData);
        
      } catch (retryError) {
        console.log(`  Retry attempt ${attempt} failed: ${retryError.message}`);
        
        if (attempt === config.retries) {
          throw new Error(`API recovery failed after ${config.retries} attempts`);
        }
      }
    }
  }

  updateMetrics(service, success, duration) {
    const metrics = this.apiMetrics.get(service) || {
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      totalDuration: 0,
      averageDuration: 0
    };
    
    metrics.totalCalls++;
    metrics.totalDuration += duration;
    metrics.averageDuration = metrics.totalDuration / metrics.totalCalls;
    
    if (success) {
      metrics.successfulCalls++;
    } else {
      metrics.failedCalls++;
    }
    
    this.apiMetrics.set(service, metrics);
  }

  getAPIMetrics() {
    return Object.fromEntries(this.apiMetrics);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = { DirectAPIIntegration };