#!/usr/bin/env node

/**
 * 🚀 MIGRATION SCRIPT: AI Team Template Repository
 * 
 * This script identifies and lists all files that should be moved to
 * the AI Team Template repository for reusable AI team infrastructure.
 */

const fs = require('fs').promises;
const path = require('path');

class AITeamTemplateMigration {
  constructor() {
    this.filesToMigrate = [];
    this.migrationReport = {
      totalFiles: 0,
      categories: {
        claudeInfrastructure: [],
        verificationSystems: [],
        metaTeamScripts: [],
        antiHallucinationRules: [],
        teamManagement: [],
        configuration: [],
        templates: [],
        frameworks: []
      }
    };
  }

  async scanForFiles() {
    console.log('🔍 Scanning for AI Team Template files...');
    
    try {
      const files = await this.getAllFiles('.');
      
      for (const file of files) {
        if (this.shouldMigrateToTemplate(file)) {
          this.filesToMigrate.push(file);
          this.categorizeFile(file);
        }
      }
      
      this.migrationReport.totalFiles = this.filesToMigrate.length;
      
    } catch (error) {
      console.error('❌ Error scanning files:', error.message);
    }
  }

  shouldMigrateToTemplate(filePath) {
    const fileName = path.basename(filePath);
    const dirName = path.dirname(filePath);
    
    // .claude infrastructure
    if (dirName.startsWith('.claude') || dirName === '.claude') {
      return true;
    }
    
    // Verification systems
    if (dirName.startsWith('scripts/verification') || 
        fileName.includes('verification')) {
      return true;
    }
    
    // Meta team scripts
    if (fileName.startsWith('meta-team-') && fileName.endsWith('.js')) {
      return true;
    }
    
    // Anti-hallucination rules
    if (fileName === 'CLAUDE_META.md') {
      return true;
    }
    
    // Team management
    if (dirName === 'teams') {
      return true;
    }
    
    // Configuration for AI systems
    if (dirName === 'config') {
      return true;
    }
    
    // Templates
    if (dirName === 'templates') {
      return true;
    }
    
    // Frameworks
    if (dirName === 'frameworks') {
      return true;
    }
    
    return false;
  }

  categorizeFile(filePath) {
    const fileName = path.basename(filePath);
    const dirName = path.dirname(filePath);
    
    if (dirName.startsWith('.claude') || dirName === '.claude') {
      this.migrationReport.categories.claudeInfrastructure.push(filePath);
    } else if (dirName.startsWith('scripts/verification') || fileName.includes('verification')) {
      this.migrationReport.categories.verificationSystems.push(filePath);
    } else if (fileName.startsWith('meta-team-') && fileName.endsWith('.js')) {
      this.migrationReport.categories.metaTeamScripts.push(filePath);
    } else if (fileName === 'CLAUDE_META.md') {
      this.migrationReport.categories.antiHallucinationRules.push(filePath);
    } else if (dirName === 'teams') {
      this.migrationReport.categories.teamManagement.push(filePath);
    } else if (dirName === 'config') {
      this.migrationReport.categories.configuration.push(filePath);
    } else if (dirName === 'templates') {
      this.migrationReport.categories.templates.push(filePath);
    } else if (dirName === 'frameworks') {
      this.migrationReport.categories.frameworks.push(filePath);
    }
  }

  async getAllFiles(dir) {
    const files = [];
    
    try {
      const items = await fs.readdir(dir);
      
      for (const item of items) {
        if (item.startsWith('.') && item !== '.claude') continue; // Skip hidden files except .claude
        if (item === 'node_modules') continue;
        if (item === '.git') continue;
        if (item === 'src') continue; // Skip application source code
        
        const fullPath = path.join(dir, item);
        const stat = await fs.stat(fullPath);
        
        if (stat.isDirectory()) {
          const subFiles = await this.getAllFiles(fullPath);
          files.push(...subFiles);
        } else {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
    
    return files;
  }

  displayMigrationReport() {
    console.log('\n📋 AI TEAM TEMPLATE MIGRATION REPORT');
    console.log('═══════════════════════════════════════');
    console.log(`📊 Total Files to Migrate: ${this.migrationReport.totalFiles}`);
    console.log('');
    
    for (const [category, files] of Object.entries(this.migrationReport.categories)) {
      if (files.length > 0) {
        console.log(`📁 ${category.toUpperCase()}: ${files.length} files`);
        files.forEach(file => console.log(`   - ${file}`));
        console.log('');
      }
    }
    
    console.log('🎯 MIGRATION INSTRUCTIONS:');
    console.log('═══════════════════════════════════════');
    console.log('1. Clone the ai-team-template repository');
    console.log('2. Copy the above files to the repository');
    console.log('3. Commit and push the changes');
    console.log('4. Remove these files from the current repository');
    console.log('');
  }

  async generateMigrationScript() {
    const script = `#!/bin/bash
# AI Team Template Migration Script
# Generated on: ${new Date().toISOString()}

echo "🚀 Starting AI Team Template Migration..."

# Create directories if they don't exist
mkdir -p .claude
mkdir -p scripts/verification
mkdir -p teams
mkdir -p config
mkdir -p templates
mkdir -p frameworks

# Copy files to appropriate directories
${this.filesToMigrate.map(file => {
  const fileName = path.basename(file);
  const dirName = path.dirname(file);
  
  if (dirName.startsWith('.claude') || dirName === '.claude') {
    return `cp -r "${file}" .claude/`;
  } else if (dirName.startsWith('scripts/verification') || fileName.includes('verification')) {
    return `cp -r "${file}" scripts/verification/`;
  } else if (fileName.startsWith('meta-team-') && fileName.endsWith('.js')) {
    return `cp "${file}" scripts/`;
  } else if (fileName === 'CLAUDE_META.md') {
    return `cp "${file}" .`;
  } else if (dirName === 'teams') {
    return `cp -r "${file}" teams/`;
  } else if (dirName === 'config') {
    return `cp -r "${file}" config/`;
  } else if (dirName === 'templates') {
    return `cp -r "${file}" templates/`;
  } else if (dirName === 'frameworks') {
    return `cp -r "${file}" frameworks/`;
  }
  return '';
}).filter(cmd => cmd).join('\n')}

echo "✅ AI Team Template migration completed!"
echo "📊 Total files migrated: ${this.migrationReport.totalFiles}"
`;

    await fs.writeFile('migrate-ai-team-template.sh', script);
    console.log('📝 Generated migration script: migrate-ai-team-template.sh');
  }
}

// Run the migration analysis
const migration = new AITeamTemplateMigration();
migration.scanForFiles()
  .then(() => {
    migration.displayMigrationReport();
    return migration.generateMigrationScript();
  })
  .catch(error => {
    console.error('❌ Migration analysis failed:', error.message);
  }); 