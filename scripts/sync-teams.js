#!/usr/bin/env node

require('dotenv').config();
const { ClaudeCode } = require('@anthropic-ai/claude-code');
const fs = require('fs');
const path = require('path');

class CrossTeamSync {
  constructor() {
    this.claudeCode = new ClaudeCode({
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: 'claude-3-5-sonnet-20241022'
    });
    this.teams = new Map();
    this.dependencies = new Map();
    this.communicationChannels = new Map();
    this.syncHistory = [];
    this.isSyncing = false;
  }

  async initialize() {
    console.log('🤝 Initializing Cross-Team Synchronization with Claude Code...\n');
    
    try {
      // Initialize teams
      await this.initializeTeams();
      
      // Set up communication channels
      await this.setupCommunicationChannels();
      
      // Load dependency mappings
      await this.loadDependencies();
      
      // Set up sync intervals
      this.setupSyncIntervals();
      
      console.log('✅ Cross-Team Sync initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Cross-Team Sync initialization failed:', error);
      return false;
    }
  }

  async initializeTeams() {
    const teamConfigs = [
      { 
        name: 'Frontend', 
        dependencies: ['Backend', 'Design'], 
        outputs: ['UI Components', 'User Experience', 'Client-Side Logic'],
        inputs: ['API Specifications', 'Design Assets', 'User Requirements']
      },
      { 
        name: 'Backend', 
        dependencies: ['Database', 'Infrastructure'], 
        outputs: ['APIs', 'Business Logic', 'Data Processing'],
        inputs: ['Database Schema', 'Infrastructure Requirements', 'Business Rules']
      },
      { 
        name: 'Data', 
        dependencies: ['Backend', 'AI/ML'], 
        outputs: ['Analytics', 'Insights', 'Data Models'],
        inputs: ['Raw Data', 'Analysis Requirements', 'Model Parameters']
      },
      { 
        name: 'Security', 
        dependencies: ['Backend', 'Infrastructure'], 
        outputs: ['Security Policies', 'Compliance Reports', 'Threat Analysis'],
        inputs: ['System Architecture', 'Compliance Requirements', 'Threat Intelligence']
      },
      { 
        name: 'Infrastructure', 
        dependencies: ['Security'], 
        outputs: ['Deployment Environments', 'Monitoring Systems', 'CI/CD Pipelines'],
        inputs: ['Security Requirements', 'Scalability Needs', 'Performance Requirements']
      },
      { 
        name: 'Mobile', 
        dependencies: ['Backend', 'Frontend'], 
        outputs: ['Mobile Apps', 'Mobile APIs', 'App Store Assets'],
        inputs: ['Backend APIs', 'UI Components', 'Mobile Requirements']
      },
      { 
        name: 'AI/ML', 
        dependencies: ['Data', 'Backend'], 
        outputs: ['ML Models', 'AI Services', 'Predictive Analytics'],
        inputs: ['Training Data', 'Model Requirements', 'Integration Points']
      }
    ];

    for (const config of teamConfigs) {
      this.teams.set(config.name, {
        name: config.name,
        status: 'idle',
        dependencies: config.dependencies,
        outputs: config.outputs,
        inputs: config.inputs,
        lastSync: new Date().toISOString(),
        blockers: [],
        achievements: []
      });
      
      this.dependencies.set(config.name, config.dependencies);
    }
  }

  async setupCommunicationChannels() {
    console.log('📡 Setting up communication channels...');
    
    const channelTypes = [
      'daily-standup',
      'technical-sync',
      'dependency-review',
      'blocker-resolution',
      'achievement-celebration'
    ];
    
    for (const channelType of channelTypes) {
      this.communicationChannels.set(channelType, {
        type: channelType,
        participants: [],
        messages: [],
        lastActivity: new Date().toISOString()
      });
    }
    
    // Assign teams to channels
    for (const [teamName, team] of this.teams) {
      // All teams participate in daily standup
      this.communicationChannels.get('daily-standup').participants.push(teamName);
      
      // Technical teams sync together
      if (['Frontend', 'Backend', 'Mobile'].includes(teamName)) {
        this.communicationChannels.get('technical-sync').participants.push(teamName);
      }
      
      // Data and AI teams sync together
      if (['Data', 'AI/ML'].includes(teamName)) {
        this.communicationChannels.get('technical-sync').participants.push(teamName);
      }
    }
    
    console.log(`✅ Set up ${this.communicationChannels.size} communication channels`);
  }

  async loadDependencies() {
    const depsPath = path.join(process.cwd(), 'sync');
    
    if (!fs.existsSync(depsPath)) {
      fs.mkdirSync(depsPath, { recursive: true });
      console.log('📁 Created sync directory');
    }

    const depsFile = path.join(depsPath, 'dependencies.json');
    if (fs.existsSync(depsFile)) {
      const content = await fs.promises.readFile(depsFile, 'utf8');
      const savedDeps = JSON.parse(content);
      
      // Restore dependencies
      for (const [teamName, deps] of Object.entries(savedDeps)) {
        if (this.dependencies.has(teamName)) {
          this.dependencies.set(teamName, deps);
        }
      }
      
      console.log('📚 Loaded dependency mappings');
    }
  }

  setupSyncIntervals() {
    // Daily standup every 24 hours
    setInterval(async () => {
      if (!this.isSyncing) return;
      
      try {
        await this.runDailyStandup();
      } catch (error) {
        console.error('❌ Daily standup error:', error);
      }
    }, 86400000); // 24 hours

    // Technical sync every 4 hours
    setInterval(async () => {
      if (!this.isSyncing) return;
      
      try {
        await this.runTechnicalSync();
      } catch (error) {
        console.error('❌ Technical sync error:', error);
      }
    }, 14400000); // 4 hours

    // Dependency review every 2 hours
    setInterval(async () => {
      if (!this.isSyncing) return;
      
      try {
        await this.runDependencyReview();
      } catch (error) {
        console.error('❌ Dependency review error:', error);
      }
    }, 7200000); // 2 hours

    // Blocker resolution every 30 minutes
    setInterval(async () => {
      if (!this.isSyncing) return;
      
      try {
        await this.resolveBlockers();
      } catch (error) {
        console.error('❌ Blocker resolution error:', error);
      }
    }, 1800000); // 30 minutes
  }

  async runDailyStandup() {
    console.log('🌅 Running daily standup...');
    
    const standupData = {
      teams: {},
      blockers: [],
      achievements: [],
      dependencies: {}
    };
    
    // Collect team updates
    for (const [teamName, team] of this.teams) {
      standupData.teams[teamName] = {
        status: team.status,
        blockers: team.blockers,
        achievements: team.achievements,
        lastSync: team.lastSync
      };
      
      standupData.blockers.push(...team.blockers);
      standupData.achievements.push(...team.achievements);
    }
    
    // Add dependency information
    for (const [teamName, deps] of this.dependencies) {
      standupData.dependencies[teamName] = deps;
    }
    
    // Use Claude Code to analyze standup
    const standupPrompt = `Analyze this daily standup data and provide insights:
    
    Standup Data:
    ${JSON.stringify(standupData, null, 2)}
    
    Provide:
    1. Overall team health assessment
    2. Critical blockers that need immediate attention
    3. Dependencies that are at risk
    4. Recommendations for the day
    5. Success patterns to celebrate`;
    
    const standupAnalysis = await this.claudeCode.generate({
      prompt: standupPrompt,
      maxTokens: 2000
    });
    
    // Record standup
    this.syncHistory.push({
      type: 'daily-standup',
      timestamp: new Date().toISOString(),
      data: standupData,
      analysis: standupAnalysis
    });
    
    console.log('🌅 Daily standup completed');
    console.log('📊 Analysis:', standupAnalysis.substring(0, 200) + '...');
  }

  async runTechnicalSync() {
    console.log('🔧 Running technical sync...');
    
    const technicalTeams = ['Frontend', 'Backend', 'Mobile', 'Data', 'AI/ML'];
    const technicalData = {
      teams: {},
      integrationPoints: [],
      technicalDebt: [],
      performanceMetrics: {}
    };
    
    // Collect technical information
    for (const teamName of technicalTeams) {
      const team = this.teams.get(teamName);
      if (team) {
        technicalData.teams[teamName] = {
          outputs: team.outputs,
          inputs: team.inputs,
          status: team.status
        };
      }
    }
    
    // Identify integration points
    for (const [teamName, deps] of this.dependencies) {
      if (technicalTeams.includes(teamName)) {
        for (const dep of deps) {
          if (technicalTeams.includes(dep)) {
            technicalData.integrationPoints.push({
              from: teamName,
              to: dep,
              type: 'technical-integration'
            });
          }
        }
      }
    }
    
    // Use Claude Code to analyze technical sync
    const technicalPrompt = `Analyze this technical sync data and provide recommendations:
    
    Technical Data:
    ${JSON.stringify(technicalData, null, 2)}
    
    Provide:
    1. Integration health assessment
    2. Technical debt identification
    3. Performance optimization opportunities
    4. Architecture improvements
    5. Risk mitigation strategies`;
    
    const technicalAnalysis = await this.claudeCode.generate({
      prompt: technicalPrompt,
      maxTokens: 2000
    });
    
    // Record technical sync
    this.syncHistory.push({
      type: 'technical-sync',
      timestamp: new Date().toISOString(),
      data: technicalData,
      analysis: technicalAnalysis
    });
    
    console.log('🔧 Technical sync completed');
    console.log('📊 Analysis:', technicalAnalysis.substring(0, 200) + '...');
  }

  async runDependencyReview() {
    console.log('🔗 Running dependency review...');
    
    const dependencyData = {
      dependencies: {},
      risks: [],
      opportunities: [],
      recommendations: []
    };
    
    // Analyze dependencies
    for (const [teamName, deps] of this.dependencies) {
      dependencyData.dependencies[teamName] = {
        dependencies: deps,
        status: this.teams.get(teamName)?.status || 'unknown',
        blockers: this.teams.get(teamName)?.blockers || []
      };
      
      // Check for circular dependencies
      for (const dep of deps) {
        const depDeps = this.dependencies.get(dep);
        if (depDeps && depDeps.includes(teamName)) {
          dependencyData.risks.push({
            type: 'circular-dependency',
            teams: [teamName, dep],
            severity: 'high'
          });
        }
      }
    }
    
    // Use Claude Code to analyze dependencies
    const dependencyPrompt = `Analyze these team dependencies and provide insights:
    
    Dependency Data:
    ${JSON.stringify(dependencyData, null, 2)}
    
    Provide:
    1. Dependency health assessment
    2. Risk identification and mitigation
    3. Optimization opportunities
    4. Communication recommendations
    5. Process improvements`;
    
    const dependencyAnalysis = await this.claudeCode.generate({
      prompt: dependencyPrompt,
      maxTokens: 2000
    });
    
    // Record dependency review
    this.syncHistory.push({
      type: 'dependency-review',
      timestamp: new Date().toISOString(),
      data: dependencyData,
      analysis: dependencyAnalysis
    });
    
    console.log('🔗 Dependency review completed');
    console.log('📊 Analysis:', dependencyAnalysis.substring(0, 200) + '...');
  }

  async resolveBlockers() {
    console.log('🚧 Resolving blockers...');
    
    const allBlockers = [];
    for (const [teamName, team] of this.teams) {
      for (const blocker of team.blockers) {
        allBlockers.push({
          team: teamName,
          blocker: blocker,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    if (allBlockers.length === 0) {
      console.log('✅ No blockers to resolve');
      return;
    }
    
    // Use Claude Code to analyze blockers
    const blockerPrompt = `Analyze these team blockers and provide resolution strategies:
    
    Blockers:
    ${JSON.stringify(allBlockers, null, 2)}
    
    Provide:
    1. Blocker prioritization
    2. Resolution strategies
    3. Team coordination needed
    4. Escalation requirements
    5. Prevention measures`;
    
    const blockerAnalysis = await this.claudeCode.generate({
      prompt: blockerPrompt,
      maxTokens: 1500
    });
    
    // Attempt to resolve blockers
    const resolvedBlockers = [];
    for (const blockerInfo of allBlockers) {
      const team = this.teams.get(blockerInfo.team);
      if (team) {
        // Remove blocker (simulate resolution)
        team.blockers = team.blockers.filter(b => b !== blockerInfo.blocker);
        resolvedBlockers.push(blockerInfo);
      }
    }
    
    console.log(`🚧 Resolved ${resolvedBlockers.length} blockers`);
    console.log('📊 Analysis:', blockerAnalysis.substring(0, 200) + '...');
  }

  async addBlocker(teamName, blocker) {
    const team = this.teams.get(teamName);
    if (!team) {
      throw new Error(`Team ${teamName} not found`);
    }
    
    team.blockers.push(blocker);
    console.log(`🚧 Added blocker to ${teamName}: ${blocker}`);
  }

  async addAchievement(teamName, achievement) {
    const team = this.teams.get(teamName);
    if (!team) {
      throw new Error(`Team ${teamName} not found`);
    }
    
    team.achievements.push(achievement);
    console.log(`🎉 Added achievement to ${teamName}: ${achievement}`);
  }

  async updateTeamStatus(teamName, status) {
    const team = this.teams.get(teamName);
    if (!team) {
      throw new Error(`Team ${teamName} not found`);
    }
    
    team.status = status;
    team.lastSync = new Date().toISOString();
    console.log(`📊 Updated ${teamName} status to: ${status}`);
  }

  async getTeamDependencies(teamName) {
    return this.dependencies.get(teamName) || [];
  }

  async getDependentTeams(teamName) {
    const dependents = [];
    for (const [team, deps] of this.dependencies) {
      if (deps.includes(teamName)) {
        dependents.push(team);
      }
    }
    return dependents;
  }

  async start() {
    if (this.isSyncing) {
      console.log('⚠️ Cross-Team Sync is already running');
      return;
    }

    this.isSyncing = true;
    console.log('🎯 Starting Cross-Team Synchronization...');
    
    // Initial sync
    await this.runDailyStandup();
    await this.runTechnicalSync();
    await this.runDependencyReview();
    
    console.log('✅ Cross-Team Synchronization started successfully');
  }

  async stop() {
    this.isSyncing = false;
    console.log('🛑 Stopping Cross-Team Synchronization...');
    
    // Save sync data
    await this.saveSyncData();
    
    console.log('✅ Cross-Team Synchronization stopped');
  }

  async saveSyncData() {
    const syncPath = path.join(process.cwd(), 'sync');
    
    // Save dependencies
    const depsData = {};
    for (const [teamName, deps] of this.dependencies) {
      depsData[teamName] = deps;
    }
    
    const depsFile = path.join(syncPath, 'dependencies.json');
    await fs.promises.writeFile(depsFile, JSON.stringify(depsData, null, 2));
    
    // Save sync history
    const historyFile = path.join(syncPath, 'sync-history.json');
    await fs.promises.writeFile(historyFile, JSON.stringify(this.syncHistory, null, 2));
    
    // Save team states
    const teamStates = {};
    for (const [teamName, team] of this.teams) {
      teamStates[teamName] = {
        status: team.status,
        blockers: team.blockers,
        achievements: team.achievements,
        lastSync: team.lastSync
      };
    }
    
    const statesFile = path.join(syncPath, 'team-states.json');
    await fs.promises.writeFile(statesFile, JSON.stringify(teamStates, null, 2));
    
    console.log('💾 Sync data saved');
  }

  getSyncStats() {
    return {
      teams: this.teams.size,
      dependencies: Array.from(this.dependencies.values()).flat().length,
      syncHistory: this.syncHistory.length,
      activeBlockers: Array.from(this.teams.values()).reduce((sum, team) => sum + team.blockers.length, 0),
      totalAchievements: Array.from(this.teams.values()).reduce((sum, team) => sum + team.achievements.length, 0)
    };
  }

  getTeamStatus(teamName) {
    const team = this.teams.get(teamName);
    if (!team) return null;
    
    return {
      name: teamName,
      status: team.status,
      blockers: team.blockers,
      achievements: team.achievements,
      dependencies: this.dependencies.get(teamName) || [],
      lastSync: team.lastSync
    };
  }

  getAllTeamsStatus() {
    const status = {};
    for (const teamName of this.teams.keys()) {
      status[teamName] = this.getTeamStatus(teamName);
    }
    return status;
  }
}

// Main execution
async function main() {
  const sync = new CrossTeamSync();
  
  try {
    const initialized = await sync.initialize();
    if (!initialized) {
      console.error('❌ Failed to initialize cross-team sync');
      process.exit(1);
    }

    await sync.start();
    
    // Keep running for continuous sync
    console.log('\n🔄 Cross-Team Sync running continuously...');
    console.log('Press Ctrl+C to stop');
    
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down...');
      await sync.stop();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Cross-Team Sync error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { CrossTeamSync }; 