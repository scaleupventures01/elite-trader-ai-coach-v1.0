/**
 * 🛡️ Claude Code Specific Error Handler
 * Specialized error handling for Claude Code API with specific recovery strategies
 * 
 * @author Meta Team - Backend Team
 * @version 1.0.0
 * @date 2025-07-27
 */

const apiErrorHandler = require('./api-error-handler');
const apiConfig = require('../config/api-config');
const logger = require('./logger');

class ClaudeCodeErrorHandler {
  constructor() {
    this.config = apiConfig.getClaudeCodeConfig();
    this.claudeCodeErrors = new Map();
    this.recoveryStrategies = new Map();
    this.setupRecoveryStrategies();
  }

  /**
   * Setup Claude Code specific recovery strategies
   */
  setupRecoveryStrategies() {
    // Authentication errors
    this.recoveryStrategies.set('authentication', async (error, context) => {
      logger.warn('Claude Code authentication error detected');
      
      // Try alternative authentication method
      if (process.env.ANTHROPIC_API_KEY && !process.env.CLAUDE_CODE_OAUTH_TOKEN) {
        logger.info('Attempting to use OAuth token instead of API key');
        process.env.CLAUDE_CODE_OAUTH_TOKEN = process.env.ANTHROPIC_API_KEY;
        delete process.env.ANTHROPIC_API_KEY;
        return await this.retryWithNewAuth(context);
      } else if (process.env.CLAUDE_CODE_OAUTH_TOKEN && !process.env.ANTHROPIC_API_KEY) {
        logger.info('Attempting to use API key instead of OAuth token');
        process.env.ANTHROPIC_API_KEY = process.env.CLAUDE_CODE_OAUTH_TOKEN;
        delete process.env.CLAUDE_CODE_OAUTH_TOKEN;
        return await this.retryWithNewAuth(context);
      }
      
      return this.createFallbackResponse(error, 'authentication_failed');
    });

    // Rate limiting errors
    this.recoveryStrategies.set('rate_limit', async (error, context) => {
      logger.warn('Claude Code rate limit exceeded');
      
      // Implement exponential backoff for rate limits
      const delay = this.calculateRateLimitDelay(error);
      logger.info(`Waiting ${delay}ms before retry due to rate limit`);
      
      await this.sleep(delay);
      return await this.retryWithBackoff(context, 1);
    });

    // Streaming errors
    this.recoveryStrategies.set('streaming', async (error, context) => {
      logger.warn('Claude Code streaming error detected');
      
      // Try non-streaming approach or fallback
      return await this.executeNonStreamingFallback(context);
    });

    // Model-specific errors
    this.recoveryStrategies.set('model_error', async (error, context) => {
      logger.warn('Claude Code model error detected');
      
      // Try alternative model
      const alternativeModels = [
        'claude-3-5-sonnet-20241022',
        'claude-3-5-haiku-20241022',
        'claude-3-opus-20240229'
      ];
      
      for (const model of alternativeModels) {
        try {
          logger.info(`Attempting with alternative model: ${model}`);
          const result = await this.retryWithModel(context, model);
          if (result.success) {
            return result;
          }
        } catch (modelError) {
          logger.warn(`Model ${model} failed: ${modelError.message}`);
        }
      }
      
      return this.createFallbackResponse(error, 'model_unavailable');
    });

    // Network errors
    this.recoveryStrategies.set('network', async (error, context) => {
      logger.warn('Claude Code network error detected');
      
      // Implement circuit breaker pattern
      if (this.isCircuitBreakerOpen('claude-code')) {
        return this.createFallbackResponse(error, 'circuit_breaker_open');
      }
      
      return await this.retryWithExponentialBackoff(context, error);
    });
  }

  /**
   * Handle Claude Code specific errors
   */
  async handleClaudeCodeError(error, context, retryCount = 0) {
    const errorInfo = this.analyzeClaudeCodeError(error);
    
    // Log error with Claude Code specific details
    this.logClaudeCodeError(error, context, errorInfo);
    
    // Check if we have a specific recovery strategy
    if (this.recoveryStrategies.has(errorInfo.type)) {
      try {
        const recoveryStrategy = this.recoveryStrategies.get(errorInfo.type);
        const result = await recoveryStrategy(error, context);
        
        if (result.success) {
          logger.success(`Claude Code error recovered using ${errorInfo.type} strategy`);
          return result;
        }
      } catch (recoveryError) {
        logger.error(`Recovery strategy failed: ${recoveryError.message}`);
      }
    }
    
    // Fall back to general API error handler
    return await apiErrorHandler.handleError(error, context, retryCount);
  }

  /**
   * Analyze Claude Code specific errors
   */
  analyzeClaudeCodeError(error) {
    const errorInfo = {
      type: 'unknown',
      severity: 'medium',
      retryable: false,
      claudeCodeSpecific: true,
      model: null,
      prompt: null,
      files: []
    };

    // Extract Claude Code specific information
    if (error.message) {
      if (error.message.includes('authentication') || error.message.includes('401') || error.message.includes('403')) {
        errorInfo.type = 'authentication';
        errorInfo.severity = 'high';
        errorInfo.retryable = false;
      } else if (error.message.includes('rate limit') || error.message.includes('429')) {
        errorInfo.type = 'rate_limit';
        errorInfo.severity = 'medium';
        errorInfo.retryable = true;
      } else if (error.message.includes('stream') || error.message.includes('sdkMessages')) {
        errorInfo.type = 'streaming';
        errorInfo.severity = 'medium';
        errorInfo.retryable = true;
      } else if (error.message.includes('model') || error.message.includes('invalid model')) {
        errorInfo.type = 'model_error';
        errorInfo.severity = 'medium';
        errorInfo.retryable = true;
      } else if (error.message.includes('network') || error.message.includes('ECONN')) {
        errorInfo.type = 'network';
        errorInfo.severity = 'high';
        errorInfo.retryable = true;
      }
    }

    // Extract context information
    if (context.model) {
      errorInfo.model = context.model;
    }
    if (context.prompt) {
      errorInfo.prompt = context.prompt.substring(0, 100) + '...';
    }
    if (context.files) {
      errorInfo.files = context.files;
    }

    return errorInfo;
  }

  /**
   * Retry with new authentication method
   */
  async retryWithNewAuth(context) {
    try {
      logger.info('Retrying with new authentication method');
      
      // Clear any cached authentication
      delete require.cache[require.resolve('@anthropic-ai/claude-code')];
      
      const { query } = require('@anthropic-ai/claude-code');
      const queryResult = query({
        prompt: context.prompt,
        files: context.files || [],
        model: context.model || this.config.model
      });

      let response = '';
      for await (const chunk of queryResult.sdkMessages) {
        if (chunk.type === 'content_block_delta' && chunk.delta && chunk.delta.text) {
          response += chunk.delta.text;
        }
      }
      
      return { success: true, data: response, authMethod: 'switched' };
    } catch (error) {
      logger.error('Retry with new auth failed:', error.message);
      return this.createFallbackResponse(error, 'auth_retry_failed');
    }
  }

  /**
   * Calculate rate limit delay
   */
  calculateRateLimitDelay(error) {
    // Extract retry-after header if available
    let baseDelay = 5000; // 5 seconds default
    
    if (error.headers && error.headers['retry-after']) {
      baseDelay = parseInt(error.headers['retry-after']) * 1000;
    }
    
    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 0.2 * baseDelay;
    return baseDelay + jitter;
  }

  /**
   * Execute non-streaming fallback
   */
  async executeNonStreamingFallback(context) {
    try {
      logger.info('Attempting non-streaming fallback');
      
      // Use a simpler approach that doesn't rely on streaming
      const { query } = require('@anthropic-ai/claude-code');
      
      // Try with different options
      const queryResult = query({
        prompt: context.prompt,
        files: context.files || [],
        model: context.model || this.config.model,
        max_tokens: Math.min(context.maxTokens || 4000, 2000) // Reduce token limit
      });

      let response = '';
      let timeout = setTimeout(() => {
        logger.warn('Non-streaming fallback timed out');
      }, 30000);

      try {
        for await (const chunk of queryResult.sdkMessages) {
          if (chunk.type === 'content_block_delta' && chunk.delta && chunk.delta.text) {
            response += chunk.delta.text;
          }
        }
        clearTimeout(timeout);
      } catch (streamError) {
        clearTimeout(timeout);
        throw streamError;
      }
      
      return { success: true, data: response, method: 'non_streaming_fallback' };
    } catch (error) {
      logger.error('Non-streaming fallback failed:', error.message);
      return this.createFallbackResponse(error, 'streaming_fallback_failed');
    }
  }

  /**
   * Retry with different model
   */
  async retryWithModel(context, model) {
    try {
      logger.info(`Retrying with model: ${model}`);
      
      const { query } = require('@anthropic-ai/claude-code');
      const queryResult = query({
        prompt: context.prompt,
        files: context.files || [],
        model: model
      });

      let response = '';
      for await (const chunk of queryResult.sdkMessages) {
        if (chunk.type === 'content_block_delta' && chunk.delta && chunk.delta.text) {
          response += chunk.delta.text;
        }
      }
      
      return { success: true, data: response, model: model };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retry with exponential backoff
   */
  async retryWithExponentialBackoff(context, error) {
    const maxRetries = this.config.maxRetries || 3;
    const baseDelay = this.config.retryDelay || 1000;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const delay = baseDelay * Math.pow(2, attempt - 1);
      logger.info(`Retry attempt ${attempt}/${maxRetries} in ${delay}ms`);
      
      await this.sleep(delay);
      
      try {
        const { query } = require('@anthropic-ai/claude-code');
        const queryResult = query({
          prompt: context.prompt,
          files: context.files || [],
          model: context.model || this.config.model
        });

        let response = '';
        for await (const chunk of queryResult.sdkMessages) {
          if (chunk.type === 'content_block_delta' && chunk.delta && chunk.delta.text) {
            response += chunk.delta.text;
          }
        }
        
        return { success: true, data: response, retryAttempt: attempt };
      } catch (retryError) {
        logger.warn(`Retry attempt ${attempt} failed: ${retryError.message}`);
        
        if (attempt === maxRetries) {
          return this.createFallbackResponse(retryError, 'max_retries_exceeded');
        }
      }
    }
  }

  /**
   * Check if circuit breaker is open
   */
  isCircuitBreakerOpen(service) {
    const key = `circuit_breaker_${service}`;
    const lastFailure = this.claudeCodeErrors.get(key);
    
    if (!lastFailure) return false;
    
    const timeSinceFailure = Date.now() - lastFailure;
    const circuitBreakerTimeout = 60000; // 1 minute
    
    return timeSinceFailure < circuitBreakerTimeout;
  }

  /**
   * Create fallback response
   */
  createFallbackResponse(error, fallbackType) {
    const fallbackMessages = {
      'authentication_failed': 'Authentication failed. Please check your API credentials.',
      'model_unavailable': 'Claude Code model is currently unavailable. Please try again later.',
      'streaming_fallback_failed': 'Unable to process streaming response. Please try again.',
      'auth_retry_failed': 'Authentication retry failed. Please check your credentials.',
      'circuit_breaker_open': 'Service temporarily unavailable due to recent errors.',
      'max_retries_exceeded': 'Maximum retry attempts exceeded. Please try again later.'
    };

    return {
      success: false,
      error: {
        message: fallbackMessages[fallbackType] || 'Claude Code service unavailable',
        type: fallbackType,
        originalError: error.message,
        timestamp: new Date().toISOString()
      },
      data: null,
      fallback: true
    };
  }

  /**
   * Log Claude Code specific error
   */
  logClaudeCodeError(error, context, errorInfo) {
    const logData = {
      message: error.message,
      type: errorInfo.type,
      severity: errorInfo.severity,
      service: 'claude-code',
      model: errorInfo.model,
      prompt: errorInfo.prompt,
      files: errorInfo.files,
      timestamp: new Date().toISOString()
    };
    
    if (errorInfo.severity === 'high') {
      logger.error('Claude Code Error', logData);
    } else {
      logger.warn('Claude Code Warning', logData);
    }
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get Claude Code error statistics
   */
  getClaudeCodeErrorStats() {
    const stats = {
      totalErrors: 0,
      byType: {},
      byModel: {},
      circuitBreakerStatus: {}
    };
    
    for (const [key, timestamp] of this.claudeCodeErrors.entries()) {
      if (key.startsWith('circuit_breaker_')) {
        const service = key.replace('circuit_breaker_', '');
        stats.circuitBreakerStatus[service] = this.isCircuitBreakerOpen(service);
      }
    }
    
    return stats;
  }

  /**
   * Clear Claude Code error tracking
   */
  clearClaudeCodeErrorTracking() {
    this.claudeCodeErrors.clear();
    logger.info('Claude Code error tracking cleared');
  }
}

// Create singleton instance
const claudeCodeErrorHandler = new ClaudeCodeErrorHandler();

module.exports = claudeCodeErrorHandler; 