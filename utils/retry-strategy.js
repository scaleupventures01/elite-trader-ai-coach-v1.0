/**
 * 🔄 Retry Strategy Utility
 * Implements retry mechanisms with exponential backoff and jitter for failed API calls
 * 
 * @author Meta Team - Backend Team
 * @version 1.0.0
 * @date 2025-07-27
 */

const logger = require('./logger');

class RetryStrategy {
  constructor(options = {}) {
    this.defaultOptions = {
      maxRetries: options.maxRetries || 3,
      baseDelay: options.baseDelay || 1000,
      maxDelay: options.maxDelay || 30000,
      exponentialBackoff: options.exponentialBackoff !== false,
      jitter: options.jitter !== false,
      jitterFactor: options.jitterFactor || 0.1,
      retryCondition: options.retryCondition || this.defaultRetryCondition,
      onRetry: options.onRetry || this.defaultOnRetry,
      onMaxRetriesExceeded: options.onMaxRetriesExceeded || this.defaultOnMaxRetriesExceeded
    };
  }

  /**
   * Execute function with retry logic
   */
  async execute(fn, options = {}) {
    const config = { ...this.defaultOptions, ...options };
    let lastError;

    for (let attempt = 1; attempt <= config.maxRetries + 1; attempt++) {
      try {
        const result = await fn();
        return result;
      } catch (error) {
        lastError = error;
        
        // Check if we should retry
        if (attempt <= config.maxRetries && config.retryCondition(error, attempt)) {
          const delay = this.calculateDelay(attempt, config);
          
          // Call onRetry callback
          if (config.onRetry) {
            config.onRetry(error, attempt, delay);
          }
          
          // Wait before retry
          await this.sleep(delay);
        } else {
          // Max retries exceeded or error not retryable
          if (config.onMaxRetriesExceeded) {
            config.onMaxRetriesExceeded(error, attempt);
          }
          throw error;
        }
      }
    }
  }

  /**
   * Calculate delay for retry attempt
   */
  calculateDelay(attempt, config) {
    let delay = config.baseDelay;

    // Apply exponential backoff
    if (config.exponentialBackoff) {
      delay = delay * Math.pow(2, attempt - 1);
    }

    // Apply jitter to prevent thundering herd
    if (config.jitter) {
      const jitterAmount = delay * config.jitterFactor;
      const jitter = (Math.random() - 0.5) * 2 * jitterAmount;
      delay += jitter;
    }

    // Ensure delay doesn't exceed maximum
    return Math.min(delay, config.maxDelay);
  }

  /**
   * Default retry condition
   */
  defaultRetryCondition(error, attempt) {
    // Retry on network errors
    if (error.code && ['ECONNRESET', 'ENOTFOUND', 'ETIMEDOUT', 'ECONNREFUSED'].includes(error.code)) {
      return true;
    }

    // Retry on server errors
    if (error.status && [500, 502, 503, 504].includes(error.status)) {
      return true;
    }

    // Retry on rate limiting
    if (error.status === 429) {
      return true;
    }

    // Retry on timeout errors
    if (error.message && error.message.includes('timeout')) {
      return true;
    }

    // Don't retry on client errors (4xx except 429)
    if (error.status && error.status >= 400 && error.status < 500 && error.status !== 429) {
      return false;
    }

    // Don't retry on authentication errors
    if (error.status === 401 || error.status === 403) {
      return false;
    }

    return true;
  }

  /**
   * Default onRetry callback
   */
  defaultOnRetry(error, attempt, delay) {
    logger.warn(`Retry attempt ${attempt} in ${delay}ms due to: ${error.message}`);
  }

  /**
   * Default onMaxRetriesExceeded callback
   */
  defaultOnMaxRetriesExceeded(error, attempt) {
    logger.error(`Max retries (${attempt - 1}) exceeded. Final error: ${error.message}`);
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Create retry strategy for specific service
   */
  static createForService(service, options = {}) {
    const serviceDefaults = {
      claudeCode: {
        maxRetries: 3,
        baseDelay: 2000,
        maxDelay: 30000,
        retryCondition: (error) => {
          // Claude Code specific retry conditions
          if (error.message && error.message.includes('rate limit')) {
            return true;
          }
          if (error.message && error.message.includes('streaming')) {
            return true;
          }
          return RetryStrategy.prototype.defaultRetryCondition.call(this, error);
        }
      },
      api: {
        maxRetries: 5,
        baseDelay: 1000,
        maxDelay: 60000,
        exponentialBackoff: true,
        jitter: true
      },
      file: {
        maxRetries: 2,
        baseDelay: 500,
        maxDelay: 5000,
        retryCondition: (error) => {
          // File operation specific retry conditions
          if (error.code === 'EBUSY' || error.code === 'EACCES') {
            return true;
          }
          return false;
        }
      }
    };

    const serviceConfig = serviceDefaults[service] || {};
    return new RetryStrategy({ ...serviceConfig, ...options });
  }

  /**
   * Retry with exponential backoff only
   */
  static async withExponentialBackoff(fn, maxRetries = 3, baseDelay = 1000) {
    const strategy = new RetryStrategy({
      maxRetries,
      baseDelay,
      exponentialBackoff: true,
      jitter: false
    });
    
    return await strategy.execute(fn);
  }

  /**
   * Retry with fixed delay
   */
  static async withFixedDelay(fn, maxRetries = 3, delay = 1000) {
    const strategy = new RetryStrategy({
      maxRetries,
      baseDelay: delay,
      exponentialBackoff: false,
      jitter: false
    });
    
    return await strategy.execute(fn);
  }

  /**
   * Retry with custom condition
   */
  static async withCustomCondition(fn, retryCondition, options = {}) {
    const strategy = new RetryStrategy({
      ...options,
      retryCondition
    });
    
    return await strategy.execute(fn);
  }

  /**
   * Retry with backoff and jitter
   */
  static async withBackoffAndJitter(fn, options = {}) {
    const strategy = new RetryStrategy({
      exponentialBackoff: true,
      jitter: true,
      ...options
    });
    
    return await strategy.execute(fn);
  }

  /**
   * Retry with circuit breaker pattern
   */
  static createCircuitBreaker(options = {}) {
    const circuitBreaker = {
      state: 'CLOSED', // CLOSED, OPEN, HALF_OPEN
      failureCount: 0,
      lastFailureTime: null,
      threshold: options.threshold || 5,
      timeout: options.timeout || 60000, // 1 minute
      successThreshold: options.successThreshold || 2,
      successCount: 0
    };

    return {
      async execute(fn) {
        if (circuitBreaker.state === 'OPEN') {
          if (Date.now() - circuitBreaker.lastFailureTime > circuitBreaker.timeout) {
            circuitBreaker.state = 'HALF_OPEN';
            logger.info('Circuit breaker moved to HALF_OPEN state');
          } else {
            throw new Error('Circuit breaker is OPEN');
          }
        }

        try {
          const result = await fn();
          
          // Success - reset failure count
          circuitBreaker.failureCount = 0;
          circuitBreaker.successCount++;
          
          if (circuitBreaker.state === 'HALF_OPEN' && circuitBreaker.successCount >= circuitBreaker.successThreshold) {
            circuitBreaker.state = 'CLOSED';
            circuitBreaker.successCount = 0;
            logger.info('Circuit breaker moved to CLOSED state');
          }
          
          return result;
        } catch (error) {
          // Failure - increment failure count
          circuitBreaker.failureCount++;
          circuitBreaker.lastFailureTime = Date.now();
          circuitBreaker.successCount = 0;
          
          if (circuitBreaker.failureCount >= circuitBreaker.threshold) {
            circuitBreaker.state = 'OPEN';
            logger.warn('Circuit breaker moved to OPEN state');
          }
          
          throw error;
        }
      },
      
      getState() {
        return circuitBreaker.state;
      },
      
      getStats() {
        return {
          state: circuitBreaker.state,
          failureCount: circuitBreaker.failureCount,
          successCount: circuitBreaker.successCount,
          lastFailureTime: circuitBreaker.lastFailureTime,
          threshold: circuitBreaker.threshold,
          timeout: circuitBreaker.timeout
        };
      }
    };
  }

  /**
   * Retry with timeout
   */
  static async withTimeout(fn, timeout, options = {}) {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Operation timed out')), timeout);
    });

    const strategy = new RetryStrategy(options);
    
    try {
      return await Promise.race([
        strategy.execute(fn),
        timeoutPromise
      ]);
    } catch (error) {
      if (error.message === 'Operation timed out') {
        throw new Error(`Operation timed out after ${timeout}ms`);
      }
      throw error;
    }
  }

  /**
   * Retry with progress tracking
   */
  static async withProgress(fn, onProgress, options = {}) {
    const strategy = new RetryStrategy({
      ...options,
      onRetry: (error, attempt, delay) => {
        if (onProgress) {
          onProgress({
            type: 'retry',
            attempt,
            delay,
            error: error.message
          });
        }
        if (options.onRetry) {
          options.onRetry(error, attempt, delay);
        }
      }
    });
    
    return await strategy.execute(fn);
  }
}

module.exports = RetryStrategy; 