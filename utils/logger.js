/**
 * 📝 Simple Logger Utility
 * Provides logging functionality for the Meta Team system
 * 
 * @author Meta Team - Backend Team
 * @version 1.0.0
 * @date 2025-07-27
 */

const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logLevels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
    
    this.currentLevel = this.logLevels.info; // Default to info level
    this.logDir = 'logs';
    this.ensureLogDirectory();
  }

  /**
   * Ensure log directory exists
   */
  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * Set log level
   */
  setLevel(level) {
    if (this.logLevels[level] !== undefined) {
      this.currentLevel = this.logLevels[level];
    }
  }

  /**
   * Format log message
   */
  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      data
    };
    
    return JSON.stringify(logEntry);
  }

  /**
   * Write log to file
   */
  writeToFile(level, message, data = null) {
    const logFile = path.join(this.logDir, `${level}.log`);
    const formattedMessage = this.formatMessage(level, message, data);
    
    try {
      fs.appendFileSync(logFile, formattedMessage + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error.message);
    }
  }

  /**
   * Log error message
   */
  error(message, data = null) {
    if (this.currentLevel >= this.logLevels.error) {
      console.error(`❌ ERROR: ${message}`, data || '');
      this.writeToFile('error', message, data);
    }
  }

  /**
   * Log warning message
   */
  warn(message, data = null) {
    if (this.currentLevel >= this.logLevels.warn) {
      console.warn(`⚠️ WARN: ${message}`, data || '');
      this.writeToFile('warn', message, data);
    }
  }

  /**
   * Log info message
   */
  info(message, data = null) {
    if (this.currentLevel >= this.logLevels.info) {
      console.info(`ℹ️ INFO: ${message}`, data || '');
      this.writeToFile('info', message, data);
    }
  }

  /**
   * Log debug message
   */
  debug(message, data = null) {
    if (this.currentLevel >= this.logLevels.debug) {
      console.debug(`🔍 DEBUG: ${message}`, data || '');
      this.writeToFile('debug', message, data);
    }
  }

  /**
   * Log success message
   */
  success(message, data = null) {
    if (this.currentLevel >= this.logLevels.info) {
      console.log(`✅ SUCCESS: ${message}`, data || '');
      this.writeToFile('info', `SUCCESS: ${message}`, data);
    }
  }
}

// Create singleton instance
const logger = new Logger();

module.exports = logger; 