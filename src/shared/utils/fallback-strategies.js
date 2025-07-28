/**
 * 🛡️ Fallback Strategies Utility
 * Provides alternative implementations when external APIs fail
 * 
 * @author Meta Team - Backend Team
 * @version 1.0.0
 * @date 2025-07-27
 */

const logger = require('./logger');
const fs = require('fs');
const path = require('path');

class FallbackStrategies {
  constructor() {
    this.cache = new Map();
    this.fallbackImplementations = new Map();
    this.setupFallbackImplementations();
  }

  /**
   * Setup fallback implementations for different services
   */
  setupFallbackImplementations() {
    // Claude Code fallbacks
    this.fallbackImplementations.set('claude-code', {
      analyze: this.claudeCodeAnalyzeFallback.bind(this),
      generate: this.claudeCodeGenerateFallback.bind(this),
      enhance: this.claudeCodeEnhanceFallback.bind(this)
    });

    // API fallbacks
    this.fallbackImplementations.set('api', {
      request: this.apiRequestFallback.bind(this)
    });

    // File operation fallbacks
    this.fallbackImplementations.set('file', {
      read: this.fileReadFallback.bind(this)
    });
  }

  /**
   * Execute fallback strategy
   */
  async executeFallback(service, operation, context, errorInfo) {
    logger.info(`Executing fallback for ${service}.${operation}`);

    try {
      const serviceFallbacks = this.fallbackImplementations.get(service);
      if (!serviceFallbacks || !serviceFallbacks[operation]) {
        return this.createGenericFallbackResponse(service, operation, errorInfo);
      }

      const fallbackFunction = serviceFallbacks[operation];
      const result = await fallbackFunction(context, errorInfo);

      logger.success(`Fallback executed successfully for ${service}.${operation}`);
      return {
        success: true,
        data: result,
        source: 'fallback',
        service,
        operation,
        errorInfo
      };
    } catch (fallbackError) {
      logger.error(`Fallback failed for ${service}.${operation}: ${fallbackError.message}`);
      return this.createFallbackErrorResponse(service, operation, fallbackError, errorInfo);
    }
  }

  /**
   * Claude Code Analysis Fallback
   */
  async claudeCodeAnalyzeFallback(context, errorInfo) {
    const { filePath, prompt } = context;
    
    // Try to get cached analysis
    const cacheKey = `analysis_${filePath}_${this.hashString(prompt)}`;
    const cachedResult = this.cache.get(cacheKey);
    
    if (cachedResult) {
      logger.info('Using cached analysis as fallback');
      return {
        type: 'cached_analysis',
        content: cachedResult,
        timestamp: new Date().toISOString()
      };
    }

    // Try local analysis
    try {
      const localAnalysis = await this.performLocalAnalysis(filePath, prompt);
      this.cache.set(cacheKey, localAnalysis);
      
      return {
        type: 'local_analysis',
        content: localAnalysis,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      // Return basic file information as fallback
      return {
        type: 'basic_info',
        content: await this.getBasicFileInfo(filePath),
        timestamp: new Date().toISOString(),
        note: 'Claude Code unavailable, showing basic file information'
      };
    }
  }

  /**
   * Claude Code Generation Fallback
   */
  async claudeCodeGenerateFallback(context, errorInfo) {
    const { prompt, template } = context;
    
    // Try template-based generation
    if (template) {
      try {
        const generatedCode = await this.generateFromTemplate(template, context);
        return {
          type: 'template_generated',
          content: generatedCode,
          template: template,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        logger.warn('Template generation failed:', error.message);
      }
    }

    // Return placeholder code
    return {
      type: 'placeholder',
      content: this.generatePlaceholderCode(prompt),
      timestamp: new Date().toISOString(),
      note: 'Generated placeholder code due to Claude Code unavailability'
    };
  }

  /**
   * Claude Code Enhancement Fallback
   */
  async claudeCodeEnhanceFallback(context, errorInfo) {
    const { filePath, enhancementType } = context;
    
    // Try to get previous enhancement
    const cacheKey = `enhancement_${filePath}_${enhancementType}`;
    const cachedEnhancement = this.cache.get(cacheKey);
    
    if (cachedEnhancement) {
      return {
        type: 'cached_enhancement',
        content: cachedEnhancement,
        timestamp: new Date().toISOString()
      };
    }

    // Return original file with basic improvements
    try {
      const originalContent = fs.readFileSync(filePath, 'utf8');
      const basicEnhancement = this.applyBasicEnhancements(originalContent, enhancementType);
      
      this.cache.set(cacheKey, basicEnhancement);
      
      return {
        type: 'basic_enhancement',
        content: basicEnhancement,
        timestamp: new Date().toISOString(),
        note: 'Applied basic enhancements due to Claude Code unavailability'
      };
    } catch (error) {
      return {
        type: 'error',
        content: `Unable to enhance file: ${error.message}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * API Request Fallback
   */
  async apiRequestFallback(context, errorInfo) {
    const { url, method, data } = context;
    
    // Try cached response
    const cacheKey = `api_${method}_${this.hashString(url)}`;
    const cachedResponse = this.cache.get(cacheKey);
    
    if (cachedResponse) {
      return {
        type: 'cached_response',
        data: cachedResponse,
        timestamp: new Date().toISOString()
      };
    }

    // Return mock response based on URL pattern
    const mockResponse = this.generateMockResponse(url, method, data);
    
    return {
      type: 'mock_response',
      data: mockResponse,
      timestamp: new Date().toISOString(),
      note: 'Using mock response due to API unavailability'
    };
  }

  /**
   * File Read Fallback
   */
  async fileReadFallback(context, errorInfo) {
    const { filePath } = context;
    
    // Try alternative file path
    const alternativePaths = this.getAlternativePaths(filePath);
    
    for (const altPath of alternativePaths) {
      try {
        if (fs.existsSync(altPath)) {
          const content = fs.readFileSync(altPath, 'utf8');
          return {
            type: 'alternative_file',
            content: content,
            path: altPath,
            timestamp: new Date().toISOString()
          };
        }
      } catch (error) {
        logger.warn(`Alternative path ${altPath} failed: ${error.message}`);
      }
    }

    // Return file metadata
    return {
      type: 'file_metadata',
      content: await this.getFileMetadata(filePath),
      timestamp: new Date().toISOString(),
      note: 'File unavailable, showing metadata only'
    };
  }

  /**
   * Perform local analysis
   */
  async performLocalAnalysis(filePath, prompt) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileExtension = path.extname(filePath).toLowerCase();
      
      let analysis = `# Local Analysis of ${path.basename(filePath)}\n\n`;
      analysis += `**File Type:** ${fileExtension}\n`;
      analysis += `**Size:** ${content.length} characters\n`;
      analysis += `**Lines:** ${content.split('\n').length}\n\n`;
      
      // Basic code analysis
      if (['.js', '.ts', '.jsx', '.tsx'].includes(fileExtension)) {
        analysis += this.analyzeJavaScriptCode(content);
      } else if (['.py'].includes(fileExtension)) {
        analysis += this.analyzePythonCode(content);
      } else if (['.html', '.htm'].includes(fileExtension)) {
        analysis += this.analyzeHTMLCode(content);
      } else {
        analysis += this.analyzeGenericCode(content);
      }
      
      return analysis;
    } catch (error) {
      throw new Error(`Local analysis failed: ${error.message}`);
    }
  }

  /**
   * Analyze JavaScript code
   */
  analyzeJavaScriptCode(content) {
    let analysis = '## JavaScript Analysis\n\n';
    
    // Count functions
    const functionMatches = content.match(/function\s+\w+|const\s+\w+\s*=\s*\(|let\s+\w+\s*=\s*\(|var\s+\w+\s*=\s*\(/g);
    if (functionMatches) {
      analysis += `**Functions Found:** ${functionMatches.length}\n\n`;
    }
    
    // Check for common patterns
    const patterns = {
      'console.log': (content.match(/console\.log/g) || []).length,
      'async/await': (content.match(/async|await/g) || []).length,
      'ES6 imports': (content.match(/import\s+/g) || []).length,
      'ES6 exports': (content.match(/export\s+/g) || []).length
    };
    
    analysis += '**Patterns Found:**\n';
    Object.entries(patterns).forEach(([pattern, count]) => {
      if (count > 0) {
        analysis += `- ${pattern}: ${count} occurrences\n`;
      }
    });
    
    return analysis;
  }

  /**
   * Analyze Python code
   */
  analyzePythonCode(content) {
    let analysis = '## Python Analysis\n\n';
    
    // Count functions and classes
    const functionMatches = content.match(/def\s+\w+/g);
    const classMatches = content.match(/class\s+\w+/g);
    
    if (functionMatches) {
      analysis += `**Functions Found:** ${functionMatches.length}\n`;
    }
    if (classMatches) {
      analysis += `**Classes Found:** ${classMatches.length}\n`;
    }
    
    return analysis;
  }

  /**
   * Analyze HTML code
   */
  analyzeHTMLCode(content) {
    let analysis = '## HTML Analysis\n\n';
    
    // Count tags
    const tagMatches = content.match(/<[^>]+>/g);
    if (tagMatches) {
      analysis += `**HTML Tags Found:** ${tagMatches.length}\n`;
    }
    
    // Check for common elements
    const elements = ['div', 'span', 'p', 'h1', 'h2', 'h3', 'script', 'style'];
    elements.forEach(element => {
      const count = (content.match(new RegExp(`<${element}[^>]*>`, 'gi')) || []).length;
      if (count > 0) {
        analysis += `- ${element}: ${count} occurrences\n`;
      }
    });
    
    return analysis;
  }

  /**
   * Analyze generic code
   */
  analyzeGenericCode(content) {
    let analysis = '## Generic Code Analysis\n\n';
    
    analysis += `**Total Characters:** ${content.length}\n`;
    analysis += `**Total Lines:** ${content.split('\n').length}\n`;
    analysis += `**Non-empty Lines:** ${content.split('\n').filter(line => line.trim()).length}\n`;
    
    return analysis;
  }

  /**
   * Get basic file information
   */
  async getBasicFileInfo(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return {
        name: path.basename(filePath),
        extension: path.extname(filePath),
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        permissions: stats.mode.toString(8)
      };
    } catch (error) {
      return {
        name: path.basename(filePath),
        error: error.message
      };
    }
  }

  /**
   * Generate placeholder code
   */
  generatePlaceholderCode(prompt) {
    const placeholder = `// Placeholder code generated due to Claude Code unavailability
// Original prompt: ${prompt.substring(0, 100)}...

// TODO: Replace with actual implementation when Claude Code is available
function placeholderFunction() {
    console.log('This is a placeholder implementation');
    // Add your actual logic here
}

module.exports = {
    placeholderFunction
};`;
    
    return placeholder;
  }

  /**
   * Generate from template
   */
  async generateFromTemplate(template, context) {
    // Simple template replacement
    let generatedCode = template;
    
    // Replace placeholders
    generatedCode = generatedCode.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return context[key] || match;
    });
    
    return generatedCode;
  }

  /**
   * Apply basic enhancements
   */
  applyBasicEnhancements(content, enhancementType) {
    switch (enhancementType) {
      case 'formatting':
        return this.formatCode(content);
      case 'comments':
        return this.addBasicComments(content);
      case 'error_handling':
        return this.addErrorHandling(content);
      default:
        return content;
    }
  }

  /**
   * Format code
   */
  formatCode(content) {
    // Basic formatting - remove extra whitespace
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
  }

  /**
   * Add basic comments
   */
  addBasicComments(content) {
    const lines = content.split('\n');
    const commentedLines = lines.map((line, index) => {
      if (line.trim().startsWith('function') || line.trim().startsWith('const') || line.trim().startsWith('let')) {
        return `// Line ${index + 1}: ${line}`;
      }
      return line;
    });
    return commentedLines.join('\n');
  }

  /**
   * Add error handling
   */
  addErrorHandling(content) {
    if (content.includes('function')) {
      return content.replace(/function\s+(\w+)/g, (match, funcName) => {
        return `function ${funcName}() {\n  try {\n    // Original function body\n  } catch (error) {\n    console.error('Error in ${funcName}:', error);\n    throw error;\n  }\n}`;
      });
    }
    return content;
  }

  /**
   * Generate mock response
   */
  generateMockResponse(url, method, data) {
    const mockData = {
      success: true,
      data: {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        method: method,
        url: url,
        mock: true
      },
      message: 'Mock response generated due to API unavailability'
    };
    
    return mockData;
  }

  /**
   * Get alternative paths
   */
  getAlternativePaths(filePath) {
    const dir = path.dirname(filePath);
    const base = path.basename(filePath, path.extname(filePath));
    const ext = path.extname(filePath);
    
    return [
      path.join(dir, `${base}_backup${ext}`),
      path.join(dir, `${base}_old${ext}`),
      path.join(dir, `${base}_copy${ext}`),
      path.join(dir, 'backup', path.basename(filePath)),
      path.join(dir, '..', path.basename(filePath))
    ];
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return {
        exists: true,
        name: path.basename(filePath),
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime
      };
    } catch (error) {
      return {
        exists: false,
        name: path.basename(filePath),
        error: error.message
      };
    }
  }

  /**
   * Hash string for cache keys
   */
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  /**
   * Create generic fallback response
   */
  createGenericFallbackResponse(service, operation, errorInfo) {
    return {
      success: false,
      data: null,
      error: {
        message: `No fallback available for ${service}.${operation}`,
        type: 'no_fallback',
        service,
        operation,
        errorInfo
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Create fallback error response
   */
  createFallbackErrorResponse(service, operation, fallbackError, originalErrorInfo) {
    return {
      success: false,
      data: null,
      error: {
        message: `Fallback failed for ${service}.${operation}: ${fallbackError.message}`,
        type: 'fallback_failed',
        service,
        operation,
        fallbackError: fallbackError.message,
        originalErrorInfo
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
    logger.info('Fallback cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Create singleton instance
const fallbackStrategies = new FallbackStrategies();

module.exports = fallbackStrategies; 