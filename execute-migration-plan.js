#!/usr/bin/env node

/**
 * 🚀 COMPREHENSIVE MIGRATION EXECUTION SCRIPT
 * 
 * This script executes the complete migration plan:
 * 1. Push AI Team Learnings to ai-team-learnings repository
 * 2. Push AI Team Template to ai-team-template repository  
 * 3. Reorganize Elite Trader repository with AI team capabilities
 */

const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);
const fs = require('fs').promises;
const path = require('path');

class MigrationExecutor {
  constructor() {
    this.migrationResults = {
      aiTeamLearnings: { success: false, files: 0, errors: [] },
      aiTeamTemplate: { success: false, files: 0, errors: [] },
      eliteTrader: { success: false, files: 0, errors: [] }
    };
  }

  async executeMigration() {
    console.log('🚀 EXECUTING COMPREHENSIVE MIGRATION PLAN');
    console.log('═══════════════════════════════════════════════');
    console.log('');

    try {
      // Step 1: AI Team Learnings Migration
      await this.migrateAITeamLearnings();
      
      // Step 2: AI Team Template Migration
      await this.migrateAITeamTemplate();
      
      // Step 3: Elite Trader Reorganization
      await this.reorganizeEliteTrader();
      
      // Step 4: Generate Final Report
      await this.generateFinalReport();
      
    } catch (error) {
      console.error('❌ Migration execution failed:', error.message);
    }
  }

  async migrateAITeamLearnings() {
    console.log('📚 STEP 1: MIGRATING TO AI TEAM LEARNINGS');
    console.log('═══════════════════════════════════════════');
    
    try {
      // Create temporary directory for AI Team Learnings
      await execAsync('mkdir -p temp-ai-team-learnings');
      
      // Run the migration script
      const { stdout, stderr } = await execAsync('./migrate-ai-team-learnings.sh', { cwd: './temp-ai-team-learnings' });
      
      if (stderr) {
        console.log('⚠️  Warnings:', stderr);
      }
      
      // Count migrated files
      const files = await this.countFilesInDirectory('./temp-ai-team-learnings');
      this.migrationResults.aiTeamLearnings.files = files;
      
      // Commit and push to AI Team Learnings repository
      await this.commitAndPushToRepository('temp-ai-team-learnings', 'ai-team-learnings', 'main', 'Add AI Team Learnings and Retrospectives');
      
      this.migrationResults.aiTeamLearnings.success = true;
      console.log(`✅ AI Team Learnings migration completed: ${files} files`);
      
    } catch (error) {
      this.migrationResults.aiTeamLearnings.errors.push(error.message);
      console.error('❌ AI Team Learnings migration failed:', error.message);
    }
    
    console.log('');
  }

  async migrateAITeamTemplate() {
    console.log('🤖 STEP 2: MIGRATING TO AI TEAM TEMPLATE');
    console.log('═══════════════════════════════════════════');
    
    try {
      // Create temporary directory for AI Team Template
      await execAsync('mkdir -p temp-ai-team-template');
      
      // Run the migration script
      const { stdout, stderr } = await execAsync('./migrate-ai-team-template.sh', { cwd: './temp-ai-team-template' });
      
      if (stderr) {
        console.log('⚠️  Warnings:', stderr);
      }
      
      // Count migrated files
      const files = await this.countFilesInDirectory('./temp-ai-team-template');
      this.migrationResults.aiTeamTemplate.files = files;
      
      // Commit and push to AI Team Template repository
      await this.commitAndPushToRepository('temp-ai-team-template', 'ai-team-template', 'main', 'Add AI Team Infrastructure and Templates');
      
      this.migrationResults.aiTeamTemplate.success = true;
      console.log(`✅ AI Team Template migration completed: ${files} files`);
      
    } catch (error) {
      this.migrationResults.aiTeamTemplate.errors.push(error.message);
      console.error('❌ AI Team Template migration failed:', error.message);
    }
    
    console.log('');
  }

  async reorganizeEliteTrader() {
    console.log('🎯 STEP 3: REORGANIZING ELITE TRADER');
    console.log('═══════════════════════════════════════');
    
    try {
      // Run the reorganization script
      const { stdout, stderr } = await execAsync('./reorganize-elite-trader.sh');
      
      if (stderr) {
        console.log('⚠️  Warnings:', stderr);
      }
      
      // Update package.json and README
      await this.updateEliteTraderFiles();
      
      // Count files in new structure
      const tradingFiles = await this.countFilesInDirectory('./src');
      const aiTeamFiles = await this.countFilesInDirectory('./ai-team');
      this.migrationResults.eliteTrader.files = tradingFiles + aiTeamFiles;
      
      // Commit and push to Elite Trader repository
      await this.commitAndPushToRepository('.', 'origin', 'main', 'Reorganize with AI Team capabilities in separate folder');
      
      this.migrationResults.eliteTrader.success = true;
      console.log(`✅ Elite Trader reorganization completed: ${tradingFiles} trading files + ${aiTeamFiles} AI team files`);
      
    } catch (error) {
      this.migrationResults.eliteTrader.errors.push(error.message);
      console.error('❌ Elite Trader reorganization failed:', error.message);
    }
    
    console.log('');
  }

  async updateEliteTraderFiles() {
    try {
      // Update package.json
      if (await this.fileExists('package.json.new')) {
        await execAsync('cp package.json.new package.json');
        console.log('📝 Updated package.json for trading application focus');
      }
      
      // Update README.md
      if (await this.fileExists('README.md.new')) {
        await execAsync('cp README.md.new README.md');
        console.log('📝 Updated README.md with new structure');
      }
      
    } catch (error) {
      console.error('⚠️  Warning: Could not update Elite Trader files:', error.message);
    }
  }

  async commitAndPushToRepository(directory, remote, branch, commitMessage) {
    try {
      // Initialize git if needed
      await execAsync('git init', { cwd: directory });
      
      // Add all files
      await execAsync('git add .', { cwd: directory });
      
      // Commit
      await execAsync(`git commit -m "${commitMessage}"`, { cwd: directory });
      
      // Add remote if not exists
      try {
        await execAsync(`git remote add origin https://github.com/scaleupventures01/${remote}.git`, { cwd: directory });
      } catch (error) {
        // Remote might already exist
      }
      
      // Push to repository
      await execAsync(`git push -u origin ${branch}`, { cwd: directory });
      
      console.log(`✅ Successfully pushed to ${remote} repository`);
      
    } catch (error) {
      throw new Error(`Failed to push to ${remote}: ${error.message}`);
    }
  }

  async countFilesInDirectory(dir) {
    try {
      const { stdout } = await execAsync(`find ${dir} -type f | wc -l`);
      return parseInt(stdout.trim());
    } catch (error) {
      return 0;
    }
  }

  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }

  async generateFinalReport() {
    console.log('📊 MIGRATION EXECUTION REPORT');
    console.log('═══════════════════════════════════════');
    console.log('');
    
    const totalFiles = this.migrationResults.aiTeamLearnings.files + 
                      this.migrationResults.aiTeamTemplate.files + 
                      this.migrationResults.eliteTrader.files;
    
    console.log(`📊 Total Files Migrated: ${totalFiles}`);
    console.log('');
    
    // AI Team Learnings
    console.log('📚 AI TEAM LEARNINGS:');
    console.log(`   Status: ${this.migrationResults.aiTeamLearnings.success ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log(`   Files: ${this.migrationResults.aiTeamLearnings.files}`);
    if (this.migrationResults.aiTeamLearnings.errors.length > 0) {
      console.log(`   Errors: ${this.migrationResults.aiTeamLearnings.errors.join(', ')}`);
    }
    console.log('');
    
    // AI Team Template
    console.log('🤖 AI TEAM TEMPLATE:');
    console.log(`   Status: ${this.migrationResults.aiTeamTemplate.success ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log(`   Files: ${this.migrationResults.aiTeamTemplate.files}`);
    if (this.migrationResults.aiTeamTemplate.errors.length > 0) {
      console.log(`   Errors: ${this.migrationResults.aiTeamTemplate.errors.join(', ')}`);
    }
    console.log('');
    
    // Elite Trader
    console.log('🎯 ELITE TRADER:');
    console.log(`   Status: ${this.migrationResults.eliteTrader.success ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log(`   Files: ${this.migrationResults.eliteTrader.files}`);
    if (this.migrationResults.eliteTrader.errors.length > 0) {
      console.log(`   Errors: ${this.migrationResults.eliteTrader.errors.join(', ')}`);
    }
    console.log('');
    
    // Overall Status
    const allSuccessful = this.migrationResults.aiTeamLearnings.success && 
                         this.migrationResults.aiTeamTemplate.success && 
                         this.migrationResults.eliteTrader.success;
    
    console.log('🎯 OVERALL STATUS:');
    console.log(`   ${allSuccessful ? '✅ ALL MIGRATIONS SUCCESSFUL' : '❌ SOME MIGRATIONS FAILED'}`);
    console.log('');
    
    console.log('🔗 REPOSITORY LINKS:');
    console.log('   AI Team Learnings: https://github.com/scaleupventures01/ai-team-learnings');
    console.log('   AI Team Template: https://github.com/scaleupventures01/ai-team-template');
    console.log('   Elite Trader: https://github.com/scaleupventures01/elite-trader-ai-coach-v1.0');
    console.log('');
    
    // Clean up temporary directories
    try {
      await execAsync('rm -rf temp-ai-team-learnings temp-ai-team-template');
      console.log('🧹 Cleaned up temporary directories');
    } catch (error) {
      console.log('⚠️  Could not clean up temporary directories');
    }
  }
}

// Execute the migration
const executor = new MigrationExecutor();
executor.executeMigration()
  .catch(error => {
    console.error('❌ Migration execution failed:', error.message);
    process.exit(1);
  }); 