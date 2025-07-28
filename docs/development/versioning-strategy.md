# 📁 **File Versioning Strategy**

## **🎯 Overview**

This document outlines the comprehensive file versioning strategy implemented by the Meta Team system. The strategy ensures reliable file management, backup capabilities, and rollback functionality for all project files.

---

## **📋 Table of Contents**

1. [Strategy Overview](#strategy-overview)
2. [Naming Conventions](#naming-conventions)
3. [Backup Strategy](#backup-strategy)
4. [Version Management](#version-management)
5. [Rollback Procedures](#rollback-procedures)
6. [Configuration](#configuration)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## **🎯 Strategy Overview**

### **Goals**
- **Reliability**: Ensure no data loss during file modifications
- **Traceability**: Track all file changes with metadata
- **Recovery**: Enable quick rollback to previous versions
- **Efficiency**: Minimize storage overhead while maintaining history
- **Automation**: Reduce manual intervention in file management

### **Key Principles**
1. **Automatic Backup**: Create backups before any file modification
2. **Version Control**: Maintain multiple versions of important files
3. **Metadata Tracking**: Store comprehensive information about each change
4. **Cleanup Policies**: Automatically remove old backups and versions
5. **Git Integration**: Work seamlessly with existing Git workflows

---

## **📝 Naming Conventions**

### **Backup Files**
```
Original: index.html
Backup:   index_backup_2025-07-27_17-30-45.html
```

**Format**: `{basename}_{backupSuffix}_{timestamp}.{extension}`

### **Version Files**
```
Original: server.js
Version:  server_v1.2.3.js
```

**Format**: `{basename}{versionSeparator}{version}.{extension}`

### **Examples**
```
# Backup examples
config.json → config_backup_2025-07-27_17-30-45.json
package.json → package_backup_2025-07-27_17-30-45.json
index.html → index_backup_2025-07-27_17-30-45.html

# Version examples
server.js → server_v1.0.0.js
utils.js → utils_v2.1.0.js
config.js → config_v1.5.2.js
```

---

## **💾 Backup Strategy**

### **When Backups Are Created**
1. **Before File Modification**: Automatic backup before any change
2. **Before Version Creation**: Backup before creating new version
3. **Before Rollback**: Backup current state before rollback
4. **Manual Backup**: On-demand backup requests
5. **Scheduled Backup**: Regular automated backups

### **Backup Storage**
```
backups/
├── index_backup_2025-07-27_17-30-45.html
├── server_backup_2025-07-27_17-30-45.js
├── config_backup_2025-07-27_17-30-45.json
└── backup-metadata.json
```

### **Backup Metadata**
```json
{
  "index_backup_2025-07-27_17-30-45.html": {
    "originalPath": "/path/to/index.html",
    "backupPath": "/path/to/backups/index_backup_2025-07-27_17-30-45.html",
    "timestamp": "2025-07-27T17:30:45.123Z",
    "size": 2048,
    "hash": "sha256:abc123...",
    "metadata": {
      "team": "frontend",
      "action": "enhancement",
      "description": "Added file preview functionality"
    }
  }
}
```

---

## **🔄 Version Management**

### **Version Types**
1. **Major Versions**: Significant changes (v1.0.0, v2.0.0)
2. **Minor Versions**: Feature additions (v1.1.0, v1.2.0)
3. **Patch Versions**: Bug fixes (v1.1.1, v1.1.2)
4. **Development Versions**: Work in progress (v1.1.0-dev)

### **Version Creation Triggers**
- **Manual Version**: Explicit version creation
- **Milestone Version**: Automatic version on project milestones
- **Release Version**: Version created for releases
- **Rollback Version**: Version created during rollback operations

### **Version Storage**
```
project/
├── index.html
├── index_v1.0.0.html
├── index_v1.1.0.html
├── server.js
├── server_v1.0.0.js
└── server_v1.1.0.js
```

### **Version Metadata**
```json
{
  "version": "1.1.0",
  "originalPath": "/path/to/index.html",
  "versionPath": "/path/to/index_v1.1.0.html",
  "timestamp": "2025-07-27T17:30:45.123Z",
  "size": 2048,
  "hash": "sha256:abc123...",
  "metadata": {
    "team": "frontend",
    "action": "version",
    "description": "Added responsive design features",
    "changes": [
      "Added mobile navigation",
      "Improved accessibility",
      "Fixed layout issues"
    ]
  }
}
```

---

## **⏪ Rollback Procedures**

### **Rollback Types**
1. **Version Rollback**: Rollback to specific version
2. **Backup Rollback**: Rollback to backup state
3. **Partial Rollback**: Rollback specific changes only
4. **Emergency Rollback**: Quick rollback in case of critical issues

### **Rollback Process**
```javascript
// Example rollback process
async function rollbackFile(filePath, targetVersion) {
  // 1. Create backup of current state
  await createBackup(filePath);
  
  // 2. Find target version
  const versionData = findVersion(filePath, targetVersion);
  
  // 3. Copy version to original location
  fs.copyFileSync(versionData.versionPath, filePath);
  
  // 4. Update metadata
  updateRollbackMetadata(filePath, targetVersion);
  
  // 5. Log rollback
  logger.info(`Rolled back ${filePath} to version ${targetVersion}`);
}
```

### **Rollback Safety**
- **Automatic Backup**: Always create backup before rollback
- **Validation**: Verify file integrity after rollback
- **Metadata Update**: Update rollback history
- **Notification**: Notify relevant teams of rollback

---

## **⚙️ Configuration**

### **Environment Variables**
```env
# Versioning configuration
VERSIONING_MAX_VERSIONS=10
VERSIONING_RETENTION_DAYS=30
VERSIONING_BACKUP_DIR=backups
VERSIONING_GIT_ENABLED=true
```

### **Configuration File**
```javascript
// config/versioning-config.js
{
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
  patterns: {
    include: ['*.html', '*.js', '*.md', '*.json', '*.py', '*.css'],
    exclude: ['node_modules/**', '*.log', '*.tmp', 'backups/**', '.git/**']
  }
}
```

---

## **📖 Best Practices**

### **1. File Selection**
```javascript
// ✅ Include important files
include: [
  '*.html',    // Web pages
  '*.js',      // JavaScript files
  '*.md',      // Documentation
  '*.json',    // Configuration
  '*.py',      // Python scripts
  '*.css'      // Stylesheets
]

// ❌ Exclude unnecessary files
exclude: [
  'node_modules/**',  // Dependencies
  '*.log',           // Log files
  '*.tmp',           // Temporary files
  'backups/**',      // Backup directory
  '.git/**'          // Git directory
]
```

### **2. Version Naming**
```javascript
// ✅ Semantic versioning
'v1.0.0'  // Major.Minor.Patch
'v1.1.0'  // Feature addition
'v1.1.1'  // Bug fix
'v2.0.0'  // Major change

// ❌ Avoid unclear names
'v1'      // Too vague
'old'     // Not descriptive
'backup'  // Confusing with backups
```

### **3. Metadata Management**
```javascript
// ✅ Comprehensive metadata
{
  team: 'frontend',
  action: 'enhancement',
  description: 'Added responsive navigation',
  changes: ['Mobile menu', 'Touch gestures'],
  priority: 'high',
  reviewer: 'john.doe'
}

// ❌ Minimal metadata
{
  action: 'update'
}
```

### **4. Cleanup Strategy**
```javascript
// ✅ Regular cleanup
const cleanupSchedule = {
  backups: '30 days',
  versions: 'keep last 10',
  tempFiles: '1 day',
  logs: '7 days'
}

// ❌ No cleanup
// Leads to disk space issues
```

---

## **🔧 Usage Examples**

### **1. Create Backup**
```javascript
const fileVersioning = require('../utils/file-versioning');

// Automatic backup before modification
const backup = await fileVersioning.createBackup('index.html', {
  team: 'frontend',
  action: 'enhancement',
  description: 'Adding file preview feature'
});
```

### **2. Create Version**
```javascript
// Create new version
const version = await fileVersioning.createVersion('server.js', '1.2.0', {
  team: 'backend',
  action: 'version',
  description: 'Added API rate limiting',
  changes: ['Rate limiting', 'Error handling', 'Logging']
});
```

### **3. Rollback File**
```javascript
// Rollback to specific version
const result = await fileVersioning.rollbackFile('index.html', '1.1.0');
console.log(`Rolled back to version ${result.rolledBackTo}`);
```

### **4. Get History**
```javascript
// Get version history
const history = fileVersioning.getVersionHistory('server.js');
console.log(`Total versions: ${history.totalVersions}`);
console.log(`Total backups: ${history.totalBackups}`);
```

### **5. List Files**
```javascript
// List all versioned files
const files = fileVersioning.listVersionedFiles();
files.forEach(file => {
  console.log(`${file.path}: ${file.versions} versions`);
});
```

---

## **🛠️ CLI Commands**

### **Backup Manager**
```bash
# Create backup
node scripts/backup-manager.js backup index.html

# Create version
node scripts/backup-manager.js version server.js 1.2.0

# Rollback file
node scripts/backup-manager.js rollback index.html 1.1.0

# List files
node scripts/backup-manager.js list

# Show statistics
node scripts/backup-manager.js stats

# Cleanup old files
node scripts/backup-manager.js cleanup

# Export backup
node scripts/backup-manager.js export /path/to/export

# Import backup
node scripts/backup-manager.js import /path/to/import
```

---

## **🔍 Troubleshooting**

### **Common Issues**

#### **1. "File not found"**
```bash
# Check if file exists
ls -la file.js

# Check file permissions
chmod 644 file.js

# Verify path
pwd && ls -la
```

#### **2. "Permission denied"**
```bash
# Fix file permissions
chmod 644 file.js

# Fix directory permissions
chmod 755 directory/

# Check ownership
ls -la file.js
```

#### **3. "Backup directory not writable"**
```bash
# Create backup directory
mkdir -p backups

# Set permissions
chmod 755 backups

# Check disk space
df -h
```

#### **4. "Version already exists"**
```javascript
// Check existing versions
const history = fileVersioning.getVersionHistory('file.js');
console.log('Existing versions:', history.versions.map(v => v.version));

// Use different version number
await fileVersioning.createVersion('file.js', '1.2.1');
```

### **Debug Commands**
```bash
# Enable debug logging
export LOG_LEVEL=debug

# Check versioning stats
node -e "const fv = require('./utils/file-versioning'); console.log(fv.getStats())"

# Test backup creation
node -e "const fv = require('./utils/file-versioning'); fv.createBackup('test.js')"
```

---

## **📊 Monitoring**

### **Key Metrics**
- **Backup Success Rate**: Percentage of successful backups
- **Version Count**: Number of versions per file
- **Storage Usage**: Disk space used by backups and versions
- **Rollback Frequency**: How often rollbacks occur
- **Cleanup Efficiency**: Effectiveness of cleanup processes

### **Health Checks**
```javascript
// Health check function
async function versioningHealthCheck() {
  const stats = fileVersioning.getStats();
  
  return {
    healthy: stats.totalFiles > 0,
    metrics: {
      totalFiles: stats.totalFiles,
      totalVersions: stats.totalVersions,
      totalBackups: stats.totalBackups,
      storageUsed: stats.totalSize
    },
    issues: []
  };
}
```

---

## **🔗 Integration**

### **Git Integration**
```javascript
// Auto-commit on version creation
if (config.git.enabled && config.git.autoCommit) {
  const commitMessage = config.git.commitMessageTemplate
    .replace('{action}', metadata.action)
    .replace('{filename}', path.basename(filePath));
  
  await gitCommit(commitMessage);
}
```

### **Meta Team Integration**
```javascript
// Team-specific versioning
const teamConfig = {
  frontend: { maxVersions: 15, retentionDays: 45 },
  backend: { maxVersions: 10, retentionDays: 30 },
  infrastructure: { maxVersions: 20, retentionDays: 60 }
};
```

---

**Last Updated**: 2025-07-27  
**Version**: 1.0.0  
**Author**: Meta Team - Infrastructure Team 