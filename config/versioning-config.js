/**
 * 📁 File Versioning Configuration Management
 * Centralized configuration for file versioning and backup strategies
 * 
 * @author Meta Team - Infrastructure Team
 * @version 1.0.0
 * @date 2025-07-27
 */

const path = require('path');
const fs = require('fs');

class VersioningConfig {
  constructor() {
    this.config = {
      naming: {
        versionSeparator: '_v',
        timestampFormat: 'YYYY-MM-DD_HH-mm-ss',
        backupSuffix: '_backup',
        maxVersions: 10,
        preserveOriginal: true
      },
      backup: {
        enabled: true,
        autoBackup: true,
        backupBeforeModify: true,
        backupDirectory: 'backups',
        compression: true,
        retentionDays: 30,
        maxBackupSize: '100MB'
      },
      git: {
        enabled: true,
        autoCommit: true,
        commitMessageTemplate: 'Meta Team: {action} {filename}',
        branchStrategy: 'feature',
        pushOnComplete: false
      },
      tracking: {
        enabled: true,
        logFile: 'logs/versioning.log',
        trackMetadata: true,
        trackDependencies: true,
        trackTeamChanges: true
      },
      rollback: {
        enabled: true,
        maxRollbackDepth: 5,
        confirmRollback: true,
        preserveRollbackHistory: true
      },
      patterns: {
        include: [
          '*.html',
          '*.js',
          '*.md',
          '*.json',
          '*.py',
          '*.css'
        ],
        exclude: [
          'node_modules/**',
          '*.log',
          '*.tmp',
          'backups/**',
          '.git/**'
        ]
      }
    };

    this.loadEnvironmentConfig();
    this.validateConfig();
  }

  /**
   * Load configuration from environment variables
   */
  loadEnvironmentConfig() {
    // Load from .env file if present
    if (fs.existsSync('.env')) {
      require('dotenv').config();
    }

    // Override with environment variables
    if (process.env.VERSIONING_MAX_VERSIONS) {
      this.config.naming.maxVersions = parseInt(process.env.VERSIONING_MAX_VERSIONS);
    }

    if (process.env.VERSIONING_RETENTION_DAYS) {
      this.config.backup.retentionDays = parseInt(process.env.VERSIONING_RETENTION_DAYS);
    }

    if (process.env.VERSIONING_BACKUP_DIR) {
      this.config.backup.backupDirectory = process.env.VERSIONING_BACKUP_DIR;
    }

    if (process.env.VERSIONING_GIT_ENABLED) {
      this.config.git.enabled = process.env.VERSIONING_GIT_ENABLED === 'true';
    }
  }

  /**
   * Validate configuration
   */
  validateConfig() {
    const errors = [];

    // Validate max versions
    if (this.config.naming.maxVersions < 1) {
      errors.push('Max versions must be at least 1');
    }

    // Validate retention days
    if (this.config.backup.retentionDays < 1) {
      errors.push('Retention days must be at least 1');
    }

    // Validate rollback depth
    if (this.config.rollback.maxRollbackDepth < 1) {
      errors.push('Max rollback depth must be at least 1');
    }

    // Check if backup directory is writable
    if (this.config.backup.enabled) {
      const backupDir = path.resolve(this.config.backup.backupDirectory);
      try {
        if (!fs.existsSync(backupDir)) {
          fs.mkdirSync(backupDir, { recursive: true });
        }
        // Test write access
        const testFile = path.join(backupDir, '.test');
        fs.writeFileSync(testFile, 'test');
        fs.unlinkSync(testFile);
      } catch (error) {
        errors.push(`Backup directory is not writable: ${backupDir}`);
      }
    }

    if (errors.length > 0) {
      throw new Error(`Versioning Configuration validation failed:\n${errors.join('\n')}`);
    }
  }

  /**
   * Get naming configuration
   */
  getNamingConfig() {
    return this.config.naming;
  }

  /**
   * Get backup configuration
   */
  getBackupConfig() {
    return this.config.backup;
  }

  /**
   * Get git configuration
   */
  getGitConfig() {
    return this.config.git;
  }

  /**
   * Get tracking configuration
   */
  getTrackingConfig() {
    return this.config.tracking;
  }

  /**
   * Get rollback configuration
   */
  getRollbackConfig() {
    return this.config.rollback;
  }

  /**
   * Get file patterns
   */
  getPatterns() {
    return this.config.patterns;
  }

  /**
   * Generate version filename
   */
  generateVersionFilename(originalPath, version) {
    const ext = path.extname(originalPath);
    const base = path.basename(originalPath, ext);
    const dir = path.dirname(originalPath);
    
    return path.join(dir, `${base}${this.config.naming.versionSeparator}${version}${ext}`);
  }

  /**
   * Generate backup filename
   */
  generateBackupFilename(originalPath) {
    const timestamp = new Date().toISOString()
      .replace(/[:.]/g, '-')
      .replace('T', '_')
      .split('.')[0];
    
    const ext = path.extname(originalPath);
    const base = path.basename(originalPath, ext);
    const dir = path.dirname(originalPath);
    
    return path.join(dir, `${base}${this.config.naming.backupSuffix}_${timestamp}${ext}`);
  }

  /**
   * Check if file should be versioned
   */
  shouldVersionFile(filePath) {
    const relativePath = path.relative(process.cwd(), filePath);
    
    // Check include patterns
    const included = this.config.patterns.include.some(pattern => {
      return this.matchesPattern(relativePath, pattern);
    });
    
    if (!included) return false;
    
    // Check exclude patterns
    const excluded = this.config.patterns.exclude.some(pattern => {
      return this.matchesPattern(relativePath, pattern);
    });
    
    return !excluded;
  }

  /**
   * Check if path matches pattern
   */
  matchesPattern(filePath, pattern) {
    const minimatch = require('minimatch');
    return minimatch(filePath, pattern);
  }

  /**
   * Update configuration dynamically
   */
  updateConfig(section, key, value) {
    if (this.config[section] && this.config[section][key] !== undefined) {
      this.config[section][key] = value;
      return true;
    }
    return false;
  }

  /**
   * Get full configuration (for debugging)
   */
  getFullConfig() {
    return JSON.parse(JSON.stringify(this.config));
  }

  /**
   * Export configuration for other modules
   */
  export() {
    return {
      naming: this.getNamingConfig(),
      backup: this.getBackupConfig(),
      git: this.getGitConfig(),
      tracking: this.getTrackingConfig(),
      rollback: this.getRollbackConfig(),
      patterns: this.getPatterns()
    };
  }
}

// Create singleton instance
const versioningConfig = new VersioningConfig();

module.exports = versioningConfig; 