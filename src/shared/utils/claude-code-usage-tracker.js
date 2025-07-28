/**
 * Claude Code Usage Tracker
 * Track how much coding is done with Claude Code vs without it
 */

const fs = require('fs');
const path = require('path');

class ClaudeCodeUsageTracker {
  constructor() {
    this.usageStats = {
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      totalTokensUsed: 0,
      totalTimeSpent: 0,
      claudeCodePercentage: 0,
      fallbackPercentage: 0,
      sessions: []
    };
    
    this.currentSession = null;
    this.loadUsageStats();
  }

  startSession(sessionName, description = '') {
    this.currentSession = {
      name: sessionName,
      description: description,
      startTime: new Date(),
      claudeCodeCalls: 0,
      fallbackCalls: 0,
      totalCalls: 0,
      tokensUsed: 0,
      timeSpent: 0,
      activities: []
    };

    console.log(`\n🔍 CLAUDE CODE USAGE SESSION STARTED:`);
    console.log(`📋 Session: ${sessionName}`);
    console.log(`📝 Description: ${description}`);
    console.log(`⏰ Start Time: ${this.currentSession.startTime.toISOString()}`);
    console.log('─'.repeat(80));
  }

  recordClaudeCodeCall(prompt, response, tokensUsed, duration) {
    if (!this.currentSession) {
      this.startSession('Auto Session', 'Automatically started session');
    }

    const call = {
      type: 'claude-code',
      timestamp: new Date(),
      prompt: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''),
      response: response.substring(0, 100) + (response.length > 100 ? '...' : ''),
      tokensUsed: tokensUsed || 0,
      duration: duration || 0,
      success: true
    };

    this.currentSession.activities.push(call);
    this.currentSession.claudeCodeCalls++;
    this.currentSession.totalCalls++;
    this.currentSession.tokensUsed += tokensUsed || 0;
    this.currentSession.timeSpent += duration || 0;

    // Update global stats
    this.usageStats.totalCalls++;
    this.usageStats.successfulCalls++;
    this.usageStats.totalTokensUsed += tokensUsed || 0;
    this.usageStats.totalTimeSpent += duration || 0;

    this.displayCurrentUsage();
    this.logUsage('CLAUDE_CODE_CALL', call);
  }

  recordFallbackCall(activity, reason) {
    if (!this.currentSession) {
      this.startSession('Auto Session', 'Automatically started session');
    }

    const call = {
      type: 'fallback',
      timestamp: new Date(),
      activity: activity,
      reason: reason,
      success: false
    };

    this.currentSession.activities.push(call);
    this.currentSession.fallbackCalls++;
    this.currentSession.totalCalls++;

    // Update global stats
    this.usageStats.totalCalls++;
    this.usageStats.failedCalls++;

    this.displayCurrentUsage();
    this.logUsage('FALLBACK_CALL', call);
  }

  recordFailedClaudeCodeCall(prompt, error, duration) {
    if (!this.currentSession) {
      this.startSession('Auto Session', 'Automatically started session');
    }

    const call = {
      type: 'claude-code-failed',
      timestamp: new Date(),
      prompt: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''),
      error: error.message || error,
      duration: duration || 0,
      success: false
    };

    this.currentSession.activities.push(call);
    this.currentSession.claudeCodeCalls++;
    this.currentSession.totalCalls++;
    this.currentSession.timeSpent += duration || 0;

    // Update global stats
    this.usageStats.totalCalls++;
    this.usageStats.failedCalls++;
    this.usageStats.totalTimeSpent += duration || 0;

    this.displayCurrentUsage();
    this.logUsage('CLAUDE_CODE_FAILED', call);
  }

  endSession() {
    if (!this.currentSession) {
      console.log('❌ No active session to end');
      return null;
    }

    this.currentSession.endTime = new Date();
    this.currentSession.duration = this.currentSession.endTime - this.currentSession.startTime;
    
    // Calculate percentages
    this.currentSession.claudeCodePercentage = this.currentSession.totalCalls > 0 ? 
      (this.currentSession.claudeCodeCalls / this.currentSession.totalCalls * 100).toFixed(2) : 0;
    this.currentSession.fallbackPercentage = this.currentSession.totalCalls > 0 ? 
      (this.currentSession.fallbackCalls / this.currentSession.totalCalls * 100).toFixed(2) : 0;

    // Add to global sessions
    this.usageStats.sessions.push({ ...this.currentSession });

    // Update global percentages
    this.updateGlobalPercentages();

    this.displaySessionSummary();
    this.saveUsageStats();

    const session = { ...this.currentSession };
    this.currentSession = null;

    return session;
  }

  displayCurrentUsage() {
    if (!this.currentSession) return;

    const { claudeCodeCalls, fallbackCalls, totalCalls, tokensUsed, timeSpent } = this.currentSession;
    const claudePercentage = totalCalls > 0 ? (claudeCodeCalls / totalCalls * 100).toFixed(1) : 0;
    const fallbackPercentage = totalCalls > 0 ? (fallbackCalls / totalCalls * 100).toFixed(1) : 0;

    console.log(`\n📊 CLAUDE CODE USAGE - Current Session:`);
    console.log(`🔗 Claude Code Calls: ${claudeCodeCalls} (${claudePercentage}%)`);
    console.log(`🔄 Fallback Calls: ${fallbackCalls} (${fallbackPercentage}%)`);
    console.log(`📈 Total Calls: ${totalCalls}`);
    console.log(`🎯 Tokens Used: ${tokensUsed}`);
    console.log(`⏱️  Time Spent: ${this.formatDuration(timeSpent)}`);
  }

  displaySessionSummary() {
    if (!this.currentSession) return;

    const { name, claudeCodeCalls, fallbackCalls, totalCalls, claudeCodePercentage, fallbackPercentage, duration, tokensUsed, timeSpent } = this.currentSession;

    console.log('\n' + '='.repeat(80));
    console.log('📊 CLAUDE CODE USAGE SESSION SUMMARY');
    console.log('='.repeat(80));
    console.log(`📋 Session: ${name}`);
    console.log(`⏱️  Duration: ${this.formatDuration(duration)}`);
    console.log(`🔗 Claude Code Calls: ${claudeCodeCalls} (${claudeCodePercentage}%)`);
    console.log(`🔄 Fallback Calls: ${fallbackCalls} (${fallbackPercentage}%)`);
    console.log(`📈 Total Calls: ${totalCalls}`);
    console.log(`🎯 Tokens Used: ${tokensUsed}`);
    console.log(`⏱️  Time Spent: ${this.formatDuration(timeSpent)}`);
    console.log('='.repeat(80));
  }

  displayGlobalStats() {
    const { totalCalls, successfulCalls, failedCalls, totalTokensUsed, totalTimeSpent, claudeCodePercentage, fallbackPercentage } = this.usageStats;

    console.log('\n' + '='.repeat(80));
    console.log('📊 CLAUDE CODE USAGE - GLOBAL STATISTICS');
    console.log('='.repeat(80));
    console.log(`🔗 Total Claude Code Calls: ${successfulCalls}`);
    console.log(`🔄 Total Fallback Calls: ${failedCalls}`);
    console.log(`📈 Total Calls: ${totalCalls}`);
    console.log(`🎯 Total Tokens Used: ${totalTokensUsed}`);
    console.log(`⏱️  Total Time Spent: ${this.formatDuration(totalTimeSpent)}`);
    console.log(`📊 Claude Code Usage: ${claudeCodePercentage}%`);
    console.log(`📊 Fallback Usage: ${fallbackPercentage}%`);
    console.log(`📋 Total Sessions: ${this.usageStats.sessions.length}`);
    console.log('='.repeat(80));
  }

  getRetrospectiveData() {
    const { sessions, totalCalls, successfulCalls, failedCalls, claudeCodePercentage, fallbackPercentage } = this.usageStats;
    
    const recentSessions = sessions.slice(-10); // Last 10 sessions
    const totalSessions = sessions.length;
    
    let totalClaudeCodeCalls = 0;
    let totalFallbackCalls = 0;
    let totalTokensUsed = 0;
    let totalTimeSpent = 0;

    sessions.forEach(session => {
      totalClaudeCodeCalls += session.claudeCodeCalls;
      totalFallbackCalls += session.fallbackCalls;
      totalTokensUsed += session.tokensUsed;
      totalTimeSpent += session.timeSpent;
    });

    return {
      overall: {
        totalCalls,
        successfulCalls,
        failedCalls,
        claudeCodePercentage,
        fallbackPercentage,
        totalTokensUsed,
        totalTimeSpent: this.formatDuration(totalTimeSpent)
      },
      sessions: {
        total: totalSessions,
        recent: recentSessions,
        averageClaudeCodeUsage: totalSessions > 0 ? (totalClaudeCodeCalls / totalSessions).toFixed(1) : 0,
        averageFallbackUsage: totalSessions > 0 ? (totalFallbackCalls / totalSessions).toFixed(1) : 0
      },
      trends: this.analyzeTrends()
    };
  }

  analyzeTrends() {
    const { sessions } = this.usageStats;
    if (sessions.length < 2) return { trend: 'insufficient_data' };

    const recentSessions = sessions.slice(-5);
    const olderSessions = sessions.slice(-10, -5);

    const recentAvg = recentSessions.reduce((sum, s) => sum + parseFloat(s.claudeCodePercentage), 0) / recentSessions.length;
    const olderAvg = olderSessions.reduce((sum, s) => sum + parseFloat(s.claudeCodePercentage), 0) / olderSessions.length;

    const trend = recentAvg > olderAvg ? 'improving' : recentAvg < olderAvg ? 'declining' : 'stable';
    const change = Math.abs(recentAvg - olderAvg).toFixed(1);

    return {
      trend,
      change: `${change}%`,
      recentAverage: recentAvg.toFixed(1),
      olderAverage: olderAvg.toFixed(1)
    };
  }

  updateGlobalPercentages() {
    const { totalCalls, successfulCalls, failedCalls } = this.usageStats;
    
    this.usageStats.claudeCodePercentage = totalCalls > 0 ? 
      (successfulCalls / totalCalls * 100).toFixed(2) : 0;
    this.usageStats.fallbackPercentage = totalCalls > 0 ? 
      (failedCalls / totalCalls * 100).toFixed(2) : 0;
  }

  formatDuration(ms) {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}m ${seconds}s`;
  }

  logUsage(action, data) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      action,
      session: this.currentSession ? this.currentSession.name : 'no-session',
      data
    };

    // Save to log file
    const logDir = 'logs';
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const logFile = path.join(logDir, 'claude-code-usage.log');
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
  }

  saveUsageStats() {
    const statsDir = 'stats';
    if (!fs.existsSync(statsDir)) {
      fs.mkdirSync(statsDir, { recursive: true });
    }

    const statsFile = path.join(statsDir, 'claude-code-usage-stats.json');
    fs.writeFileSync(statsFile, JSON.stringify(this.usageStats, null, 2));
  }

  loadUsageStats() {
    const statsFile = path.join('stats', 'claude-code-usage-stats.json');
    if (fs.existsSync(statsFile)) {
      try {
        const data = fs.readFileSync(statsFile, 'utf8');
        this.usageStats = { ...this.usageStats, ...JSON.parse(data) };
      } catch (error) {
        console.log('⚠️  Could not load usage stats:', error.message);
      }
    }
  }

  resetStats() {
    this.usageStats = {
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      totalTokensUsed: 0,
      totalTimeSpent: 0,
      claudeCodePercentage: 0,
      fallbackPercentage: 0,
      sessions: []
    };
    this.saveUsageStats();
    console.log('🔄 Claude Code usage stats reset');
  }
}

// Create global instance
const claudeCodeTracker = new ClaudeCodeUsageTracker();

module.exports = { ClaudeCodeUsageTracker, claudeCodeTracker }; 