/**
 * 📁 File Versioning Utility
 * Manages file backups, versioning, and rollback capabilities
 * 
 * @author Meta Team - Infrastructure Team
 * @version 1.0.0
 * @date 2025-07-27
 */

const fs = require('fs');
const path = require('path');
const versioningConfig = require('../config/versioning-config');
const logger = require('./logger');

class FileVersioning {
  constructor() {
    this.config = versioningConfig.export();
    this.versionHistory = new Map();
    this.backupHistory = new Map();
    this.ensureDirectories();
  }

  /**
   * Ensure required directories exist
   */
  ensureDirectories() {
    const dirs = [
      this.config.backup.backupDirectory,
      path.dirname(this.config.tracking.logFile),
      'logs'
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Create backup of file before modification
   */
  async createBackup(filePath) {
    if (!this.config.backup.enabled) {
      return null;
    }

    try {
      const absolutePath = path.resolve(filePath);
      
      if (!fs.existsSync(absolutePath)) {
        logger.warn(`File does not exist for backup: ${filePath}`);
        return null;
      }

      if (!this.config.patterns.shouldVersionFile(absolutePath)) {
        logger.debug(`File not eligible for versioning: ${filePath}`);
        return null;
      }

      const backupPath = this.generateBackupPath(absolutePath);
      const backupData = {
        originalPath: absolutePath,
        backupPath,
        timestamp: new Date().toISOString(),
        size: fs.statSync(absolutePath).size,
        hash: await this.calculateFileHash(absolutePath)
      };

      // Copy file to backup location
      fs.copyFileSync(absolutePath, backupPath);
      
      // Store backup metadata
      this.storeBackupMetadata(backupData);
      
      logger.info(`Backup created: ${backupPath}`, backupData);
      
      return backupData;
    } catch (error) {
      logger.error(`Failed to create backup for ${filePath}: ${error.message}`);
      return null;
    }
  }

  /**
   * Generate backup file path
   */
  generateBackupPath(originalPath) {
    const timestamp = new Date().toISOString()
      .replace(/[:.]/g, '-')
      .replace('T', '_')
      .split('.')[0];
    
    const ext = path.extname(originalPath);
    const base = path.basename(originalPath, ext);
    const dir = path.dirname(originalPath);
    
    return path.join(
      this.config.backup.backupDirectory,
      `${base}${this.config.naming.backupSuffix}_${timestamp}${ext}`
    );
  }

  /**
   * Calculate file hash for integrity checking
   */
  async calculateFileHash(filePath) {
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    
    return new Promise((resolve, reject) => {
      stream.on('data', data => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  }

  /**
   * Store backup metadata
   */
  storeBackupMetadata(backupData) {
    const key = backupData.originalPath;
    if (!this.backupHistory.has(key)) {
      this.backupHistory.set(key, []);
    }
    
    this.backupHistory.get(key).push(backupData);
    
    // Limit number of backups per file
    const backups = this.backupHistory.get(key);
    if (backups.length > this.config.naming.maxVersions) {
      const oldestBackup = backups.shift();
      this.cleanupBackup(oldestBackup);
    }
  }

  /**
   * Clean up old backup file
   */
  cleanupBackup(backupData) {
    try {
      if (fs.existsSync(backupData.backupPath)) {
        fs.unlinkSync(backupData.backupPath);
        logger.info(`Cleaned up old backup: ${backupData.backupPath}`);
      }
    } catch (error) {
      logger.error(`Failed to cleanup backup: ${error.message}`);
    }
  }

  /**
   * Create versioned copy of file
   */
  async createVersion(filePath, version, metadata = {}) {
    try {
      const absolutePath = path.resolve(filePath);
      
      if (!fs.existsSync(absolutePath)) {
        throw new Error(`File does not exist: ${filePath}`);
      }

      const versionPath = this.generateVersionPath(absolutePath, version);
      const versionData = {
        originalPath: absolutePath,
        versionPath,
        version,
        timestamp: new Date().toISOString(),
        size: fs.statSync(absolutePath).size,
        hash: await this.calculateFileHash(absolutePath),
        metadata: {
          team: metadata.team || 'unknown',
          action: metadata.action || 'version',
          description: metadata.description || '',
          ...metadata
        }
      };

      // Copy file to version location
      fs.copyFileSync(absolutePath, versionPath);
      
      // Store version metadata
      this.storeVersionMetadata(versionData);
      
      logger.info(`Version created: ${versionPath}`, versionData);
      
      return versionData;
    } catch (error) {
      logger.error(`Failed to create version for ${filePath}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate versioned file path
   */
  generateVersionPath(originalPath, version) {
    const ext = path.extname(originalPath);
    const base = path.basename(originalPath, ext);
    const dir = path.dirname(originalPath);
    
    return path.join(dir, `${base}${this.config.naming.versionSeparator}${version}${ext}`);
  }

  /**
   * Store version metadata
   */
  storeVersionMetadata(versionData) {
    const key = versionData.originalPath;
    if (!this.versionHistory.has(key)) {
      this.versionHistory.set(key, []);
    }
    
    this.versionHistory.get(key).push(versionData);
    
    // Limit number of versions per file
    const versions = this.versionHistory.get(key);
    if (versions.length > this.config.naming.maxVersions) {
      const oldestVersion = versions.shift();
      this.cleanupVersion(oldestVersion);
    }
  }

  /**
   * Clean up old version file
   */
  cleanupVersion(versionData) {
    try {
      if (fs.existsSync(versionData.versionPath)) {
        fs.unlinkSync(versionData.versionPath);
        logger.info(`Cleaned up old version: ${versionData.versionPath}`);
      }
    } catch (error) {
      logger.error(`Failed to cleanup version: ${error.message}`);
    }
  }

  /**
   * Rollback file to previous version
   */
  async rollbackFile(filePath, targetVersion = null) {
    try {
      const absolutePath = path.resolve(filePath);
      const versions = this.versionHistory.get(absolutePath) || [];
      
      if (versions.length === 0) {
        throw new Error(`No versions found for file: ${filePath}`);
      }

      let targetVersionData;
      
      if (targetVersion) {
        targetVersionData = versions.find(v => v.version === targetVersion);
        if (!targetVersionData) {
          throw new Error(`Version ${targetVersion} not found for file: ${filePath}`);
        }
      } else {
        // Use most recent version
        targetVersionData = versions[versions.length - 1];
      }

      // Create backup of current file
      await this.createBackup(absolutePath);
      
      // Copy version back to original location
      fs.copyFileSync(targetVersionData.versionPath, absolutePath);
      
      logger.success(`File rolled back to version ${targetVersionData.version}: ${filePath}`);
      
      return {
        success: true,
        rolledBackTo: targetVersionData.version,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error(`Failed to rollback file ${filePath}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get version history for file
   */
  getVersionHistory(filePath) {
    const absolutePath = path.resolve(filePath);
    const versions = this.versionHistory.get(absolutePath) || [];
    const backups = this.backupHistory.get(absolutePath) || [];
    
    return {
      file: absolutePath,
      versions: versions.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
      backups: backups.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
      totalVersions: versions.length,
      totalBackups: backups.length
    };
  }

  /**
   * List all versioned files
   */
  listVersionedFiles() {
    const files = [];
    
    for (const [filePath, versions] of this.versionHistory.entries()) {
      files.push({
        path: filePath,
        versions: versions.length,
        lastModified: versions.length > 0 ? versions[versions.length - 1].timestamp : null
      });
    }
    
    return files.sort((a, b) => {
      if (!a.lastModified) return 1;
      if (!b.lastModified) return -1;
      return new Date(b.lastModified) - new Date(a.lastModified);
    });
  }

  /**
   * Clean up old backups and versions
   */
  cleanupOldFiles() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.backup.retentionDays);
    
    let cleanedBackups = 0;
    let cleanedVersions = 0;
    
    // Clean up old backups
    for (const [filePath, backups] of this.backupHistory.entries()) {
      const oldBackups = backups.filter(backup => 
        new Date(backup.timestamp) < cutoffDate
      );
      
      oldBackups.forEach(backup => {
        this.cleanupBackup(backup);
        cleanedBackups++;
      });
      
      // Remove old backups from history
      this.backupHistory.set(filePath, backups.filter(backup => 
        new Date(backup.timestamp) >= cutoffDate
      ));
    }
    
    // Clean up old versions (keep only the most recent ones)
    for (const [filePath, versions] of this.versionHistory.entries()) {
      if (versions.length > this.config.naming.maxVersions) {
        const oldVersions = versions.slice(0, versions.length - this.config.naming.maxVersions);
        oldVersions.forEach(version => {
          this.cleanupVersion(version);
          cleanedVersions++;
        });
        
        // Keep only recent versions
        this.versionHistory.set(filePath, versions.slice(-this.config.naming.maxVersions));
      }
    }
    
    logger.info(`Cleanup completed: ${cleanedBackups} backups, ${cleanedVersions} versions removed`);
    
    return { cleanedBackups, cleanedVersions };
  }

  /**
   * Get versioning statistics
   */
  getStats() {
    let totalVersions = 0;
    let totalBackups = 0;
    let totalSize = 0;
    
    for (const versions of this.versionHistory.values()) {
      totalVersions += versions.length;
      totalSize += versions.reduce((sum, v) => sum + v.size, 0);
    }
    
    for (const backups of this.backupHistory.values()) {
      totalBackups += backups.length;
      totalSize += backups.reduce((sum, b) => sum + b.size, 0);
    }
    
    return {
      totalFiles: this.versionHistory.size,
      totalVersions,
      totalBackups,
      totalSize: this.formatBytes(totalSize),
      config: this.config
    };
  }

  /**
   * Format bytes to human readable format
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Create singleton instance
const fileVersioning = new FileVersioning();

module.exports = fileVersioning; 