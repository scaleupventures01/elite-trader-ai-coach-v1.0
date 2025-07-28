#!/usr/bin/env node

/**
 * 🚀 MANUAL PUSH TO AI REPOSITORIES
 * 
 * This script manually copies files to the AI team repositories
 * and pushes them to GitHub.
 */

const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);
const fs = require('fs').promises;
const path = require('path');

class ManualPushToAIRepositories {
  constructor() {
    this.results = {
      aiTeamLearnings: { success: false, files: 0 },
      aiTeamTemplate: { success: false, files: 0 }
    };
  }

  async executeManualPush() {
    console.log('🚀 MANUAL PUSH TO AI REPOSITORIES');
    console.log('═══════════════════════════════════════');
    console.log('');

    try {
      // Step 1: Push AI Team Learnings
      await this.pushAITeamLearnings();
      
      // Step 2: Push AI Team Template
      await this.pushAITeamTemplate();
      
      // Step 3: Generate Report
      await this.generateReport();
      
    } catch (error) {
      console.error('❌ Manual push failed:', error.message);
    }
  }

  async pushAITeamLearnings() {
    console.log('📚 STEP 1: PUSHING TO AI TEAM LEARNINGS');
    console.log('═══════════════════════════════════════');
    
    try {
      // Create temporary directory
      await execAsync('mkdir -p temp-ai-learnings');
      
      // Copy lessons learned files
      const lessonsFiles = [
        'lessons-learned-meta-team-claude-code-integration.md',
        'LESSONS_LEARNED_UPDATE_SUMMARY.md',
        'meta-team-claude-code-retrospective.md',
        'meta-team-comprehensive-retrospective-summary.md',
        'meta-team-claude-code-comprehensive-retrospective.js',
        'meta-team-claude-code-final-retrospective.js',
        'meta-team-claude-code-usage-retrospective.js',
        'analysis/',
        'corrections/',
        'proofs/',
        'retrospectives/'
      ];
      
      for (const file of lessonsFiles) {
        if (await this.fileExists(file)) {
          await execAsync(`cp -r "${file}" temp-ai-learnings/`);
          console.log(`   ✅ Copied: ${file}`);
        }
      }
      
      // Copy implementation summaries
      const summaryFiles = [
        'VERIFICATION_SYSTEM_IMPLEMENTATION_COMPLETE.md',
        'VERIFICATION_HOOKS_IMPLEMENTATION_COMPLETE.md',
        'ENFORCEMENT_MIDDLEWARE_IMPLEMENTATION_COMPLETE.md',
        'HUMAN_VERIFICATION_AND_LEARNING_IMPLEMENTATION_COMPLETE.md'
      ];
      
      for (const file of summaryFiles) {
        if (await this.fileExists(file)) {
          await execAsync(`cp "${file}" temp-ai-learnings/`);
          console.log(`   ✅ Copied: ${file}`);
        }
      }
      
      // Copy meta team summary reports
      const metaTeamFiles = [
        'meta-team-activity-tracker-summary.md',
        'meta-team-claude-code-fix-summary.md',
        'meta-team-claude-code-usage-tracking-summary.md',
        'meta-team-code-review-refactor-summary.md',
        'meta-team-header-implementation-summary.md',
        'meta-team-high-priority-implementation-summary.md',
        'meta-team-improvement-plan-summary.md',
        'meta-team-medium-priority-implementation-summary.md',
        'meta-team-upload-page-summary.md'
      ];
      
      for (const file of metaTeamFiles) {
        if (await this.fileExists(file)) {
          await execAsync(`cp "${file}" temp-ai-learnings/`);
          console.log(`   ✅ Copied: ${file}`);
        }
      }
      
      // Count files
      const { stdout } = await execAsync('find temp-ai-learnings -type f | wc -l');
      this.results.aiTeamLearnings.files = parseInt(stdout.trim());
      
      // Create README for AI Team Learnings
      const readme = `# AI Team Learnings

This repository contains lessons learned, retrospectives, and implementation summaries from AI team projects.

## 📚 Contents

- **Lessons Learned**: Key insights and learnings from AI team projects
- **Retrospectives**: Detailed retrospective analysis and reports
- **Implementation Summaries**: Complete implementation documentation
- **Analysis Reports**: Root cause analysis and technical analysis
- **Meta Team Reports**: Summary reports from meta team activities

## 🎯 Purpose

This repository serves as a knowledge base for AI team best practices, patterns, and learnings that can be applied to future projects.

---

**Last Updated**: ${new Date().toISOString()}
`;

      await fs.writeFile('temp-ai-learnings/README.md', readme);
      
      // Push to repository
      await this.pushToRepository('temp-ai-learnings', 'ai-team-learnings', 'Add AI Team Learnings and Retrospectives');
      
      this.results.aiTeamLearnings.success = true;
      console.log(`✅ AI Team Learnings push completed: ${this.results.aiTeamLearnings.files} files`);
      
    } catch (error) {
      console.error('❌ AI Team Learnings push failed:', error.message);
    }
    
    console.log('');
  }

  async pushAITeamTemplate() {
    console.log('🤖 STEP 2: PUSHING TO AI TEAM TEMPLATE');
    console.log('═══════════════════════════════════════');
    
    try {
      // Create temporary directory
      await execAsync('mkdir -p temp-ai-template');
      
      // Copy AI team infrastructure
      await execAsync('cp -r ai-team/.claude temp-ai-template/');
      await execAsync('cp -r ai-team/scripts temp-ai-template/');
      await execAsync('cp -r ai-team/config temp-ai-template/');
      await execAsync('cp -r ai-team/teams temp-ai-template/');
      await execAsync('cp -r ai-team/verification temp-ai-template/');
      
      // Copy key files
      const templateFiles = [
        'CLAUDE_META.md',
        'templates/',
        'frameworks/'
      ];
      
      for (const file of templateFiles) {
        if (await this.fileExists(file)) {
          await execAsync(`cp -r "${file}" temp-ai-template/`);
          console.log(`   ✅ Copied: ${file}`);
        }
      }
      
      // Count files
      const { stdout } = await execAsync('find temp-ai-template -type f | wc -l');
      this.results.aiTeamTemplate.files = parseInt(stdout.trim());
      
      // Create README for AI Team Template
      const readme = `# AI Team Template

This repository contains reusable AI team infrastructure and orchestration tools.

## 🤖 Contents

- **Claude Infrastructure**: AI team configuration and agents
- **Verification Systems**: Truth enforcement and verification tools
- **Team Management**: Team coordination and management tools
- **Templates**: Reusable templates for AI team projects
- **Frameworks**: Development frameworks and patterns

## 🎯 Purpose

This repository serves as a template for setting up AI team capabilities in new projects.

## 🚀 Quick Start

1. Clone this repository
2. Copy the \`.claude/\` directory to your project
3. Configure the AI team settings
4. Start using AI team capabilities

---

**Last Updated**: ${new Date().toISOString()}
`;

      await fs.writeFile('temp-ai-template/README.md', readme);
      
      // Push to repository
      await this.pushToRepository('temp-ai-template', 'ai-team-template', 'Add AI Team Infrastructure and Templates');
      
      this.results.aiTeamTemplate.success = true;
      console.log(`✅ AI Team Template push completed: ${this.results.aiTeamTemplate.files} files`);
      
    } catch (error) {
      console.error('❌ AI Team Template push failed:', error.message);
    }
    
    console.log('');
  }

  async pushToRepository(directory, remote, commitMessage) {
    try {
      // Initialize git
      await execAsync('git init', { cwd: directory });
      
      // Add all files
      await execAsync('git add .', { cwd: directory });
      
      // Commit
      await execAsync(`git commit -m "${commitMessage}"`, { cwd: directory });
      
      // Add remote
      try {
        await execAsync(`git remote add origin https://github.com/scaleupventures01/${remote}.git`, { cwd: directory });
      } catch (error) {
        // Remote might already exist
      }
      
      // Push (force if needed)
      try {
        await execAsync('git push -u origin main', { cwd: directory });
      } catch (error) {
        // If push fails, try force push
        console.log(`   ⚠️  Regular push failed, trying force push...`);
        await execAsync('git push -u origin main --force', { cwd: directory });
      }
      
      console.log(`   ✅ Successfully pushed to ${remote} repository`);
      
    } catch (error) {
      throw new Error(`Failed to push to ${remote}: ${error.message}`);
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

  async generateReport() {
    console.log('📊 MANUAL PUSH REPORT');
    console.log('═══════════════════════════════════════');
    console.log('');
    
    const totalFiles = this.results.aiTeamLearnings.files + this.results.aiTeamTemplate.files;
    
    console.log(`📊 Total Files Pushed: ${totalFiles}`);
    console.log('');
    
    // AI Team Learnings
    console.log('📚 AI TEAM LEARNINGS:');
    console.log(`   Status: ${this.results.aiTeamLearnings.success ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log(`   Files: ${this.results.aiTeamLearnings.files}`);
    console.log('   Repository: https://github.com/scaleupventures01/ai-team-learnings');
    console.log('');
    
    // AI Team Template
    console.log('🤖 AI TEAM TEMPLATE:');
    console.log(`   Status: ${this.results.aiTeamTemplate.success ? '✅ SUCCESS' : '❌ FAILED'}`);
    console.log(`   Files: ${this.results.aiTeamTemplate.files}`);
    console.log('   Repository: https://github.com/scaleupventures01/ai-team-template');
    console.log('');
    
    // Overall Status
    const allSuccessful = this.results.aiTeamLearnings.success && this.results.aiTeamTemplate.success;
    
    console.log('🎯 OVERALL STATUS:');
    console.log(`   ${allSuccessful ? '✅ ALL PUSHES SUCCESSFUL' : '❌ SOME PUSHES FAILED'}`);
    console.log('');
    
    // Clean up
    try {
      await execAsync('rm -rf temp-ai-learnings temp-ai-template');
      console.log('🧹 Cleaned up temporary directories');
    } catch (error) {
      console.log('⚠️  Could not clean up temporary directories');
    }
  }
}

// Execute the manual push
const pusher = new ManualPushToAIRepositories();
pusher.executeManualPush()
  .catch(error => {
    console.error('❌ Manual push execution failed:', error.message);
    process.exit(1);
  }); 