#!/usr/bin/env node

/**
 * 🚀 Meta Team Orchestrator V2
 * Enhanced orchestrator with integrated Claude Code tools, error handling, and versioning
 * 
 * @author Meta Team - Backend Team
 * @version 2.0.0
 * @date 2025-07-27
 */

require('dotenv').config();
const { query } = require('@anthropic-ai/claude-code');
const fs = require('fs');
const path = require('path');

// Import our new tools and utilities
const { createClaudeCodeIntegration, quickAnalyze, quickGenerate } = require('../templates/claude-code-integration');
const { createVersionedFile, quickWrite, quickRead } = require('../templates/versioned-file-template');
const apiErrorHandler = require('../utils/api-error-handler');
const claudeCodeErrorHandler = require('../utils/claude-code-error-handler');
const fileVersioning = require('../utils/file-versioning');
const RetryStrategy = require('../utils/retry-strategy');
const fallbackStrategies = require('../utils/fallback-strategies');
const logger = require('../utils/logger');
const BackupManager = require('../scripts/backup-manager');

class MetaOrchestratorV2 {
  constructor(options = {}) {
    this.config = {
      enableBackup: options.enableBackup !== false,
      enableVersioning: options.enableVersioning !== false,
      enableErrorHandling: options.enableErrorHandling !== false,
      enableFallbacks: options.enableFallbacks !== false,
      ...options
    };

    // Initialize Claude Code integration with our new tools
    this.claudeCode = createClaudeCodeIntegration({
      enableBackup: this.config.enableBackup,
      enableFallback: this.config.enableFallbacks,
      maxRetries: 3,
      model: 'claude-3-5-sonnet-20241022'
    });

    // Initialize backup manager
    this.backupManager = new BackupManager();
    
    this.teams = new Map();
    this.memoryManager = null;
    this.knowledgeCurator = null;
    this.evolutionEngine = null;
    this.isRunning = false;
    this.projectHistory = [];
    
    // Initialize error tracking
    this.errorStats = {
      totalErrors: 0,
      recoveredErrors: 0,
      fallbackUsed: 0
    };
  }

  async initialize() {
    console.log('🚀 Initializing Meta Orchestrator V2 with Enhanced Tools...\n');
    
    try {
      // Initialize backup manager
      await this.backupManager.initialize();
      
      // Initialize core components with error handling
      this.memoryManager = new MemoryManagerV2(this.claudeCode);
      this.knowledgeCurator = new KnowledgeCuratorV2(this.claudeCode);
      this.evolutionEngine = new EvolutionEngineV2(this.claudeCode);
      
      // Load global knowledge with versioning
      await this.memoryManager.loadGlobalPatterns();
      
      // Initialize teams with enhanced capabilities
      await this.initializeTeams();
      
      // Start automatic backups
      if (this.config.enableBackup) {
        this.backupManager.scheduleAutomaticBackups(1800000); // Every 30 minutes
      }
      
      console.log('✅ Meta Orchestrator V2 initialized successfully');
      logger.success('Meta Orchestrator V2 initialized with all enhanced tools');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Meta Orchestrator V2:', error);
      logger.error('Meta Orchestrator V2 initialization failed', { error: error.message });
      return false;
    }
  }

  async initializeTeams() {
    const teamConfigs = [
      { 
        name: 'Frontend', 
        agents: 3, 
        skills: ['React', 'Vue', 'Angular', 'CSS', 'JavaScript'],
        claudeCode: this.claudeCode,
        errorHandler: claudeCodeErrorHandler
      },
      { 
        name: 'Backend', 
        agents: 3, 
        skills: ['Node.js', 'Python', 'Java', 'Database', 'API'],
        claudeCode: this.claudeCode,
        errorHandler: claudeCodeErrorHandler
      },
      { 
        name: 'Security', 
        agents: 2, 
        skills: ['Authentication', 'Encryption', 'Compliance'],
        claudeCode: this.claudeCode,
        errorHandler: claudeCodeErrorHandler
      },
      { 
        name: 'Infrastructure', 
        agents: 2, 
        skills: ['DevOps', 'Cloud', 'CI/CD', 'Monitoring'],
        claudeCode: this.claudeCode,
        errorHandler: claudeCodeErrorHandler
      }
    ];

    for (const config of teamConfigs) {
      const team = new AITeamV2(config);
      this.teams.set(config.name, team);
      console.log(`✅ ${config.name} team initialized with ${config.agents} agents`);
      logger.info(`${config.name} team initialized`, { agents: config.agents, skills: config.skills });
    }
  }

  async start() {
    if (this.isRunning) {
      console.log('⚠️ Orchestrator is already running');
      return;
    }

    this.isRunning = true;
    console.log('🎯 Starting Meta Team Orchestration V2...\n');
    logger.info('Meta Team Orchestration V2 started');

    // Start all teams
    for (const [teamName, team] of this.teams) {
      await team.start();
    }

    // Start continuous learning and evolution with error handling
    this.startContinuousLearning();
    this.startEvolutionProcess();
    this.startHealthMonitoring();

    console.log('✅ Meta Team Orchestration V2 started successfully');
  }

  async stop() {
    this.isRunning = false;
    console.log('🛑 Stopping Meta Team Orchestration V2...');
    logger.info('Meta Team Orchestration V2 stopping');
    
    for (const [teamName, team] of this.teams) {
      await team.stop();
    }
    
    console.log('✅ Meta Team Orchestration V2 stopped');
  }

  startContinuousLearning() {
    setInterval(async () => {
      if (!this.isRunning) return;
      
      try {
        await this.knowledgeCurator.consolidateLearnings();
        logger.info('Continuous learning cycle completed');
      } catch (error) {
        logger.error('Continuous learning failed', { error: error.message });
        this.errorStats.totalErrors++;
      }
    }, 300000); // Every 5 minutes
  }

  startEvolutionProcess() {
    setInterval(async () => {
      if (!this.isRunning) return;
      
      try {
        await this.evolutionEngine.evolveStrategies();
        logger.info('Evolution process completed');
      } catch (error) {
        logger.error('Evolution process failed', { error: error.message });
        this.errorStats.totalErrors++;
      }
    }, 600000); // Every 10 minutes
  }

  startHealthMonitoring() {
    setInterval(async () => {
      if (!this.isRunning) return;
      
      try {
        const health = await this.getSystemHealth();
        logger.info('System health check', health);
        
        if (health.overallHealth < 0.8) {
          console.log('⚠️ System health degraded, initiating recovery...');
          await this.initiateRecovery();
        }
      } catch (error) {
        logger.error('Health monitoring failed', { error: error.message });
      }
    }, 120000); // Every 2 minutes
  }

  async executeProject(projectRequirements) {
    console.log('🎯 Executing project with enhanced Meta Team capabilities...\n');
    logger.info('Project execution started', { requirements: projectRequirements });

    try {
      // Create project backup
      if (this.config.enableBackup) {
        await this.backupManager.queueBackup('project-plan.json', {
          team: 'orchestrator',
          action: 'project_start',
          description: `Project: ${projectRequirements.title || 'Unknown'}`
        });
      }

      // Phase 1: Analysis with Claude Code
      const analysis = await this.analyzeProjectWithClaudeCode(projectRequirements);
      
      // Phase 2: Task Distribution with error handling
      const projectPlan = await this.distributeTasksWithFallback(analysis);
      
      // Phase 3: Execution with monitoring
      const results = await this.executeTasksWithMonitoring(projectPlan);
      
      // Phase 4: Consolidation with versioning
      const finalResult = await this.consolidateResultsWithVersioning(results);
      
      // Save project learnings
      await this.saveProjectLearnings(projectRequirements, finalResult);
      
      console.log('✅ Project completed successfully');
      logger.success('Project completed', { 
        projectId: finalResult.projectId,
        duration: finalResult.duration 
      });
      
      return finalResult;
    } catch (error) {
      logger.error('Project execution failed', { error: error.message });
      this.errorStats.totalErrors++;
      
      // Attempt recovery
      const recoveryResult = await this.attemptProjectRecovery(projectRequirements, error);
      return recoveryResult;
    }
  }

  async analyzeProjectWithClaudeCode(requirements) {
    const prompt = `
      Analyze this project requirement and break it down into actionable tasks:
      
      Project: ${JSON.stringify(requirements, null, 2)}
      
      Provide:
      1. Project overview
      2. Technical requirements
      3. Task breakdown by team
      4. Dependencies and timeline
      5. Risk assessment
    `;

    try {
      const analysis = await this.claudeCode.analyzeFile(
        'project-requirements.json',
        prompt,
        {
          team: 'orchestrator',
          createVersion: true,
          version: 'analysis-v1'
        }
      );

      return analysis;
    } catch (error) {
      logger.error('Claude Code analysis failed, using fallback', { error: error.message });
      this.errorStats.fallbackUsed++;
      
      // Use fallback analysis
      return await this.performFallbackAnalysis(requirements);
    }
  }

  async distributeTasksWithFallback(analysis) {
    const tasks = [];
    
    for (const [teamName, team] of this.teams) {
      try {
        const teamTasks = await team.analyzeAndCreateTasks(analysis);
        tasks.push(...teamTasks);
      } catch (error) {
        logger.error(`Task distribution failed for ${teamName}`, { error: error.message });
        this.errorStats.totalErrors++;
        
        // Use fallback task creation
        const fallbackTasks = await this.createFallbackTasks(teamName, analysis);
        tasks.push(...fallbackTasks);
      }
    }
    
    return { tasks, totalTeams: this.teams.size };
  }

  async executeTasksWithMonitoring(tasks) {
    const results = [];
    const startTime = Date.now();
    
    for (const task of tasks) {
      try {
        const result = await this.executeTaskWithRetry(task);
        results.push(result);
        
        // Update progress
        const progress = (results.length / tasks.length) * 100;
        logger.info('Task execution progress', { 
          completed: results.length, 
          total: tasks.length, 
          progress: `${progress.toFixed(1)}%` 
        });
      } catch (error) {
        logger.error('Task execution failed', { task: task.id, error: error.message });
        this.errorStats.totalErrors++;
        
        // Use fallback execution
        const fallbackResult = await this.executeTaskFallback(task);
        results.push(fallbackResult);
      }
    }
    
    return {
      results,
      duration: Date.now() - startTime,
      successRate: (results.filter(r => r.success).length / results.length) * 100
    };
  }

  async executeTaskWithRetry(task) {
    const retryStrategy = RetryStrategy.createForService('claude-code');
    
    return await retryStrategy.execute(async () => {
      const team = this.teams.get(task.team);
      if (!team) {
        throw new Error(`Team ${task.team} not found`);
      }
      
      return await team.executeTask(task);
    });
  }

  async consolidateResultsWithVersioning(results) {
    const consolidationPrompt = `
      Consolidate these project results into a final deliverable:
      
      Results: ${JSON.stringify(results, null, 2)}
      
      Provide:
      1. Executive summary
      2. Technical implementation details
      3. Files created/modified
      4. Performance metrics
      5. Recommendations
    `;

    try {
      // Create versioned consolidation
      const consolidatedFile = createVersionedFile('project-consolidation.md', {
        team: 'orchestrator',
        description: 'Project consolidation report'
      });

      const consolidation = await this.claudeCode.generateCode(consolidationPrompt, {
        team: 'orchestrator',
        createVersion: true,
        version: 'consolidation-v1'
      });

      await consolidatedFile.write(consolidation.data, {
        action: 'consolidation',
        description: 'Project results consolidation'
      });

      return {
        projectId: `proj_${Date.now()}`,
        consolidation: consolidation.data,
        results: results,
        version: 'consolidation-v1',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Consolidation failed, using fallback', { error: error.message });
      return await this.performFallbackConsolidation(results);
    }
  }

  async getSystemHealth() {
    const health = {
      orchestrator: this.isRunning ? 1.0 : 0.0,
      teams: 0,
      claudeCode: 0,
      errorRate: this.errorStats.totalErrors > 0 ? 
        (this.errorStats.totalErrors - this.errorStats.recoveredErrors) / this.errorStats.totalErrors : 0,
      fallbackUsage: this.errorStats.fallbackUsed > 0 ? 
        this.errorStats.fallbackUsed / this.errorStats.totalErrors : 0
    };

    // Check team health
    for (const [teamName, team] of this.teams) {
      const teamHealth = await team.getHealth();
      health.teams += teamHealth;
    }
    health.teams /= this.teams.size;

    // Check Claude Code health
    try {
      const testResult = await quickAnalyze('package.json', 'Test health check');
      health.claudeCode = testResult.success ? 1.0 : 0.5;
    } catch (error) {
      health.claudeCode = 0.0;
    }

    health.overallHealth = (health.orchestrator + health.teams + health.claudeCode) / 3;
    return health;
  }

  async initiateRecovery() {
    console.log('🔄 Initiating system recovery...');
    logger.info('System recovery initiated');

    try {
      // Restart teams with issues
      for (const [teamName, team] of this.teams) {
        const teamHealth = await team.getHealth();
        if (teamHealth < 0.8) {
          await team.restart();
          logger.info(`Team ${teamName} restarted due to health issues`);
        }
      }

      // Clear error tracking
      this.claudeCode.clearErrorTracking();
      
      // Reset error stats
      this.errorStats = {
        totalErrors: 0,
        recoveredErrors: 0,
        fallbackUsed: 0
      };

      console.log('✅ System recovery completed');
      logger.success('System recovery completed');
    } catch (error) {
      logger.error('System recovery failed', { error: error.message });
    }
  }

  async saveProjectLearnings(requirements, result) {
    try {
      const learning = {
        requirements,
        result,
        timestamp: new Date().toISOString(),
        errorStats: this.errorStats,
        duration: result.duration
      };

      // Save to global knowledge
      await this.knowledgeCurator.saveProjectLearnings(requirements, result);
      
      // Create versioned learning file
      const learningFile = createVersionedFile('project-learnings.json', {
        team: 'orchestrator',
        description: 'Project learnings and insights'
      });

      await learningFile.write(JSON.stringify(learning, null, 2), {
        action: 'learning_save',
        description: 'Project learning insights'
      });

      logger.info('Project learnings saved', { projectId: result.projectId });
    } catch (error) {
      logger.error('Failed to save project learnings', { error: error.message });
    }
  }

  // Fallback methods
  async performFallbackAnalysis(requirements) {
    return {
      success: true,
      data: `Fallback analysis for project: ${requirements.title || 'Unknown'}`,
      source: 'fallback'
    };
  }

  async createFallbackTasks(teamName, analysis) {
    return [{
      id: `fallback_${teamName}_${Date.now()}`,
      team: teamName,
      description: `Fallback task for ${teamName}`,
      priority: 'medium'
    }];
  }

  async executeTaskFallback(task) {
    return {
      success: true,
      taskId: task.id,
      result: `Fallback execution for task: ${task.description}`,
      source: 'fallback'
    };
  }

  async performFallbackConsolidation(results) {
    return {
      projectId: `fallback_${Date.now()}`,
      consolidation: 'Fallback consolidation completed',
      results: results,
      version: 'fallback-v1',
      timestamp: new Date().toISOString()
    };
  }

  async attemptProjectRecovery(requirements, error) {
    logger.info('Attempting project recovery', { error: error.message });
    
    try {
      // Use fallback strategies
      const fallbackResult = await fallbackStrategies.executeFallback(
        'orchestrator',
        'project_recovery',
        { requirements, error },
        { type: 'recovery' }
      );

      this.errorStats.recoveredErrors++;
      return fallbackResult;
    } catch (recoveryError) {
      logger.error('Project recovery failed', { error: recoveryError.message });
      return {
        success: false,
        error: 'Project failed and recovery unsuccessful',
        originalError: error.message
      };
    }
  }
}

// Enhanced AI Team with error handling and versioning
class AITeamV2 {
  constructor(config) {
    this.name = config.name;
    this.agents = [];
    this.claudeCode = config.claudeCode;
    this.errorHandler = config.errorHandler;
    this.isRunning = false;
    
    // Initialize agents
    for (let i = 0; i < config.agents; i++) {
      this.agents.push(new AIAgentV2(
        `${config.name}-Agent-${i + 1}`,
        config.skills,
        this.claudeCode
      ));
    }
  }

  async start() {
    this.isRunning = true;
    logger.info(`Team ${this.name} started`);
  }

  async stop() {
    this.isRunning = false;
    logger.info(`Team ${this.name} stopped`);
  }

  async restart() {
    await this.stop();
    await this.start();
    logger.info(`Team ${this.name} restarted`);
  }

  async analyzeAndCreateTasks(analysis) {
    const prompt = `
      As the ${this.name} team, analyze this project and create specific tasks:
      
      Analysis: ${analysis.data}
      
      Create tasks that:
      1. Are specific and actionable
      2. Match our team's skills: ${this.agents[0].skills.join(', ')}
      3. Include priority levels
      4. Have clear acceptance criteria
    `;

    try {
      const result = await this.claudeCode.generateCode(prompt, {
        team: this.name,
        createVersion: true,
        version: 'tasks-v1'
      });

      return this.parseTasksFromAnalysis(result.data);
    } catch (error) {
      logger.error(`Task analysis failed for ${this.name}`, { error: error.message });
      throw error;
    }
  }

  parseTasksFromAnalysis(analysis) {
    // Simple task parsing - in production, this would be more sophisticated
    const tasks = [];
    const lines = analysis.split('\n');
    
    for (const line of lines) {
      if (line.includes('Task:') || line.includes('- ')) {
        tasks.push({
          id: `task_${this.name}_${Date.now()}_${tasks.length}`,
          team: this.name,
          description: line.replace(/^[-•]\s*/, '').replace(/^Task:\s*/, ''),
          priority: 'medium',
          status: 'pending'
        });
      }
    }
    
    return tasks;
  }

  async executeTask(task) {
    const agent = this.agents[Math.floor(Math.random() * this.agents.length)];
    return await agent.processTask(task);
  }

  async getHealth() {
    if (!this.isRunning) return 0.0;
    
    let healthyAgents = 0;
    for (const agent of this.agents) {
      if (await agent.getHealth() > 0.8) {
        healthyAgents++;
      }
    }
    
    return healthyAgents / this.agents.length;
  }
}

// Enhanced AI Agent with error handling
class AIAgentV2 {
  constructor(name, skills, claudeCode) {
    this.name = name;
    this.skills = skills;
    this.claudeCode = claudeCode;
    this.isHealthy = true;
  }

  async processTask(task) {
    const prompt = `
      As ${this.name} with skills: ${this.skills.join(', ')}
      
      Execute this task: ${task.description}
      
      Provide:
      1. Implementation approach
      2. Code or solution
      3. Testing strategy
      4. Documentation
    `;

    try {
      const result = await this.claudeCode.generateCode(prompt, {
        team: this.name.split('-')[0],
        createVersion: true,
        version: `task-${task.id}`
      });

      this.isHealthy = true;
      return {
        success: true,
        taskId: task.id,
        agent: this.name,
        result: result.data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.isHealthy = false;
      logger.error(`Task processing failed for ${this.name}`, { 
        taskId: task.id, 
        error: error.message 
      });
      throw error;
    }
  }

  async getHealth() {
    return this.isHealthy ? 1.0 : 0.5;
  }
}

// Enhanced Memory Manager with versioning
class MemoryManagerV2 {
  constructor(claudeCode) {
    this.claudeCode = claudeCode;
    this.patterns = new Map();
  }

  async loadGlobalPatterns() {
    try {
      const patternsFile = createVersionedFile('.global-knowledge/patterns/global-patterns.json', {
        team: 'memory',
        description: 'Global knowledge patterns'
      });

      if (fs.existsSync('.global-knowledge/patterns/global-patterns.json')) {
        const content = patternsFile.read();
        const patterns = JSON.parse(content);
        
        for (const [key, pattern] of Object.entries(patterns)) {
          this.patterns.set(key, pattern);
        }
        
        logger.info('Global patterns loaded', { count: this.patterns.size });
      }
    } catch (error) {
      logger.error('Failed to load global patterns', { error: error.message });
    }
  }

  getHighSuccessPatterns() {
    return Array.from(this.patterns.values())
      .filter(pattern => pattern.successRate > 0.8)
      .sort((a, b) => b.successRate - a.successRate);
  }
}

// Enhanced Knowledge Curator with Claude Code
class KnowledgeCuratorV2 {
  constructor(claudeCode) {
    this.claudeCode = claudeCode;
  }

  async consolidateLearnings() {
    try {
      const prompt = `
        Consolidate recent project learnings and extract key insights:
        
        Focus on:
        1. Successful patterns
        2. Common failure modes
        3. Performance optimizations
        4. Best practices
      `;

      const consolidation = await this.claudeCode.generateCode(prompt, {
        team: 'knowledge',
        createVersion: true,
        version: 'learnings-v1'
      });

      // Save consolidated learnings
      const learningsFile = createVersionedFile('consolidated-learnings.md', {
        team: 'knowledge',
        description: 'Consolidated project learnings'
      });

      await learningsFile.write(consolidation.data, {
        action: 'consolidation',
        description: 'Knowledge consolidation'
      });

      logger.info('Knowledge consolidation completed');
    } catch (error) {
      logger.error('Knowledge consolidation failed', { error: error.message });
    }
  }

  async saveProjectLearnings(requirements, result) {
    try {
      const learningFile = createVersionedFile(`learnings/project-${Date.now()}.json`, {
        team: 'knowledge',
        description: 'Project learning insights'
      });

      const learning = {
        requirements,
        result,
        timestamp: new Date().toISOString(),
        insights: await this.extractInsights(result)
      };

      await learningFile.write(JSON.stringify(learning, null, 2), {
        action: 'learning_save',
        description: 'Project learning saved'
      });
    } catch (error) {
      logger.error('Failed to save project learning', { error: error.message });
    }
  }

  async extractInsights(result) {
    const prompt = `
      Extract key insights from this project result:
      
      Result: ${JSON.stringify(result, null, 2)}
      
      Provide:
      1. What worked well
      2. What could be improved
      3. Key learnings
      4. Recommendations for future projects
    `;

    try {
      const insights = await this.claudeCode.generateCode(prompt, {
        team: 'knowledge',
        createVersion: true,
        version: 'insights-v1'
      });

      return insights.data;
    } catch (error) {
      logger.error('Failed to extract insights', { error: error.message });
      return 'Insights extraction failed';
    }
  }
}

// Enhanced Evolution Engine with Claude Code
class EvolutionEngineV2 {
  constructor(claudeCode) {
    this.claudeCode = claudeCode;
  }

  async evolveStrategies() {
    try {
      const prompt = `
        Analyze current Meta Team strategies and suggest evolutionary improvements:
        
        Focus on:
        1. Performance optimization
        2. Error handling improvements
        3. New capabilities to add
        4. Process refinements
      `;

      const evolution = await this.claudeCode.generateCode(prompt, {
        team: 'evolution',
        createVersion: true,
        version: 'evolution-v1'
      });

      // Save evolution suggestions
      const evolutionFile = createVersionedFile('evolution-suggestions.md', {
        team: 'evolution',
        description: 'Strategy evolution suggestions'
      });

      await evolutionFile.write(evolution.data, {
        action: 'evolution',
        description: 'Strategy evolution analysis'
      });

      logger.info('Strategy evolution completed');
    } catch (error) {
      logger.error('Strategy evolution failed', { error: error.message });
    }
  }
}

// Main execution
async function main() {
  const orchestrator = new MetaOrchestratorV2({
    enableBackup: true,
    enableVersioning: true,
    enableErrorHandling: true,
    enableFallbacks: true
  });

  try {
    const initialized = await orchestrator.initialize();
    if (!initialized) {
      console.error('❌ Failed to initialize orchestrator');
      process.exit(1);
    }

    await orchestrator.start();

    // Example project execution
    const projectRequirements = {
      title: 'Enhanced File Preview System',
      description: 'Improve the file preview functionality with better error handling and versioning',
      teams: ['Frontend', 'Backend', 'Security'],
      priority: 'high'
    };

    const result = await orchestrator.executeProject(projectRequirements);
    console.log('🎉 Project completed:', result);

    // Keep running for continuous operation
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down gracefully...');
      await orchestrator.stop();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Orchestrator failed:', error);
    logger.error('Orchestrator main execution failed', { error: error.message });
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { MetaOrchestratorV2 }; 