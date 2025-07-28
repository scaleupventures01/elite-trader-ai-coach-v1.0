/**
 * Team Activity Tracker
 * Track and display which Meta Team sub-agents are currently working
 */

const fs = require('fs');
const path = require('path');

class TeamActivityTracker {
  constructor() {
    this.currentActivity = null;
    this.activityHistory = [];
    this.teams = new Map();
    this.roles = new Map();
    this.initializeTeams();
  }

  initializeTeams() {
    // Define all Meta Team teams and their roles
    this.teams.set('Authentication', {
      description: 'Handles authentication testing and validation',
      roles: ['AuthTester', 'KeyValidator', 'ConnectionTester']
    });

    this.teams.set('ErrorHandling', {
      description: 'Manages comprehensive error handling and logging',
      roles: ['ErrorHandler', 'RecoveryManager', 'MetricsCollector']
    });

    this.teams.set('Validation', {
      description: 'Implements validation checkpoints and testing',
      roles: ['CheckpointValidator', 'DataValidator', 'IntegrationTester']
    });

    this.teams.set('Testing', {
      description: 'Develops comprehensive testing frameworks',
      roles: ['TestFrameworkDeveloper', 'TestSuiteManager', 'MetricsTracker']
    });

    this.teams.set('API', {
      description: 'Implements direct API integration patterns',
      roles: ['APIIntegrator', 'RateLimitManager', 'RetryHandler']
    });

    this.teams.set('Documentation', {
      description: 'Creates documentation standards and knowledge management',
      roles: ['TemplateCreator', 'KnowledgeManager', 'StandardsEnforcer']
    });

    this.teams.set('Architecture', {
      description: 'Analyzes and improves system architecture',
      roles: ['SystemArchitect', 'ComponentDesigner', 'IntegrationPlanner']
    });

    this.teams.set('Integration', {
      description: 'Plans and implements integration improvements',
      roles: ['IntegrationPlanner', 'APICoordinator', 'TeamCoordinator']
    });

    this.teams.set('ProjectManagement', {
      description: 'Manages project timelines and coordination',
      roles: ['ProjectManager', 'TimelineTracker', 'ResourceCoordinator']
    });

    this.teams.set('TechnicalAnalysis', {
      description: 'Analyzes technical aspects and solutions',
      roles: ['TechnicalAnalyst', 'SolutionDesigner', 'PatternIdentifier']
    });

    this.teams.set('ProcessImprovement', {
      description: 'Improves development processes and methodologies',
      roles: ['ProcessAnalyst', 'MethodologyDesigner', 'ImprovementTracker']
    });

    this.teams.set('KnowledgeManagement', {
      description: 'Captures and manages knowledge and learnings',
      roles: ['KnowledgeCapturer', 'LearningOrganizer', 'BestPracticeCurator']
    });
  }

  startActivity(teamName, roleName, task, phase = null) {
    const team = this.teams.get(teamName);
    if (!team) {
      throw new Error(`Unknown team: ${teamName}`);
    }

    if (!team.roles.includes(roleName)) {
      throw new Error(`Unknown role ${roleName} for team ${teamName}`);
    }

    this.currentActivity = {
      team: teamName,
      role: roleName,
      task: task,
      phase: phase,
      startTime: new Date(),
      status: 'ACTIVE'
    };

    this.displayCurrentActivity();
    this.logActivity('STARTED');
  }

  updateActivity(task, phase = null) {
    if (!this.currentActivity) {
      throw new Error('No current activity to update');
    }

    this.currentActivity.task = task;
    this.currentActivity.phase = phase;
    this.currentActivity.lastUpdate = new Date();

    this.displayCurrentActivity();
    this.logActivity('UPDATED');
  }

  completeActivity(result = null) {
    if (!this.currentActivity) {
      throw new Error('No current activity to complete');
    }

    this.currentActivity.endTime = new Date();
    this.currentActivity.status = 'COMPLETED';
    this.currentActivity.result = result;
    this.currentActivity.duration = this.currentActivity.endTime - this.currentActivity.startTime;

    this.activityHistory.push({ ...this.currentActivity });
    this.displayCurrentActivity();
    this.logActivity('COMPLETED');

    const completed = this.currentActivity;
    this.currentActivity = null;

    return completed;
  }

  failActivity(error = null) {
    if (!this.currentActivity) {
      throw new Error('No current activity to fail');
    }

    this.currentActivity.endTime = new Date();
    this.currentActivity.status = 'FAILED';
    this.currentActivity.error = error;
    this.currentActivity.duration = this.currentActivity.endTime - this.currentActivity.startTime;

    this.activityHistory.push({ ...this.currentActivity });
    this.displayCurrentActivity();
    this.logActivity('FAILED');

    const failed = this.currentActivity;
    this.currentActivity = null;

    return failed;
  }

  displayCurrentActivity() {
    if (!this.currentActivity) {
      console.log('\n🤖 Meta Team Status: IDLE');
      return;
    }

    const { team, role, task, phase, startTime, status } = this.currentActivity;
    const duration = new Date() - startTime;
    const durationStr = this.formatDuration(duration);

    console.log('\n' + '='.repeat(80));
    console.log('🤖 META TEAM ACTIVITY TRACKER');
    console.log('='.repeat(80));
    console.log(`🏢 Team: ${team}`);
    console.log(`👤 Role: ${role}`);
    console.log(`📋 Task: ${task}`);
    if (phase) {
      console.log(`📊 Phase: ${phase}`);
    }
    console.log(`⏱️  Duration: ${durationStr}`);
    console.log(`📈 Status: ${status}`);
    console.log('='.repeat(80));
  }

  displayTeamStatus() {
    console.log('\n' + '='.repeat(80));
    console.log('🤖 META TEAM STATUS OVERVIEW');
    console.log('='.repeat(80));

    if (this.currentActivity) {
      console.log('🟢 CURRENTLY ACTIVE:');
      const { team, role, task, startTime } = this.currentActivity;
      const duration = new Date() - startTime;
      console.log(`   ${team} → ${role}: ${task} (${this.formatDuration(duration)})`);
    } else {
      console.log('⚪ CURRENTLY IDLE');
    }

    console.log('\n📊 RECENT ACTIVITY:');
    const recent = this.activityHistory.slice(-5).reverse();
    recent.forEach((activity, index) => {
      const statusIcon = activity.status === 'COMPLETED' ? '✅' : 
                        activity.status === 'FAILED' ? '❌' : '🔄';
      console.log(`   ${index + 1}. ${statusIcon} ${activity.team} → ${activity.role}: ${activity.task}`);
    });

    console.log('\n📈 TEAM STATISTICS:');
    const teamStats = this.getTeamStatistics();
    Object.entries(teamStats).forEach(([team, stats]) => {
      console.log(`   ${team}: ${stats.completed} completed, ${stats.failed} failed, ${stats.totalTime} total time`);
    });

    console.log('='.repeat(80));
  }

  getTeamStatistics() {
    const stats = {};
    
    this.activityHistory.forEach(activity => {
      if (!stats[activity.team]) {
        stats[activity.team] = { completed: 0, failed: 0, totalTime: 0 };
      }
      
      if (activity.status === 'COMPLETED') {
        stats[activity.team].completed++;
      } else if (activity.status === 'FAILED') {
        stats[activity.team].failed++;
      }
      
      if (activity.duration) {
        stats[activity.team].totalTime += activity.duration;
      }
    });

    // Format total time
    Object.values(stats).forEach(stat => {
      stat.totalTime = this.formatDuration(stat.totalTime);
    });

    return stats;
  }

  formatDuration(ms) {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}m ${seconds}s`;
  }

  logActivity(action) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      action,
      activity: this.currentActivity ? { ...this.currentActivity } : null
    };

    // Save to log file
    const logDir = 'logs';
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const logFile = path.join(logDir, 'team-activity.log');
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
  }

  getActivityHistory() {
    return this.activityHistory;
  }

  getCurrentActivity() {
    return this.currentActivity;
  }

  clearHistory() {
    this.activityHistory = [];
  }
}

// Create global instance
const teamTracker = new TeamActivityTracker();

module.exports = { TeamActivityTracker, teamTracker }; 