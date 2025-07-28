/**
 * 📋 Claude Code Integration Template
 * Reusable template for integrating Claude Code API with error handling and fallbacks
 * 
 * @author Meta Team - Backend Team
 * @version 1.0.0
 * @date 2025-07-27
 */

const { query } = require('@anthropic-ai/claude-code');
const apiErrorHandler = require('../utils/api-error-handler');
const claudeCodeErrorHandler = require('../utils/claude-code-error-handler');
const fileVersioning = require('../utils/file-versioning');
const RetryStrategy = require('../utils/retry-strategy');
const fallbackStrategies = require('../utils/fallback-strategies');
const logger = require('../utils/logger');

/**
 * Claude Code Integration Class
 * Provides robust Claude Code API integration with comprehensive error handling
 */
class ClaudeCodeIntegration {
  constructor(options = {}) {
    this.config = {
      model: options.model || 'claude-3-5-sonnet-20241022',
      maxTokens: options.maxTokens || 4000,
      temperature: options.temperature || 0.1,
      timeout: options.timeout || 30000,
      maxRetries: options.maxRetries || 3,
      enableBackup: options.enableBackup !== false,
      enableFallback: options.enableFallback !== false,
      ...options
    };

    this.retryStrategy = RetryStrategy.createForService('claude-code', {
      maxRetries: this.config.maxRetries,
      baseDelay: 2000,
      maxDelay: 30000
    });

    this.setupErrorHandling();
  }

  /**
   * Setup error handling and fallback strategies
   */
  setupErrorHandling() {
    // Register fallback strategies
    if (this.config.enableFallback) {
      apiErrorHandler.registerFallback('claude-code', async (context, errorInfo) => {
        return await fallbackStrategies.executeFallback('claude-code', 'analyze', context, errorInfo);
      });
    }
  }

  /**
   * Analyze file with Claude Code
   */
  async analyzeFile(filePath, prompt, options = {}) {
    const analysisOptions = { ...this.config, ...options };
    
    // Create backup if enabled
    if (this.config.enableBackup) {
      await this.createBackup(filePath, {
        team: options.team || 'unknown',
        action: 'analysis',
        description: `Claude Code analysis: ${prompt.substring(0, 100)}...`
      });
    }

    const context = {
      service: 'claude-code',
      url: 'https://api.anthropic.com',
      method: 'POST',
      filePath,
      prompt,
      model: analysisOptions.model,
      retryFunction: () => this.executeQuery(filePath, prompt, analysisOptions),
      fallbackFunction: () => this.executeFallback(filePath, prompt, analysisOptions)
    };

    try {
      const result = await this.retryStrategy.execute(async () => {
        return await this.executeQuery(filePath, prompt, analysisOptions);
      });

      return {
        success: true,
        data: result,
        metadata: {
          filePath,
          prompt: prompt.substring(0, 100) + '...',
          model: analysisOptions.model,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return await claudeCodeErrorHandler.handleClaudeCodeError(error, context);
    }
  }

  /**
   * Generate code with Claude Code
   */
  async generateCode(prompt, options = {}) {
    const generationOptions = { ...this.config, ...options };
    
    const context = {
      service: 'claude-code',
      url: 'https://api.anthropic.com',
      method: 'POST',
      prompt,
      model: generationOptions.model,
      retryFunction: () => this.executeGeneration(prompt, generationOptions),
      fallbackFunction: () => this.executeGenerationFallback(prompt, generationOptions)
    };

    try {
      const result = await this.retryStrategy.execute(async () => {
        return await this.executeGeneration(prompt, generationOptions);
      });

      return {
        success: true,
        data: result,
        metadata: {
          prompt: prompt.substring(0, 100) + '...',
          model: generationOptions.model,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return await claudeCodeErrorHandler.handleClaudeCodeError(error, context);
    }
  }

  /**
   * Enhance existing file with Claude Code
   */
  async enhanceFile(filePath, enhancementPrompt, options = {}) {
    const enhancementOptions = { ...this.config, ...options };
    
    // Create backup before enhancement
    if (this.config.enableBackup) {
      await this.createBackup(filePath, {
        team: options.team || 'unknown',
        action: 'enhancement',
        description: `Claude Code enhancement: ${enhancementPrompt.substring(0, 100)}...`
      });
    }

    const context = {
      service: 'claude-code',
      url: 'https://api.anthropic.com',
      method: 'POST',
      filePath,
      prompt: enhancementPrompt,
      model: enhancementOptions.model,
      retryFunction: () => this.executeEnhancement(filePath, enhancementPrompt, enhancementOptions),
      fallbackFunction: () => this.executeEnhancementFallback(filePath, enhancementPrompt, enhancementOptions)
    };

    try {
      const result = await this.retryStrategy.execute(async () => {
        return await this.executeEnhancement(filePath, enhancementPrompt, enhancementOptions);
      });

      // Create version after successful enhancement
      if (result.success && options.createVersion) {
        await this.createVersion(filePath, options.version || 'enhanced', {
          team: options.team || 'unknown',
          action: 'enhancement',
          description: `Enhanced with Claude Code: ${enhancementPrompt.substring(0, 100)}...`
        });
      }

      return result;
    } catch (error) {
      return await claudeCodeErrorHandler.handleClaudeCodeError(error, context);
    }
  }

  /**
   * Execute Claude Code query
   */
  async executeQuery(filePath, prompt, options) {
    const queryOptions = {
      prompt,
      files: [filePath],
      model: options.model,
      max_tokens: options.maxTokens,
      temperature: options.temperature
    };

    const queryResult = query(queryOptions);
    let response = '';

    for await (const chunk of queryResult.sdkMessages) {
      if (chunk.type === 'content_block_delta' && chunk.delta && chunk.delta.text) {
        response += chunk.delta.text;
        
        // Progress callback
        if (options.onProgress) {
          options.onProgress(chunk.delta.text);
        }
      }
    }

    return response;
  }

  /**
   * Execute code generation
   */
  async executeGeneration(prompt, options) {
    const queryOptions = {
      prompt,
      files: [], // No input files for generation
      model: options.model,
      max_tokens: options.maxTokens,
      temperature: options.temperature
    };

    const queryResult = query(queryOptions);
    let response = '';

    for await (const chunk of queryResult.sdkMessages) {
      if (chunk.type === 'content_block_delta' && chunk.delta && chunk.delta.text) {
        response += chunk.delta.text;
        
        // Progress callback
        if (options.onProgress) {
          options.onProgress(chunk.delta.text);
        }
      }
    }

    return response;
  }

  /**
   * Execute file enhancement
   */
  async executeEnhancement(filePath, prompt, options) {
    const queryOptions = {
      prompt,
      files: [filePath],
      model: options.model,
      max_tokens: options.maxTokens,
      temperature: options.temperature
    };

    const queryResult = query(queryOptions);
    let response = '';

    for await (const chunk of queryResult.sdkMessages) {
      if (chunk.type === 'content_block_delta' && chunk.delta && chunk.delta.text) {
        response += chunk.delta.text;
        
        // Progress callback
        if (options.onProgress) {
          options.onProgress(chunk.delta.text);
        }
      }
    }

    return response;
  }

  /**
   * Execute fallback for analysis
   */
  async executeFallback(filePath, prompt, options) {
    logger.warn(`Executing fallback for analysis: ${filePath}`);
    
    try {
      const fallbackResult = await fallbackStrategies.executeFallback(
        'claude-code', 
        'analyze', 
        { filePath, prompt }, 
        { type: 'fallback' }
      );
      
      return fallbackResult.data;
    } catch (error) {
      logger.error(`Fallback failed: ${error.message}`);
      return `Analysis unavailable: ${error.message}`;
    }
  }

  /**
   * Execute fallback for generation
   */
  async executeGenerationFallback(prompt, options) {
    logger.warn(`Executing fallback for generation: ${prompt.substring(0, 50)}...`);
    
    try {
      const fallbackResult = await fallbackStrategies.executeFallback(
        'claude-code', 
        'generate', 
        { prompt, template: options.template }, 
        { type: 'fallback' }
      );
      
      return fallbackResult.data;
    } catch (error) {
      logger.error(`Generation fallback failed: ${error.message}`);
      return `Code generation unavailable: ${error.message}`;
    }
  }

  /**
   * Execute fallback for enhancement
   */
  async executeEnhancementFallback(filePath, prompt, options) {
    logger.warn(`Executing fallback for enhancement: ${filePath}`);
    
    try {
      const fallbackResult = await fallbackStrategies.executeFallback(
        'claude-code', 
        'enhance', 
        { filePath, enhancementType: options.enhancementType }, 
        { type: 'fallback' }
      );
      
      return fallbackResult.data;
    } catch (error) {
      logger.error(`Enhancement fallback failed: ${error.message}`);
      return `Enhancement unavailable: ${error.message}`;
    }
  }

  /**
   * Create backup of file
   */
  async createBackup(filePath, metadata = {}) {
    try {
      const backup = await fileVersioning.createBackup(filePath);
      if (backup) {
        logger.info(`Backup created: ${backup.backupPath}`);
      }
      return backup;
    } catch (error) {
      logger.warn(`Backup creation failed: ${error.message}`);
      return null;
    }
  }

  /**
   * Create version of file
   */
  async createVersion(filePath, version, metadata = {}) {
    try {
      const versionData = await fileVersioning.createVersion(filePath, version, metadata);
      logger.info(`Version created: ${versionData.versionPath}`);
      return versionData;
    } catch (error) {
      logger.error(`Version creation failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get integration statistics
   */
  getStats() {
    return {
      config: this.config,
      retryStrategy: this.retryStrategy.getStats ? this.retryStrategy.getStats() : null,
      errorStats: apiErrorHandler.getErrorStats(),
      claudeCodeErrorStats: claudeCodeErrorHandler.getClaudeCodeErrorStats()
    };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    logger.info('Claude Code integration configuration updated');
  }

  /**
   * Clear error tracking
   */
  clearErrorTracking() {
    apiErrorHandler.clearErrorTracking();
    claudeCodeErrorHandler.clearClaudeCodeErrorTracking();
    logger.info('Error tracking cleared');
  }
}

/**
 * Factory function to create Claude Code integration instance
 */
function createClaudeCodeIntegration(options = {}) {
  return new ClaudeCodeIntegration(options);
}

/**
 * Quick analysis function
 */
async function quickAnalyze(filePath, prompt, options = {}) {
  const integration = createClaudeCodeIntegration(options);
  return await integration.analyzeFile(filePath, prompt, options);
}

/**
 * Quick generation function
 */
async function quickGenerate(prompt, options = {}) {
  const integration = createClaudeCodeIntegration(options);
  return await integration.generateCode(prompt, options);
}

/**
 * Quick enhancement function
 */
async function quickEnhance(filePath, prompt, options = {}) {
  const integration = createClaudeCodeIntegration(options);
  return await integration.enhanceFile(filePath, prompt, options);
}

// Export functions and classes
module.exports = {
  ClaudeCodeIntegration,
  createClaudeCodeIntegration,
  quickAnalyze,
  quickGenerate,
  quickEnhance
};

// Example usage:
/*
const { quickAnalyze, quickGenerate, quickEnhance } = require('./templates/claude-code-integration');

// Analyze a file
const analysis = await quickAnalyze('server.js', 'Find potential bugs and suggest improvements');

// Generate code
const code = await quickGenerate('Create a React component for a user profile card');

// Enhance a file
const enhanced = await quickEnhance('index.html', 'Add responsive design and accessibility features', {
  createVersion: true,
  version: '1.1.0',
  team: 'frontend'
});
*/ 