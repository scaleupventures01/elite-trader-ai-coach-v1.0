const fs = require('fs');
const path = require('path');

class MemoryManager {
  constructor() {
    this.episodicMemory = new Map();
    this.semanticMemory = new Map();
    this.proceduralMemory = new Map();
    this.crossTeamMemory = new Map();
  }

  async initialize() {
    console.log('🧠 Initializing Memory Manager...');
    
    // Initialize memory stores
    await this.initializeEpisodicMemory();
    await this.initializeSemanticMemory();
    await this.initializeProceduralMemory();
    await this.initializeCrossTeamMemory();
    
    // Load global patterns
    await this.loadGlobalPatterns();
    
    console.log('✅ Memory Manager initialized');
  }

  async initializeEpisodicMemory() {
    // Initialize episodic memory store
    this.episodicMemory = new Map();
  }

  async initializeSemanticMemory() {
    // Initialize semantic memory store
    this.semanticMemory = new Map();
  }

  async initializeProceduralMemory() {
    // Initialize procedural memory store
    this.proceduralMemory = new Map();
  }

  async initializeCrossTeamMemory() {
    // Initialize cross-team memory store
    this.crossTeamMemory = new Map();
  }

  async storeEpisode(type, content) {
    const episode = {
      id: `${type}_${Date.now()}`,
      type,
      content,
      timestamp: new Date().toISOString(),
      metadata: {
        project: path.basename(process.cwd()),
        team: process.env.TEAM_NAME || 'unknown'
      }
    };

    this.episodicMemory.set(episode.id, episode);
    return episode;
  }

  async getHighRewardEpisodes(teamName) {
    const episodes = Array.from(this.episodicMemory.values());
    return episodes.filter(episode => 
      episode.metadata.team === teamName && 
      episode.content.reward > 0.7
    );
  }

  async getTeamProcedures(teamName) {
    const procedures = Array.from(this.proceduralMemory.values());
    return procedures.filter(procedure => 
      procedure.team === teamName
    );
  }

  async getTeamSemantics(teamName) {
    const semantics = Array.from(this.semanticMemory.values());
    return semantics.filter(semantic => 
      semantic.team === teamName
    );
  }

  async storeTeamUpdate(teamName, update) {
    const episode = await this.storeEpisode('team_update', {
      team: teamName,
      update,
      timestamp: new Date().toISOString()
    });
    return episode;
  }

  async storeCrossTeamSync(syncData) {
    const episode = await this.storeEpisode('cross_team_sync', {
      ...syncData,
      timestamp: new Date().toISOString()
    });
    return episode;
  }

  async updateProceduralMemory(workflows) {
    for (const workflow of workflows) {
      this.proceduralMemory.set(workflow.id, {
        ...workflow,
        timestamp: new Date().toISOString()
      });
    }
  }

  async loadGlobalPatterns() {
    const globalPath = process.env.AI_TEAM_KNOWLEDGE;
    if (!globalPath || !fs.existsSync(globalPath)) {
      console.log('No global knowledge path found');
      return [];
    }

    try {
      const patternsPath = path.join(globalPath, 'patterns');
      const patterns = [];
      const files = await fs.promises.readdir(patternsPath, { recursive: true });
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const content = await fs.promises.readFile(path.join(patternsPath, file), 'utf8');
          patterns.push(...JSON.parse(content));
        }
      }
      
      console.log(`Loaded ${patterns.length} patterns from global knowledge`);
      return patterns;
    } catch (error) {
      console.error('Error loading global patterns:', error);
      return [];
    }
  }

  async saveSuccessfulPattern(pattern) {
    await this.storeEpisode('system', pattern);
    const globalPath = process.env.AI_TEAM_KNOWLEDGE;
    
    if (globalPath) {
      const patternFile = path.join(globalPath, 'patterns', `${pattern.type}_patterns.json`);
      let existingPatterns = [];
      
      if (fs.existsSync(patternFile)) {
        existingPatterns = JSON.parse(await fs.promises.readFile(patternFile, 'utf8'));
      }
      
      existingPatterns.push({
        ...pattern,
        project: path.basename(process.cwd()),
        timestamp: new Date().toISOString()
      });
      
      await fs.promises.writeFile(patternFile, JSON.stringify(existingPatterns, null, 2));
    }
  }
}

module.exports = MemoryManager; 