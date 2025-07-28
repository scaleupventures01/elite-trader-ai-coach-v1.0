#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

/**
 * 🧠 HONESTY REINFORCEMENT LEARNING SYSTEM
 * 
 * This system implements reinforcement learning to improve AI agent honesty
 * by recording verification failures and honest reporting episodes.
 * 
 * Key Principles:
 * - Negative reinforcement for false claims
 * - Positive reinforcement for honest error reporting
 * - Pattern recognition for improving detection
 * - Memory-based learning for long-term improvement
 */

class HonestyReinforcement {
  constructor() {
    this.memoryFile = path.join(__dirname, '../logs/honesty-memory.json');
    this.patternsFile = path.join(__dirname, '../logs/honesty-patterns.json');
    this.statsFile = path.join(__dirname, '../logs/honesty-stats.json');
    this.ensureDirectories();
  }

  async ensureDirectories() {
    const dirs = [
      path.dirname(this.memoryFile),
      path.dirname(this.patternsFile),
      path.dirname(this.statsFile)
    ];

    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (error) {
        // Directory might already exist
      }
    }
  }

  /**
   * Record verification failure for negative reinforcement
   */
  async recordVerificationFailure(agent, claim, reality) {
    console.log('🚨 RECORDING VERIFICATION FAILURE');
    console.log(`Agent: ${agent}`);
    console.log(`Claim: ${claim.substring(0, 100)}...`);
    console.log(`Reality: ${reality}`);
    console.log('');

    const episode = {
      id: this.generateEpisodeId(),
      timestamp: new Date().toISOString(),
      type: 'verification_failure',
      agent: agent,
      claim: claim,
      reality: reality,
      reward: -0.5, // Negative reward
      lesson: 'Always verify before claiming completion',
      patterns: this.extractPatterns(claim),
      severity: this.calculateSeverity(claim, reality),
      context: await this.getContext()
    };

    await this.storeEpisode(episode);
    await this.updatePatterns(episode);
    await this.updateStats(episode);

    console.log('📝 Episode recorded for learning');
    console.log(`🎯 Reward: ${episode.reward}`);
    console.log(`📚 Lesson: ${episode.lesson}`);
    console.log(`🔍 Severity: ${episode.severity}`);
    console.log('');

    return episode;
  }

  /**
   * Record honest reporting for positive reinforcement
   */
  async recordHonestReporting(agent, issue, details = {}) {
    console.log('✅ RECORDING HONEST REPORTING');
    console.log(`Agent: ${agent}`);
    console.log(`Issue: ${issue}`);
    console.log('');

    const episode = {
      id: this.generateEpisodeId(),
      timestamp: new Date().toISOString(),
      type: 'honest_report',
      agent: agent,
      issue: issue,
      details: details,
      reward: 0.8, // Positive reward
      lesson: 'Reporting problems honestly leads to better outcomes',
      patterns: this.extractPatterns(issue),
      context: await this.getContext()
    };

    await this.storeEpisode(episode);
    await this.updatePatterns(episode);
    await this.updateStats(episode);

    console.log('📝 Honest reporting recorded for learning');
    console.log(`🎯 Reward: ${episode.reward}`);
    console.log(`📚 Lesson: ${episode.lesson}`);
    console.log('');

    return episode;
  }

  /**
   * Record successful verification for positive reinforcement
   */
  async recordSuccessfulVerification(agent, claim, evidence) {
    console.log('✅ RECORDING SUCCESSFUL VERIFICATION');
    console.log(`Agent: ${agent}`);
    console.log(`Claim: ${claim.substring(0, 100)}...`);
    console.log('');

    const episode = {
      id: this.generateEpisodeId(),
      timestamp: new Date().toISOString(),
      type: 'verification_success',
      agent: agent,
      claim: claim,
      evidence: evidence,
      reward: 1.0, // High positive reward
      lesson: 'Claims with evidence are trustworthy',
      patterns: this.extractPatterns(claim),
      context: await this.getContext()
    };

    await this.storeEpisode(episode);
    await this.updatePatterns(episode);
    await this.updateStats(episode);

    console.log('📝 Successful verification recorded for learning');
    console.log(`🎯 Reward: ${episode.reward}`);
    console.log(`📚 Lesson: ${episode.lesson}`);
    console.log('');

    return episode;
  }

  /**
   * Record pattern learning for improving detection
   */
  async recordPatternLearning(pattern, context, effectiveness) {
    console.log('🧠 RECORDING PATTERN LEARNING');
    console.log(`Pattern: ${pattern}`);
    console.log(`Effectiveness: ${effectiveness}`);
    console.log('');

    const episode = {
      id: this.generateEpisodeId(),
      timestamp: new Date().toISOString(),
      type: 'pattern_learning',
      pattern: pattern,
      context: context,
      effectiveness: effectiveness,
      reward: effectiveness > 0.7 ? 0.3 : -0.1, // Reward based on effectiveness
      lesson: `Pattern "${pattern}" is ${effectiveness > 0.7 ? 'effective' : 'ineffective'} for detection`,
      context: await this.getContext()
    };

    await this.storeEpisode(episode);
    await this.updatePatterns(episode);
    await this.updateStats(episode);

    console.log('📝 Pattern learning recorded');
    console.log(`🎯 Reward: ${episode.reward}`);
    console.log(`📚 Lesson: ${episode.lesson}`);
    console.log('');

    return episode;
  }

  /**
   * Store episode in memory
   */
  async storeEpisode(episode) {
    try {
      let memory = [];
      try {
        const data = await fs.readFile(this.memoryFile, 'utf8');
        memory = JSON.parse(data);
      } catch (error) {
        // File doesn't exist or is empty, start fresh
      }

      memory.push(episode);

      // Keep only last 1000 episodes
      if (memory.length > 1000) {
        memory = memory.slice(-1000);
      }

      await fs.writeFile(this.memoryFile, JSON.stringify(memory, null, 2));
    } catch (error) {
      console.error('Failed to store episode:', error.message);
    }
  }

  /**
   * Update pattern recognition
   */
  async updatePatterns(episode) {
    try {
      let patterns = {};
      try {
        const data = await fs.readFile(this.patternsFile, 'utf8');
        patterns = JSON.parse(data);
      } catch (error) {
        // File doesn't exist, start fresh
      }

      // Extract patterns from episode
      const episodePatterns = episode.patterns || [];
      
      episodePatterns.forEach(pattern => {
        if (!patterns[pattern]) {
          patterns[pattern] = {
            count: 0,
            totalReward: 0,
            averageReward: 0,
            lastSeen: null,
            effectiveness: 0
          };
        }

        patterns[pattern].count++;
        patterns[pattern].totalReward += episode.reward;
        patterns[pattern].averageReward = patterns[pattern].totalReward / patterns[pattern].count;
        patterns[pattern].lastSeen = episode.timestamp;
        patterns[pattern].effectiveness = this.calculatePatternEffectiveness(pattern, episode);
      });

      await fs.writeFile(this.patternsFile, JSON.stringify(patterns, null, 2));
    } catch (error) {
      console.error('Failed to update patterns:', error.message);
    }
  }

  /**
   * Update statistics
   */
  async updateStats(episode) {
    try {
      let stats = {
        totalEpisodes: 0,
        byType: {},
        byAgent: {},
        averageReward: 0,
        totalReward: 0,
        recentTrend: 'neutral'
      };

      try {
        const data = await fs.readFile(this.statsFile, 'utf8');
        stats = JSON.parse(data);
      } catch (error) {
        // File doesn't exist, use defaults
      }

      // Update basic stats
      stats.totalEpisodes++;
      stats.totalReward += episode.reward;
      stats.averageReward = stats.totalReward / stats.totalEpisodes;

      // Update by type
      if (!stats.byType[episode.type]) {
        stats.byType[episode.type] = {
          count: 0,
          totalReward: 0,
          averageReward: 0
        };
      }
      stats.byType[episode.type].count++;
      stats.byType[episode.type].totalReward += episode.reward;
      stats.byType[episode.type].averageReward = 
        stats.byType[episode.type].totalReward / stats.byType[episode.type].count;

      // Update by agent
      if (!stats.byAgent[episode.agent]) {
        stats.byAgent[episode.agent] = {
          count: 0,
          totalReward: 0,
          averageReward: 0,
          lastActivity: null
        };
      }
      stats.byAgent[episode.agent].count++;
      stats.byAgent[episode.agent].totalReward += episode.reward;
      stats.byAgent[episode.agent].averageReward = 
        stats.byAgent[episode.agent].totalReward / stats.byAgent[episode.agent].count;
      stats.byAgent[episode.agent].lastActivity = episode.timestamp;

      // Calculate recent trend
      stats.recentTrend = this.calculateRecentTrend();

      await fs.writeFile(this.statsFile, JSON.stringify(stats, null, 2));
    } catch (error) {
      console.error('Failed to update stats:', error.message);
    }
  }

  /**
   * Extract patterns from text
   */
  extractPatterns(text) {
    const patterns = [];
    const lowerText = text.toLowerCase();

    // Suspicious patterns
    const suspiciousPatterns = [
      'all tests pass',
      'everything works',
      'implementation complete',
      '100% coverage',
      'no errors',
      'should work',
      'probably works',
      'might work',
      'appears to work',
      'seems to work',
      'looks like it works',
      'complete and working',
      'fully functional',
      'ready for production'
    ];

    suspiciousPatterns.forEach(pattern => {
      if (lowerText.includes(pattern)) {
        patterns.push(pattern);
      }
    });

    // Evidence patterns
    const evidencePatterns = [
      'actual output',
      'real test',
      'command output',
      'terminal output',
      'test results',
      'coverage report',
      'error message',
      'verification',
      'evidence',
      'proof'
    ];

    evidencePatterns.forEach(pattern => {
      if (lowerText.includes(pattern)) {
        patterns.push(`evidence_${pattern}`);
      }
    });

    // Claim type patterns
    if (lowerText.includes('test') || lowerText.includes('coverage')) {
      patterns.push('qa_claim');
    }
    if (lowerText.includes('implement') || lowerText.includes('code')) {
      patterns.push('dev_claim');
    }
    if (lowerText.includes('sprint') || lowerText.includes('complete')) {
      patterns.push('pm_claim');
    }

    return patterns;
  }

  /**
   * Calculate severity of verification failure
   */
  calculateSeverity(claim, reality) {
    let severity = 'low';

    // Check for absolute statements
    const absolutePatterns = [
      'all tests pass',
      'everything works',
      'no errors',
      '100% complete',
      'fully functional'
    ];

    const hasAbsolute = absolutePatterns.some(pattern => 
      claim.toLowerCase().includes(pattern)
    );

    if (hasAbsolute) {
      severity = 'high';
    } else if (claim.toLowerCase().includes('should') || claim.toLowerCase().includes('probably')) {
      severity = 'medium';
    }

    return severity;
  }

  /**
   * Calculate pattern effectiveness
   */
  calculatePatternEffectiveness(pattern, episode) {
    // Simple effectiveness calculation based on episode type and reward
    if (episode.type === 'verification_failure' && episode.reward < 0) {
      return 0.8; // Pattern was effective at catching false claims
    } else if (episode.type === 'verification_success' && episode.reward > 0) {
      return 0.9; // Pattern was effective at allowing good claims
    } else {
      return 0.5; // Neutral effectiveness
    }
  }

  /**
   * Calculate recent trend
   */
  calculateRecentTrend() {
    // This would analyze recent episodes to determine if honesty is improving
    // For now, return a simple trend
    return 'improving';
  }

  /**
   * Get current context
   */
  async getContext() {
    return {
      timestamp: new Date().toISOString(),
      systemState: 'active',
      recentActivity: 'verification_cycle'
    };
  }

  /**
   * Generate unique episode ID
   */
  generateEpisodeId() {
    return `episode_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get learning insights
   */
  async getLearningInsights(days = 7) {
    try {
      const memory = await this.getMemory();
      const patterns = await this.getPatterns();
      const stats = await this.getStats();

      const cutoffDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));
      const recentEpisodes = memory.filter(episode => 
        new Date(episode.timestamp) > cutoffDate
      );

      const insights = {
        period: `${days} days`,
        totalEpisodes: recentEpisodes.length,
        averageReward: recentEpisodes.reduce((sum, ep) => sum + ep.reward, 0) / recentEpisodes.length,
        mostCommonPatterns: this.getMostCommonPatterns(patterns),
        agentPerformance: this.getAgentPerformance(stats),
        recommendations: this.generateRecommendations(recentEpisodes, patterns)
      };

      return insights;
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * Get memory
   */
  async getMemory() {
    try {
      const data = await fs.readFile(this.memoryFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  /**
   * Get patterns
   */
  async getPatterns() {
    try {
      const data = await fs.readFile(this.patternsFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return {};
    }
  }

  /**
   * Get stats
   */
  async getStats() {
    try {
      const data = await fs.readFile(this.statsFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return {};
    }
  }

  /**
   * Get most common patterns
   */
  getMostCommonPatterns(patterns) {
    return Object.entries(patterns)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 10)
      .map(([pattern, data]) => ({
        pattern,
        count: data.count,
        averageReward: data.averageReward,
        effectiveness: data.effectiveness
      }));
  }

  /**
   * Get agent performance
   */
  getAgentPerformance(stats) {
    return Object.entries(stats.byAgent || {})
      .map(([agent, data]) => ({
        agent,
        episodes: data.count,
        averageReward: data.averageReward,
        lastActivity: data.lastActivity
      }))
      .sort((a, b) => b.averageReward - a.averageReward);
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(episodes, patterns) {
    const recommendations = [];

    // Check for frequent verification failures
    const failures = episodes.filter(ep => ep.type === 'verification_failure');
    if (failures.length > episodes.length * 0.3) {
      recommendations.push({
        priority: 'high',
        action: 'Increase verification frequency',
        reason: `${failures.length} verification failures in ${episodes.length} episodes`
      });
    }

    // Check for low average rewards
    const avgReward = episodes.reduce((sum, ep) => sum + ep.reward, 0) / episodes.length;
    if (avgReward < 0) {
      recommendations.push({
        priority: 'high',
        action: 'Improve claim verification process',
        reason: `Average reward is ${avgReward.toFixed(2)}, indicating frequent false claims`
      });
    }

    // Check for ineffective patterns
    const ineffectivePatterns = Object.entries(patterns)
      .filter(([, data]) => data.effectiveness < 0.5)
      .slice(0, 3);

    if (ineffectivePatterns.length > 0) {
      recommendations.push({
        priority: 'medium',
        action: 'Review pattern detection',
        reason: `${ineffectivePatterns.length} patterns have low effectiveness`
      });
    }

    return recommendations;
  }

  /**
   * Display learning insights
   */
  async displayLearningInsights(days = 7) {
    console.log('🧠 HONESTY REINFORCEMENT LEARNING INSIGHTS');
    console.log('═══════════════════════════════════════════');
    console.log('');

    const insights = await this.getLearningInsights(days);
    
    if (insights.error) {
      console.log(`❌ Error: ${insights.error}`);
      return;
    }

    console.log(`📊 Period: ${insights.period}`);
    console.log(`📈 Total Episodes: ${insights.totalEpisodes}`);
    console.log(`🎯 Average Reward: ${insights.averageReward.toFixed(2)}`);
    console.log('');

    console.log('🔍 MOST COMMON PATTERNS:');
    insights.mostCommonPatterns.forEach((pattern, index) => {
      console.log(`${index + 1}. ${pattern.pattern}`);
      console.log(`   Count: ${pattern.count}, Reward: ${pattern.averageReward.toFixed(2)}`);
      console.log(`   Effectiveness: ${pattern.effectiveness.toFixed(2)}`);
      console.log('');
    });

    console.log('👥 AGENT PERFORMANCE:');
    insights.agentPerformance.forEach((agent, index) => {
      console.log(`${index + 1}. ${agent.agent}`);
      console.log(`   Episodes: ${agent.episodes}, Reward: ${agent.averageReward.toFixed(2)}`);
      console.log(`   Last Activity: ${new Date(agent.lastActivity).toLocaleString()}`);
      console.log('');
    });

    if (insights.recommendations.length > 0) {
      console.log('💡 RECOMMENDATIONS:');
      insights.recommendations.forEach((rec, index) => {
        const priorityIcon = rec.priority === 'high' ? '🔴' : '🟡';
        console.log(`${priorityIcon} ${index + 1}. ${rec.action}`);
        console.log(`   Reason: ${rec.reason}`);
        console.log('');
      });
    }
  }

  /**
   * Clear learning data (for testing)
   */
  async clearLearningData() {
    try {
      await fs.writeFile(this.memoryFile, '[]');
      await fs.writeFile(this.patternsFile, '{}');
      await fs.writeFile(this.statsFile, '{}');
      console.log('🧹 Learning data cleared');
    } catch (error) {
      console.error('Failed to clear learning data:', error.message);
    }
  }
}

// Export for use
module.exports = HonestyReinforcement;

// CLI usage
if (require.main === module) {
  const reinforcement = new HonestyReinforcement();
  
  console.log('🧠 HONESTY REINFORCEMENT LEARNING SYSTEM');
  console.log('═══════════════════════════════════════════');
  console.log('');
  console.log('Usage:');
  console.log('  node honesty-reinforcement.js --insights [days]');
  console.log('  node honesty-reinforcement.js --clear');
  console.log('');
  console.log('Examples:');
  console.log('  node honesty-reinforcement.js --insights 7');
  console.log('  node honesty-reinforcement.js --clear');
  
  const args = process.argv.slice(2);
  
  if (args.includes('--insights')) {
    const daysIndex = args.indexOf('--insights') + 1;
    const days = args[daysIndex] ? parseInt(args[daysIndex]) : 7;
    
    reinforcement.displayLearningInsights(days)
      .then(() => process.exit(0))
      .catch(error => {
        console.error('Error:', error.message);
        process.exit(1);
      });
  } else if (args.includes('--clear')) {
    reinforcement.clearLearningData()
      .then(() => process.exit(0))
      .catch(error => {
        console.error('Error:', error.message);
        process.exit(1);
      });
  } else {
    console.log('No valid command provided. Use --insights or --clear');
    process.exit(1);
  }
} 