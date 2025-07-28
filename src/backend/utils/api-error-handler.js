/**
 * 🛡️ Centralized API Error Handling Utility
 * Handles all external API errors with retry logic and fallback strategies
 * 
 * @author Meta Team - Backend Team
 * @version 1.0.0
 * @date 2025-07-27
 */

const apiConfig = require('../config/api-config');
const logger = require('./logger');

class APIErrorHandler {
  constructor() {
    this.config = apiConfig.getMetaTeamConfig();
    this.errorCounts = new Map();
    this.retryQueue = new Map();
    this.fallbackStrategies = new Map();
  }

  /**
   * Handle API error with retry logic
   */
  async handleError(error, context, retryCount = 0) {
    const errorId = this.generateErrorId(context);
    const errorInfo = this.analyzeError(error);
    
    // Log error
    this.logError(error, context, errorInfo);
    
    // Update error counts
    this.updateErrorCount(errorId, errorInfo);
    
    // Check if we should retry
    if (this.shouldRetry(errorInfo, retryCount)) {
      return await this.retryRequest(context, retryCount, errorInfo);
    }
    
    // Try fallback strategy
    if (this.hasFallback(context)) {
      return await this.executeFallback(context, errorInfo);
    }
    
    // Return error response
    return this.createErrorResponse(error, context, errorInfo);
  }

  /**
   * Analyze error to determine type and severity
   */
  analyzeError(error) {
    const errorInfo = {
      type: 'unknown',
      severity: 'medium',
      retryable: false,
      timeout: false,
      rateLimited: false,
      authentication: false,
      network: false,
      server: false,
      client: false
    };

    if (error.code) {
      switch (error.code) {
        case 'ECONNRESET':
        case 'ENOTFOUND':
        case 'ETIMEDOUT':
          errorInfo.type = 'network';
          errorInfo.severity = 'high';
          errorInfo.retryable = true;
          errorInfo.network = true;
          break;
        case 'ECONNREFUSED':
          errorInfo.type = 'server';
          errorInfo.severity = 'high';
          errorInfo.retryable = true;
          errorInfo.server = true;
          break;
        case 'ENOTFOUND':
          errorInfo.type = 'dns';
          errorInfo.severity = 'medium';
          errorInfo.retryable = true;
          errorInfo.network = true;
          break;
      }
    }

    if (error.status) {
      switch (error.status) {
        case 401:
        case 403:
          errorInfo.type = 'authentication';
          errorInfo.severity = 'high';
          errorInfo.retryable = false;
          errorInfo.authentication = true;
          break;
        case 429:
          errorInfo.type = 'rate_limit';
          errorInfo.severity = 'medium';
          errorInfo.retryable = true;
          errorInfo.rateLimited = true;
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          errorInfo.type = 'server';
          errorInfo.severity = 'medium';
          errorInfo.retryable = true;
          errorInfo.server = true;
          break;
        case 400:
        case 404:
          errorInfo.type = 'client';
          errorInfo.severity = 'low';
          errorInfo.retryable = false;
          errorInfo.client = true;
          break;
      }
    }

    if (error.message) {
      if (error.message.includes('timeout')) {
        errorInfo.timeout = true;
        errorInfo.retryable = true;
      }
      if (error.message.includes('rate limit')) {
        errorInfo.rateLimited = true;
        errorInfo.retryable = true;
      }
    }

    return errorInfo;
  }

  /**
   * Check if error should be retried
   */
  shouldRetry(errorInfo, retryCount) {
    if (!errorInfo.retryable) return false;
    if (retryCount >= this.config.maxRetries) return false;
    
    // Check error frequency
    const errorId = this.generateErrorId({ type: errorInfo.type });
    const recentErrors = this.getRecentErrorCount(errorId);
    
    if (recentErrors > 10) {
      logger.warn(`Too many recent errors of type ${errorInfo.type}, not retrying`);
      return false;
    }
    
    return true;
  }

  /**
   * Retry request with exponential backoff
   */
  async retryRequest(context, retryCount, errorInfo) {
    const delay = this.calculateRetryDelay(retryCount, errorInfo);
    
    logger.info(`Retrying request (attempt ${retryCount + 1}/${this.config.maxRetries}) in ${delay}ms`);
    
    // Wait before retry
    await this.sleep(delay);
    
    // Execute retry
    try {
      return await context.retryFunction();
    } catch (error) {
      return await this.handleError(error, context, retryCount + 1);
    }
  }

  /**
   * Calculate retry delay with exponential backoff
   */
  calculateRetryDelay(retryCount, errorInfo) {
    let baseDelay = 1000; // 1 second
    
    // Adjust base delay based on error type
    if (errorInfo.rateLimited) {
      baseDelay = 5000; // 5 seconds for rate limits
    } else if (errorInfo.server) {
      baseDelay = 2000; // 2 seconds for server errors
    }
    
    // Exponential backoff
    const delay = baseDelay * Math.pow(2, retryCount);
    
    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 0.1 * delay;
    
    return Math.min(delay + jitter, 30000); // Max 30 seconds
  }

  /**
   * Check if fallback strategy exists
   */
  hasFallback(context) {
    return this.fallbackStrategies.has(context.service) || 
           (context.fallbackFunction && typeof context.fallbackFunction === 'function');
  }

  /**
   * Execute fallback strategy
   */
  async executeFallback(context, errorInfo) {
    logger.info(`Executing fallback strategy for ${context.service}`);
    
    try {
      if (context.fallbackFunction) {
        return await context.fallbackFunction(errorInfo);
      }
      
      const fallback = this.fallbackStrategies.get(context.service);
      if (fallback) {
        return await fallback(context, errorInfo);
      }
      
      throw new Error('No fallback strategy available');
    } catch (fallbackError) {
      logger.error(`Fallback strategy failed: ${fallbackError.message}`);
      return this.createErrorResponse(fallbackError, context, errorInfo);
    }
  }

  /**
   * Create standardized error response
   */
  createErrorResponse(error, context, errorInfo) {
    return {
      success: false,
      error: {
        message: error.message || 'Unknown error occurred',
        type: errorInfo.type,
        severity: errorInfo.severity,
        retryable: errorInfo.retryable,
        context: context.service || 'unknown',
        timestamp: new Date().toISOString(),
        errorId: this.generateErrorId(context)
      },
      data: null,
      fallback: this.hasFallback(context)
    };
  }

  /**
   * Register fallback strategy for a service
   */
  registerFallback(service, fallbackFunction) {
    this.fallbackStrategies.set(service, fallbackFunction);
    logger.info(`Registered fallback strategy for ${service}`);
  }

  /**
   * Generate unique error ID
   */
  generateErrorId(context) {
    const service = context.service || 'unknown';
    const timestamp = Math.floor(Date.now() / 60000); // Minute precision
    return `${service}_${timestamp}`;
  }

  /**
   * Update error count for tracking
   */
  updateErrorCount(errorId, errorInfo) {
    const key = `${errorId}_${errorInfo.type}`;
    const count = this.errorCounts.get(key) || 0;
    this.errorCounts.set(key, count + 1);
    
    // Clean up old entries (older than 1 hour)
    setTimeout(() => {
      this.errorCounts.delete(key);
    }, 3600000);
  }

  /**
   * Get recent error count
   */
  getRecentErrorCount(errorId) {
    let total = 0;
    for (const [key, count] of this.errorCounts.entries()) {
      if (key.startsWith(errorId)) {
        total += count;
      }
    }
    return total;
  }

  /**
   * Log error with context
   */
  logError(error, context, errorInfo) {
    const logData = {
      message: error.message,
      type: errorInfo.type,
      severity: errorInfo.severity,
      service: context.service,
      url: context.url,
      method: context.method,
      timestamp: new Date().toISOString()
    };
    
    if (errorInfo.severity === 'high') {
      logger.error('API Error', logData);
    } else if (errorInfo.severity === 'medium') {
      logger.warn('API Warning', logData);
    } else {
      logger.info('API Info', logData);
    }
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    const stats = {
      totalErrors: 0,
      byType: {},
      byService: {},
      recentErrors: 0
    };
    
    for (const [key, count] of this.errorCounts.entries()) {
      stats.totalErrors += count;
      const [service, timestamp, type] = key.split('_');
      
      stats.byType[type] = (stats.byType[type] || 0) + count;
      stats.byService[service] = (stats.byService[service] || 0) + count;
      
      // Count recent errors (last 5 minutes)
      const errorTime = parseInt(timestamp) * 60000;
      if (Date.now() - errorTime < 300000) {
        stats.recentErrors += count;
      }
    }
    
    return stats;
  }

  /**
   * Clear error tracking
   */
  clearErrorTracking() {
    this.errorCounts.clear();
    this.retryQueue.clear();
    logger.info('Error tracking cleared');
  }
}

// Create singleton instance
const apiErrorHandler = new APIErrorHandler();

module.exports = apiErrorHandler; 