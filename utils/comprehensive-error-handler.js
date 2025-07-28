/**
 * Comprehensive Error Handler
 * Advanced error handling and logging for Meta Team
 */

const fs = require('fs');
const path = require('path');
const config = require('../config/error-config');

class ComprehensiveErrorHandler {
  constructor() {
    this.errorLog = [];
    this.errorCounts = new Map();
    this.recoveryStrategies = new Map();
    this.setupRecoveryStrategies();
  }

  async handleError(error, context, options = {}) {
    const errorInfo = {
      timestamp: new Date(),
      error: error.message,
      stack: error.stack,
      context: context,
      type: this.categorizeError(error),
      severity: this.assessSeverity(error),
      ...options
    };

    // Log the error
    this.logError(errorInfo);
    
    // Track error metrics
    this.trackErrorMetrics(errorInfo);
    
    // Attempt recovery
    const recoveryResult = await this.attemptRecovery(errorInfo);
    
    // Report if necessary
    if (this.shouldReport(errorInfo)) {
      await this.reportError(errorInfo);
    }

    return {
      handled: true,
      recoveryAttempted: recoveryResult.attempted,
      recoverySuccessful: recoveryResult.successful,
      errorInfo: errorInfo
    };
  }

  categorizeError(error) {
    if (error.message.includes('authentication') || error.message.includes('auth')) {
      return 'AUTHENTICATION_ERROR';
    } else if (error.message.includes('network') || error.message.includes('connection')) {
      return 'NETWORK_ERROR';
    } else if (error.message.includes('api') || error.message.includes('request')) {
      return 'API_ERROR';
    } else if (error.message.includes('validation') || error.message.includes('invalid')) {
      return 'VALIDATION_ERROR';
    } else {
      return 'GENERAL_ERROR';
    }
  }

  assessSeverity(error) {
    if (error.message.includes('critical') || error.message.includes('fatal')) {
      return 'CRITICAL';
    } else if (error.message.includes('authentication') || error.message.includes('auth')) {
      return 'HIGH';
    } else if (error.message.includes('network') || error.message.includes('connection')) {
      return 'MEDIUM';
    } else {
      return 'LOW';
    }
  }

  logError(errorInfo) {
    const logEntry = `[${errorInfo.timestamp.toISOString()}] ${errorInfo.severity} ${errorInfo.type}: ${errorInfo.error} (Context: ${errorInfo.context})\n`;
    
    console.error(logEntry);
    this.errorLog.push(errorInfo);
    
    // Write to log file
    const logFile = path.join('logs', 'errors.log');
    this.ensureLogDirectory();
    fs.appendFileSync(logFile, logEntry);
  }

  trackErrorMetrics(errorInfo) {
    const type = errorInfo.type;
    const current = this.errorCounts.get(type) || 0;
    this.errorCounts.set(type, current + 1);
  }

  async attemptRecovery(errorInfo) {
    const strategy = this.recoveryStrategies.get(errorInfo.type);
    
    if (strategy) {
      try {
        console.log(`🔄 Attempting recovery for ${errorInfo.type}...`);
        const result = await strategy(errorInfo);
        return { attempted: true, successful: result };
      } catch (recoveryError) {
        console.error(`❌ Recovery failed for ${errorInfo.type}:`, recoveryError.message);
        return { attempted: true, successful: false };
      }
    }
    
    return { attempted: false, successful: false };
  }

  setupRecoveryStrategies() {
    this.recoveryStrategies.set('AUTHENTICATION_ERROR', async (errorInfo) => {
      console.log('🔐 Attempting authentication recovery...');
      // Implement authentication recovery logic
      return true;
    });

    this.recoveryStrategies.set('NETWORK_ERROR', async (errorInfo) => {
      console.log('🌐 Attempting network recovery...');
      // Implement network recovery logic
      return true;
    });

    this.recoveryStrategies.set('API_ERROR', async (errorInfo) => {
      console.log('🔗 Attempting API recovery...');
      // Implement API recovery logic
      return true;
    });
  }

  shouldReport(errorInfo) {
    return errorInfo.severity === 'CRITICAL' || 
           errorInfo.severity === 'HIGH' ||
           this.errorCounts.get(errorInfo.type) > 5;
  }

  async reportError(errorInfo) {
    console.log(`🚨 Reporting ${errorInfo.severity} error: ${errorInfo.type}`);
    // Implement error reporting logic
  }

  getErrorMetrics() {
    return {
      totalErrors: this.errorLog.length,
      errorCounts: Object.fromEntries(this.errorCounts),
      recentErrors: this.errorLog.slice(-10)
    };
  }

  ensureLogDirectory() {
    const logDir = 'logs';
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }
}

module.exports = { ComprehensiveErrorHandler };