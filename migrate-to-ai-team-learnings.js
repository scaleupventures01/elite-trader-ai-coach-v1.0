#!/usr/bin/env node

/**
 * 🚀 MIGRATION SCRIPT: AI Team Learnings Repository
 * 
 * This script identifies and lists all files that should be moved to
 * the AI Team Learnings repository for lessons learned and retrospectives.
 */

const fs = require('fs').promises;
const path = require('path');

class AITeamLearningsMigration {
  constructor() {
    this.filesToMigrate = [];
    this.migrationReport = {
      totalFiles: 0,
      categories: {
        lessonsLearned: [],
        retrospectives: [],
        implementationSummaries: [],
        analysis: [],
        corrections: [],
        proofs: [],
        metaTeamReports: [],
        knowledgeBase: []
      }
    };
  }

  async scanForFiles() {
    console.log('🔍 Scanning for AI Team Learnings files...');
    
    try {
      const files = await this.getAllFiles('.');
      
      for (const file of files) {
        if (this.shouldMigrateToLearnings(file)) {
          this.filesToMigrate.push(file);
          this.categorizeFile(file);
        }
      }
      
      this.migrationReport.totalFiles = this.filesToMigrate.length;
      
    } catch (error) {
      console.error('❌ Error scanning files:', error.message);
    }
  }

  shouldMigrateToLearnings(filePath) {
    const fileName = path.basename(filePath);
    const dirName = path.dirname(filePath);
    
    // Lessons learned files
    if (fileName.includes('lessons-learned') || 
        fileName.includes('LESSONS_LEARNED')) {
      return true;
    }
    
    // Retrospectives
    if (fileName.includes('retrospective') || 
        fileName.includes('RETROSPECTIVE')) {
      return true;
    }
    
    // Implementation summaries
    if (fileName.includes('IMPLEMENTATION_COMPLETE') ||
        fileName.includes('IMPLEMENTATION_SUMMARY')) {
      return true;
    }
    
    // Analysis directory
    if (dirName === 'analysis') {
      return true;
    }
    
    // Corrections directory
    if (dirName === 'corrections') {
      return true;
    }
    
    // Proofs directory
    if (dirName === 'proofs') {
      return true;
    }
    
    // Meta team summary reports
    if (fileName.includes('meta-team') && 
        (fileName.includes('summary') || fileName.includes('SUMMARY'))) {
      return true;
    }
    
    // Knowledge base directory
    if (dirName === 'knowledge-base') {
      return true;
    }
    
    return false;
  }

  categorizeFile(filePath) {
    const fileName = path.basename(filePath);
    const dirName = path.dirname(filePath);
    
    if (fileName.includes('lessons-learned') || fileName.includes('LESSONS_LEARNED')) {
      this.migrationReport.categories.lessonsLearned.push(filePath);
    } else if (fileName.includes('retrospective') || fileName.includes('RETROSPECTIVE')) {
      this.migrationReport.categories.retrospectives.push(filePath);
    } else if (fileName.includes('IMPLEMENTATION_COMPLETE') || fileName.includes('IMPLEMENTATION_SUMMARY')) {
      this.migrationReport.categories.implementationSummaries.push(filePath);
    } else if (dirName === 'analysis') {
      this.migrationReport.categories.analysis.push(filePath);
    } else if (dirName === 'corrections') {
      this.migrationReport.categories.corrections.push(filePath);
    } else if (dirName === 'proofs') {
      this.migrationReport.categories.proofs.push(filePath);
    } else if (fileName.includes('meta-team') && (fileName.includes('summary') || fileName.includes('SUMMARY'))) {
      this.migrationReport.categories.metaTeamReports.push(filePath);
    } else if (dirName === 'knowledge-base') {
      this.migrationReport.categories.knowledgeBase.push(filePath);
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
    console.log('\n📋 AI TEAM LEARNINGS MIGRATION REPORT');
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
    console.log('1. Clone the ai-team-learnings repository');
    console.log('2. Copy the above files to the repository');
    console.log('3. Commit and push the changes');
    console.log('4. Remove these files from the current repository');
    console.log('');
  }

  async generateMigrationScript() {
    const script = `#!/bin/bash
# AI Team Learnings Migration Script
# Generated on: ${new Date().toISOString()}

echo "🚀 Starting AI Team Learnings Migration..."

# Create directories if they don't exist
mkdir -p lessons-learned
mkdir -p retrospectives
mkdir -p implementation-summaries
mkdir -p analysis
mkdir -p corrections
mkdir -p proofs
mkdir -p meta-team-reports
mkdir -p knowledge-base

# Copy files to appropriate directories
${this.filesToMigrate.map(file => {
  const fileName = path.basename(file);
  const dirName = path.dirname(file);
  
  if (fileName.includes('lessons-learned') || fileName.includes('LESSONS_LEARNED')) {
    return `cp "${file}" lessons-learned/`;
  } else if (fileName.includes('retrospective') || fileName.includes('RETROSPECTIVE')) {
    return `cp "${file}" retrospectives/`;
  } else if (fileName.includes('IMPLEMENTATION_COMPLETE') || fileName.includes('IMPLEMENTATION_SUMMARY')) {
    return `cp "${file}" implementation-summaries/`;
  } else if (dirName === 'analysis') {
    return `cp -r "${file}" analysis/`;
  } else if (dirName === 'corrections') {
    return `cp -r "${file}" corrections/`;
  } else if (dirName === 'proofs') {
    return `cp -r "${file}" proofs/`;
  } else if (fileName.includes('meta-team') && (fileName.includes('summary') || fileName.includes('SUMMARY'))) {
    return `cp "${file}" meta-team-reports/`;
  } else if (dirName === 'knowledge-base') {
    return `cp -r "${file}" knowledge-base/`;
  }
  return '';
}).filter(cmd => cmd).join('\n')}

echo "✅ AI Team Learnings migration completed!"
echo "📊 Total files migrated: ${this.migrationReport.totalFiles}"
`;

    await fs.writeFile('migrate-ai-team-learnings.sh', script);
    console.log('📝 Generated migration script: migrate-ai-team-learnings.sh');
  }
}

// Run the migration analysis
const migration = new AITeamLearningsMigration();
migration.scanForFiles()
  .then(() => {
    migration.displayMigrationReport();
    return migration.generateMigrationScript();
  })
  .catch(error => {
    console.error('❌ Migration analysis failed:', error.message);
  }); 