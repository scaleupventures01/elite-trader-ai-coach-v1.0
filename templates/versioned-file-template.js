/**
 * 📋 Versioned File Template
 * Template for creating versioned files with metadata and tracking
 * 
 * @author Meta Team - Infrastructure Team
 * @version 1.0.0
 * @date 2025-07-27
 */

const fs = require('fs');
const path = require('path');
const fileVersioning = require('../utils/file-versioning');
const logger = require('../utils/logger');

/**
 * Versioned File Class
 * Manages file versions with comprehensive metadata and tracking
 */
class VersionedFile {
  constructor(filePath, options = {}) {
    this.filePath = path.resolve(filePath);
    this.options = {
      autoBackup: options.autoBackup !== false,
      autoVersion: options.autoVersion !== false,
      maxVersions: options.maxVersions || 10,
      retentionDays: options.retentionDays || 30,
      trackMetadata: options.trackMetadata !== false,
      ...options
    };

    this.metadata = {
      created: new Date().toISOString(),
      lastModified: null,
      versions: [],
      backups: [],
      team: options.team || 'unknown',
      description: options.description || '',
      tags: options.tags || []
    };

    this.ensureFileExists();
  }

  /**
   * Ensure file exists and initialize metadata
   */
  ensureFileExists() {
    if (!fs.existsSync(this.filePath)) {
      // Create empty file if it doesn't exist
      fs.writeFileSync(this.filePath, '');
      logger.info(`Created new file: ${this.filePath}`);
    }
    
    this.updateLastModified();
  }

  /**
   * Update last modified timestamp
   */
  updateLastModified() {
    try {
      const stats = fs.statSync(this.filePath);
      this.metadata.lastModified = stats.mtime.toISOString();
    } catch (error) {
      logger.warn(`Failed to update last modified: ${error.message}`);
    }
  }

  /**
   * Read file content
   */
  read() {
    try {
      this.updateLastModified();
      const content = fs.readFileSync(this.filePath, 'utf8');
      return content;
    } catch (error) {
      logger.error(`Failed to read file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Write content to file with automatic backup
   */
  async write(content, options = {}) {
    const writeOptions = {
      createBackup: this.options.autoBackup,
      createVersion: this.options.autoVersion,
      metadata: {
        team: options.team || this.metadata.team,
        action: options.action || 'write',
        description: options.description || 'File write operation',
        ...options.metadata
      },
      ...options
    };

    try {
      // Create backup before writing
      if (writeOptions.createBackup) {
        await this.createBackup(writeOptions.metadata);
      }

      // Write content
      fs.writeFileSync(this.filePath, content);
      this.updateLastModified();

      // Create version after writing
      if (writeOptions.createVersion) {
        await this.createVersion(writeOptions.metadata);
      }

      logger.info(`File written successfully: ${this.filePath}`);
      return true;
    } catch (error) {
      logger.error(`Failed to write file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Append content to file
   */
  async append(content, options = {}) {
    const appendOptions = {
      createBackup: this.options.autoBackup,
      metadata: {
        team: options.team || this.metadata.team,
        action: 'append',
        description: options.description || 'File append operation',
        ...options.metadata
      },
      ...options
    };

    try {
      // Create backup before appending
      if (appendOptions.createBackup) {
        await this.createBackup(appendOptions.metadata);
      }

      // Append content
      fs.appendFileSync(this.filePath, content);
      this.updateLastModified();

      logger.info(`Content appended successfully: ${this.filePath}`);
      return true;
    } catch (error) {
      logger.error(`Failed to append to file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create backup of current file
   */
  async createBackup(metadata = {}) {
    try {
      const backupData = await fileVersioning.createBackup(this.filePath);
      
      if (backupData) {
        this.metadata.backups.push({
          path: backupData.backupPath,
          timestamp: backupData.timestamp,
          size: backupData.size,
          hash: backupData.hash,
          metadata: {
            team: metadata.team || this.metadata.team,
            action: metadata.action || 'backup',
            description: metadata.description || 'Automatic backup',
            ...metadata
          }
        });

        logger.info(`Backup created: ${backupData.backupPath}`);
        return backupData;
      }
    } catch (error) {
      logger.warn(`Backup creation failed: ${error.message}`);
      return null;
    }
  }

  /**
   * Create version of current file
   */
  async createVersion(version, metadata = {}) {
    try {
      const versionData = await fileVersioning.createVersion(this.filePath, version, {
        team: metadata.team || this.metadata.team,
        action: metadata.action || 'version',
        description: metadata.description || 'Version creation',
        ...metadata
      });

      this.metadata.versions.push({
        version: versionData.version,
        path: versionData.versionPath,
        timestamp: versionData.timestamp,
        size: versionData.size,
        hash: versionData.hash,
        metadata: versionData.metadata
      });

      logger.info(`Version created: ${versionData.versionPath}`);
      return versionData;
    } catch (error) {
      logger.error(`Version creation failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Rollback to specific version
   */
  async rollback(targetVersion, options = {}) {
    const rollbackOptions = {
      createBackup: true,
      metadata: {
        team: options.team || this.metadata.team,
        action: 'rollback',
        description: `Rollback to version ${targetVersion}`,
        ...options.metadata
      },
      ...options
    };

    try {
      // Create backup before rollback
      if (rollbackOptions.createBackup) {
        await this.createBackup(rollbackOptions.metadata);
      }

      // Perform rollback
      const result = await fileVersioning.rollbackFile(this.filePath, targetVersion);
      
      if (result.success) {
        this.updateLastModified();
        logger.success(`Rollback successful: ${this.filePath} to version ${targetVersion}`);
        return result;
      } else {
        throw new Error('Rollback failed');
      }
    } catch (error) {
      logger.error(`Rollback failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get version history
   */
  getVersionHistory() {
    try {
      return fileVersioning.getVersionHistory(this.filePath);
    } catch (error) {
      logger.error(`Failed to get version history: ${error.message}`);
      return null;
    }
  }

  /**
   * List available versions
   */
  listVersions() {
    const history = this.getVersionHistory();
    if (history) {
      return history.versions.map(v => ({
        version: v.version,
        timestamp: v.timestamp,
        size: v.size,
        description: v.metadata?.description || ''
      }));
    }
    return [];
  }

  /**
   * Get file statistics
   */
  getStats() {
    try {
      const stats = fs.statSync(this.filePath);
      const history = this.getVersionHistory();
      
      return {
        filePath: this.filePath,
        size: stats.size,
        created: stats.birthtime,
        lastModified: stats.mtime,
        totalVersions: history ? history.totalVersions : 0,
        totalBackups: history ? history.totalBackups : 0,
        metadata: this.metadata
      };
    } catch (error) {
      logger.error(`Failed to get file stats: ${error.message}`);
      return null;
    }
  }

  /**
   * Update metadata
   */
  updateMetadata(newMetadata) {
    this.metadata = { ...this.metadata, ...newMetadata };
    logger.info(`Metadata updated for: ${this.filePath}`);
  }

  /**
   * Add tag to file
   */
  addTag(tag) {
    if (!this.metadata.tags.includes(tag)) {
      this.metadata.tags.push(tag);
      logger.info(`Tag added: ${tag} to ${this.filePath}`);
    }
  }

  /**
   * Remove tag from file
   */
  removeTag(tag) {
    const index = this.metadata.tags.indexOf(tag);
    if (index > -1) {
      this.metadata.tags.splice(index, 1);
      logger.info(`Tag removed: ${tag} from ${this.filePath}`);
    }
  }

  /**
   * Check if file has tag
   */
  hasTag(tag) {
    return this.metadata.tags.includes(tag);
  }

  /**
   * Export file with metadata
   */
  export(exportPath) {
    try {
      const exportData = {
        filePath: this.filePath,
        content: this.read(),
        metadata: this.metadata,
        stats: this.getStats(),
        versionHistory: this.getVersionHistory()
      };

      fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2));
      logger.info(`File exported to: ${exportPath}`);
      return exportData;
    } catch (error) {
      logger.error(`Export failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Import file with metadata
   */
  import(importPath) {
    try {
      const importData = JSON.parse(fs.readFileSync(importPath, 'utf8'));
      
      // Restore content
      fs.writeFileSync(this.filePath, importData.content);
      
      // Restore metadata
      this.metadata = importData.metadata;
      
      this.updateLastModified();
      logger.info(`File imported from: ${importPath}`);
      return importData;
    } catch (error) {
      logger.error(`Import failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Clean up old versions and backups
   */
  async cleanup() {
    try {
      const result = fileVersioning.cleanupOldFiles(this.filePath);
      logger.info(`Cleanup completed for: ${this.filePath}`);
      return result;
    } catch (error) {
      logger.error(`Cleanup failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Watch file for changes
   */
  watch(callback) {
    const watcher = fs.watch(this.filePath, (eventType, filename) => {
      if (eventType === 'change') {
        this.updateLastModified();
        if (callback) {
          callback(eventType, filename, this);
        }
      }
    });

    logger.info(`File watching started: ${this.filePath}`);
    return watcher;
  }

  /**
   * Get file info as string
   */
  toString() {
    const stats = this.getStats();
    if (stats) {
      return `File: ${this.filePath}\nSize: ${stats.size} bytes\nVersions: ${stats.totalVersions}\nBackups: ${stats.totalBackups}`;
    }
    return `File: ${this.filePath} (unavailable)`;
  }
}

/**
 * Factory function to create versioned file instance
 */
function createVersionedFile(filePath, options = {}) {
  return new VersionedFile(filePath, options);
}

/**
 * Quick file operations
 */
async function quickWrite(filePath, content, options = {}) {
  const file = createVersionedFile(filePath, options);
  return await file.write(content, options);
}

async function quickRead(filePath, options = {}) {
  const file = createVersionedFile(filePath, options);
  return file.read();
}

async function quickVersion(filePath, version, options = {}) {
  const file = createVersionedFile(filePath, options);
  return await file.createVersion(version, options);
}

async function quickRollback(filePath, version, options = {}) {
  const file = createVersionedFile(filePath, options);
  return await file.rollback(version, options);
}

// Export functions and classes
module.exports = {
  VersionedFile,
  createVersionedFile,
  quickWrite,
  quickRead,
  quickVersion,
  quickRollback
};

// Example usage:
/*
const { createVersionedFile, quickWrite, quickRead } = require('./templates/versioned-file-template');

// Create versioned file
const file = createVersionedFile('config.json', {
  team: 'backend',
  description: 'Application configuration',
  tags: ['config', 'json']
});

// Write with automatic backup
await file.write('{"debug": true}', {
  action: 'update',
  description: 'Enable debug mode'
});

// Create version
await file.createVersion('1.1.0', {
  description: 'Added new configuration options'
});

// Read content
const content = file.read();

// Get stats
const stats = file.getStats();
console.log(stats);
*/ 