#!/usr/bin/env node

/**
 * 📜 Automated Backup Manager
 * Manages file backups and versioning for the Meta Team system
 * 
 * @author Meta Team - Infrastructure Team
 * @version 1.0.0
 * @date 2025-07-27
 */

const fs = require('fs');
const path = require('path');
const fileVersioning = require('../utils/file-versioning');
const versioningConfig = require('../config/versioning-config');
const logger = require('../utils/logger');

class BackupManager {
  constructor() {
    this.config = versioningConfig.export();
    this.backupQueue = [];
    this.isRunning = false;
  }

  /**
   * Initialize backup manager
   */
  async initialize() {
    logger.info('Initializing Backup Manager...');
    
    // Ensure backup directory exists
    const backupDir = path.resolve(this.config.backup.backupDirectory);
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
      logger.info(`Created backup directory: ${backupDir}`);
    }

    // Load existing backup history
    await this.loadBackupHistory();
    
    logger.success('Backup Manager initialized successfully');
  }

  /**
   * Add file to backup queue
   */
  async queueBackup(filePath, metadata = {}) {
    const backupTask = {
      filePath: path.resolve(filePath),
      metadata: {
        team: metadata.team || 'unknown',
        action: metadata.action || 'backup',
        description: metadata.description || '',
        priority: metadata.priority || 'normal',
        timestamp: new Date().toISOString(),
        ...metadata
      }
    };

    this.backupQueue.push(backupTask);
    logger.info(`Queued backup for: ${filePath}`);

    // Process queue if not already running
    if (!this.isRunning) {
      await this.processQueue();
    }
  }

  /**
   * Process backup queue
   */
  async processQueue() {
    if (this.isRunning || this.backupQueue.length === 0) {
      return;
    }

    this.isRunning = true;
    logger.info(`Processing backup queue with ${this.backupQueue.length} items`);

    try {
      // Sort queue by priority
      this.backupQueue.sort((a, b) => {
        const priorities = { high: 3, normal: 2, low: 1 };
        return priorities[b.metadata.priority] - priorities[a.metadata.priority];
      });

      for (const task of this.backupQueue) {
        try {
          await this.createBackup(task.filePath, task.metadata);
          logger.success(`Backup completed for: ${task.filePath}`);
        } catch (error) {
          logger.error(`Backup failed for ${task.filePath}: ${error.message}`);
        }
      }
    } finally {
      this.backupQueue = [];
      this.isRunning = false;
      logger.info('Backup queue processing completed');
    }
  }

  /**
   * Create backup for file
   */
  async createBackup(filePath, metadata = {}) {
    try {
      // Check if file should be versioned
      if (!this.config.patterns.shouldVersionFile(filePath)) {
        logger.debug(`File not eligible for versioning: ${filePath}`);
        return null;
      }

      // Create backup using file versioning utility
      const backupData = await fileVersioning.createBackup(filePath);
      
      if (backupData) {
        // Store metadata
        await this.storeBackupMetadata(backupData, metadata);
        
        // Clean up old backups if needed
        await this.cleanupOldBackups(filePath);
        
        return backupData;
      }
    } catch (error) {
      logger.error(`Failed to create backup for ${filePath}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create version for file
   */
  async createVersion(filePath, version, metadata = {}) {
    try {
      const versionData = await fileVersioning.createVersion(filePath, version, metadata);
      logger.success(`Version created: ${versionData.versionPath}`);
      return versionData;
    } catch (error) {
      logger.error(`Failed to create version for ${filePath}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Rollback file to previous version
   */
  async rollbackFile(filePath, targetVersion = null) {
    try {
      const result = await fileVersioning.rollbackFile(filePath, targetVersion);
      logger.success(`File rolled back: ${filePath} to version ${result.rolledBackTo}`);
      return result;
    } catch (error) {
      logger.error(`Failed to rollback file ${filePath}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get backup history for file
   */
  getBackupHistory(filePath) {
    try {
      return fileVersioning.getVersionHistory(filePath);
    } catch (error) {
      logger.error(`Failed to get backup history for ${filePath}: ${error.message}`);
      return null;
    }
  }

  /**
   * List all backed up files
   */
  listBackedUpFiles() {
    try {
      return fileVersioning.listVersionedFiles();
    } catch (error) {
      logger.error(`Failed to list backed up files: ${error.message}`);
      return [];
    }
  }

  /**
   * Clean up old backups
   */
  async cleanupOldBackups(filePath = null) {
    try {
      if (filePath) {
        // Clean up backups for specific file
        const history = this.getBackupHistory(filePath);
        if (history && history.backups.length > this.config.naming.maxVersions) {
          const oldBackups = history.backups.slice(0, -this.config.naming.maxVersions);
          for (const backup of oldBackups) {
            await this.deleteBackup(backup.backupPath);
          }
        }
      } else {
        // Clean up all old backups
        const result = fileVersioning.cleanupOldFiles();
        logger.info(`Cleanup completed: ${result.cleanedBackups} backups, ${result.cleanedVersions} versions removed`);
        return result;
      }
    } catch (error) {
      logger.error(`Failed to cleanup old backups: ${error.message}`);
    }
  }

  /**
   * Delete specific backup
   */
  async deleteBackup(backupPath) {
    try {
      if (fs.existsSync(backupPath)) {
        fs.unlinkSync(backupPath);
        logger.info(`Deleted backup: ${backupPath}`);
        return true;
      }
      return false;
    } catch (error) {
      logger.error(`Failed to delete backup ${backupPath}: ${error.message}`);
      return false;
    }
  }

  /**
   * Store backup metadata
   */
  async storeBackupMetadata(backupData, metadata) {
    const metadataFile = path.join(
      this.config.backup.backupDirectory,
      'backup-metadata.json'
    );

    try {
      let metadataStore = {};
      if (fs.existsSync(metadataFile)) {
        const content = fs.readFileSync(metadataFile, 'utf8');
        metadataStore = JSON.parse(content);
      }

      const backupId = path.basename(backupData.backupPath);
      metadataStore[backupId] = {
        ...backupData,
        metadata,
        storedAt: new Date().toISOString()
      };

      fs.writeFileSync(metadataFile, JSON.stringify(metadataStore, null, 2));
    } catch (error) {
      logger.error(`Failed to store backup metadata: ${error.message}`);
    }
  }

  /**
   * Load backup history
   */
  async loadBackupHistory() {
    const metadataFile = path.join(
      this.config.backup.backupDirectory,
      'backup-metadata.json'
    );

    try {
      if (fs.existsSync(metadataFile)) {
        const content = fs.readFileSync(metadataFile, 'utf8');
        const metadataStore = JSON.parse(content);
        logger.info(`Loaded ${Object.keys(metadataStore).length} backup metadata entries`);
      }
    } catch (error) {
      logger.warn(`Failed to load backup history: ${error.message}`);
    }
  }

  /**
   * Get backup statistics
   */
  getBackupStats() {
    try {
      const stats = fileVersioning.getStats();
      const queueStats = {
        queueLength: this.backupQueue.length,
        isProcessing: this.isRunning
      };

      return {
        ...stats,
        queue: queueStats,
        config: {
          maxVersions: this.config.naming.maxVersions,
          retentionDays: this.config.backup.retentionDays,
          backupDirectory: this.config.backup.backupDirectory
        }
      };
    } catch (error) {
      logger.error(`Failed to get backup stats: ${error.message}`);
      return null;
    }
  }

  /**
   * Schedule automatic backups
   */
  scheduleAutomaticBackups(interval = 3600000) { // Default: 1 hour
    logger.info(`Scheduling automatic backups every ${interval / 60000} minutes`);
    
    setInterval(async () => {
      try {
        await this.performAutomaticBackup();
      } catch (error) {
        logger.error(`Automatic backup failed: ${error.message}`);
      }
    }, interval);
  }

  /**
   * Perform automatic backup
   */
  async performAutomaticBackup() {
    logger.info('Performing automatic backup...');
    
    try {
      // Get list of files that should be backed up
      const filesToBackup = this.getFilesForAutomaticBackup();
      
      for (const filePath of filesToBackup) {
        await this.queueBackup(filePath, {
          team: 'system',
          action: 'automatic_backup',
          description: 'Scheduled automatic backup',
          priority: 'low'
        });
      }
      
      logger.success(`Automatic backup queued ${filesToBackup.length} files`);
    } catch (error) {
      logger.error(`Automatic backup failed: ${error.message}`);
    }
  }

  /**
   * Get files for automatic backup
   */
  getFilesForAutomaticBackup() {
    const files = [];
    const rootDir = process.cwd();
    
    // Walk through project directory
    this.walkDirectory(rootDir, (filePath) => {
      if (this.config.patterns.shouldVersionFile(filePath)) {
        files.push(filePath);
      }
    });
    
    return files;
  }

  /**
   * Walk directory recursively
   */
  walkDirectory(dir, callback) {
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Skip certain directories
          if (!['node_modules', '.git', 'backups', 'logs'].includes(item)) {
            this.walkDirectory(fullPath, callback);
          }
        } else if (stat.isFile()) {
          callback(fullPath);
        }
      }
    } catch (error) {
      logger.warn(`Failed to walk directory ${dir}: ${error.message}`);
    }
  }

  /**
   * Export backup to external location
   */
  async exportBackup(exportPath, options = {}) {
    try {
      const backupDir = path.resolve(this.config.backup.backupDirectory);
      const exportDir = path.resolve(exportPath);
      
      // Create export directory
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
      }
      
      // Copy backup files
      this.walkDirectory(backupDir, (filePath) => {
        const relativePath = path.relative(backupDir, filePath);
        const exportFilePath = path.join(exportDir, relativePath);
        
        // Create directory structure
        const exportFileDir = path.dirname(exportFilePath);
        if (!fs.existsSync(exportFileDir)) {
          fs.mkdirSync(exportFileDir, { recursive: true });
        }
        
        // Copy file
        fs.copyFileSync(filePath, exportFilePath);
      });
      
      logger.success(`Backup exported to: ${exportDir}`);
      return exportDir;
    } catch (error) {
      logger.error(`Failed to export backup: ${error.message}`);
      throw error;
    }
  }

  /**
   * Import backup from external location
   */
  async importBackup(importPath) {
    try {
      const importDir = path.resolve(importPath);
      const backupDir = path.resolve(this.config.backup.backupDirectory);
      
      if (!fs.existsSync(importDir)) {
        throw new Error(`Import directory does not exist: ${importDir}`);
      }
      
      // Copy import files to backup directory
      this.walkDirectory(importDir, (filePath) => {
        const relativePath = path.relative(importDir, filePath);
        const backupFilePath = path.join(backupDir, relativePath);
        
        // Create directory structure
        const backupFileDir = path.dirname(backupFilePath);
        if (!fs.existsSync(backupFileDir)) {
          fs.mkdirSync(backupFileDir, { recursive: true });
        }
        
        // Copy file
        fs.copyFileSync(filePath, backupFilePath);
      });
      
      logger.success(`Backup imported from: ${importDir}`);
      return true;
    } catch (error) {
      logger.error(`Failed to import backup: ${error.message}`);
      throw error;
    }
  }
}

// CLI interface
if (require.main === module) {
  const backupManager = new BackupManager();
  
  async function main() {
    const command = process.argv[2];
    const args = process.argv.slice(3);
    
    await backupManager.initialize();
    
    switch (command) {
      case 'backup':
        if (args.length === 0) {
          console.log('Usage: node backup-manager.js backup <file-path> [metadata]');
          process.exit(1);
        }
        await backupManager.queueBackup(args[0], JSON.parse(args[1] || '{}'));
        break;
        
      case 'version':
        if (args.length < 2) {
          console.log('Usage: node backup-manager.js version <file-path> <version> [metadata]');
          process.exit(1);
        }
        await backupManager.createVersion(args[0], args[1], JSON.parse(args[2] || '{}'));
        break;
        
      case 'rollback':
        if (args.length === 0) {
          console.log('Usage: node backup-manager.js rollback <file-path> [version]');
          process.exit(1);
        }
        await backupManager.rollbackFile(args[0], args[1]);
        break;
        
      case 'list':
        const files = backupManager.listBackedUpFiles();
        console.table(files);
        break;
        
      case 'stats':
        const stats = backupManager.getBackupStats();
        console.log(JSON.stringify(stats, null, 2));
        break;
        
      case 'cleanup':
        await backupManager.cleanupOldBackups(args[0]);
        break;
        
      case 'export':
        if (args.length === 0) {
          console.log('Usage: node backup-manager.js export <export-path>');
          process.exit(1);
        }
        await backupManager.exportBackup(args[0]);
        break;
        
      case 'import':
        if (args.length === 0) {
          console.log('Usage: node backup-manager.js import <import-path>');
          process.exit(1);
        }
        await backupManager.importBackup(args[0]);
        break;
        
      default:
        console.log(`
Backup Manager CLI

Usage: node backup-manager.js <command> [args]

Commands:
  backup <file-path> [metadata]    - Queue file for backup
  version <file-path> <version> [metadata] - Create version
  rollback <file-path> [version]   - Rollback file to version
  list                             - List all backed up files
  stats                            - Show backup statistics
  cleanup [file-path]              - Clean up old backups
  export <export-path>             - Export backup to location
  import <import-path>             - Import backup from location
        `);
    }
  }
  
  main().catch(console.error);
}

module.exports = BackupManager; 