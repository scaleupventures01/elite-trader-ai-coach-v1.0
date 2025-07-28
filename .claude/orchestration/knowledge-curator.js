class KnowledgeCurator {
  constructor(memoryManager, teams) {
    this.memory = memoryManager;
    this.teams = teams;
    this.knowledgeGraph = new Map();
    this.transferQueue = [];
  }

  async performCrossTeamLearning() {
    console.log('🧠 Knowledge Curator: Starting cross-team learning cycle...');
    
    // Phase 1: Collect learnings from all teams
    const teamLearnings = await this.collectTeamLearnings();
    
    // Phase 2: Identify transferable patterns
    const patterns = await this.identifyTransferablePatterns(teamLearnings);
    
    // Phase 3: Enrich patterns with context
    const enrichedPatterns = await this.enrichPatterns(patterns);
    
    // Phase 4: Distribute to relevant teams
    await this.distributeKnowledge(enrichedPatterns);
    
    // Phase 5: Update global knowledge base
    await this.updateGlobalKnowledge(enrichedPatterns);
    
    // Phase 6: Generate insights report
    const insights = await this.generateInsights(enrichedPatterns);
    
    return insights;
  }

  async collectTeamLearnings() {
    const learnings = new Map();
    
    for (const [teamName, team] of this.teams) {
      // Get episodic memories with high rewards
      const successfulEpisodes = await this.memory.getHighRewardEpisodes(teamName);
      
      // Extract patterns from procedural memory
      const procedures = await this.memory.getTeamProcedures(teamName);
      
      // Get semantic relationships
      const semantics = await this.memory.getTeamSemantics(teamName);
      
      learnings.set(teamName, {
        episodes: successfulEpisodes,
        procedures: procedures,
        semantics: semantics,
        metadata: await team.getMetadata()
      });
    }
    
    return learnings;
  }

  async identifyTransferablePatterns(teamLearnings) {
    const patterns = [];
    
    // Look for similar patterns across teams
    for (const [team1, learning1] of teamLearnings) {
      for (const [team2, learning2] of teamLearnings) {
        if (team1 !== team2) {
          const similarities = await this.findSimilarities(learning1, learning2);
          
          if (similarities.score > 0.7) {
            patterns.push({
              type: 'cross_team_pattern',
              teams: [team1, team2],
              pattern: similarities.pattern,
              confidence: similarities.score,
              applications: similarities.applications
            });
          }
        }
      }
    }
    
    // Identify meta-patterns
    const metaPatterns = await this.identifyMetaPatterns(patterns);
    patterns.push(...metaPatterns);
    
    return patterns;
  }

  async findSimilarities(learning1, learning2) {
    // Use semantic similarity to find common patterns
    const semanticSimilarity = await this.calculateSemanticSimilarity(
      learning1.semantics, 
      learning2.semantics
    );
    
    // Find procedural overlaps
    const proceduralOverlap = await this.findProceduralOverlap(
      learning1.procedures,
      learning2.procedures
    );
    
    // Calculate overall similarity score
    const score = (semanticSimilarity * 0.6) + (proceduralOverlap * 0.4);
    
    return {
      score,
      pattern: await this.extractCommonPattern(learning1, learning2),
      applications: await this.identifyApplications(learning1, learning2)
    };
  }

  async identifyMetaPatterns(patterns) {
    const metaPatterns = [];
    
    // Group patterns by type and find higher-order patterns
    const patternGroups = await this.groupPatterns(patterns);
    
    for (const [groupType, groupPatterns] of patternGroups) {
      if (groupPatterns.length >= 3) {
        const metaPattern = await this.synthesizeMetaPattern(groupPatterns);
        metaPatterns.push(metaPattern);
      }
    }
    
    return metaPatterns;
  }

  async enrichPatterns(patterns) {
    for (const pattern of patterns) {
      // Add context from team metadata
      pattern.context = await this.addContext(pattern);
      
      // Calculate impact metrics
      pattern.impact = await this.calculateImpact(pattern);
      
      // Add implementation guidance
      pattern.implementation = await this.generateImplementationGuide(pattern);
      
      // Add success criteria
      pattern.successCriteria = await this.defineSuccessCriteria(pattern);
    }
    
    return patterns;
  }

  async distributeKnowledge(patterns) {
    for (const pattern of patterns) {
      // Determine which teams would benefit
      const targetTeams = await this.identifyBeneficiaries(pattern);
      
      for (const teamName of targetTeams) {
        const team = this.teams.get(teamName);
        
        // Adapt pattern to team's context
        const adaptedPattern = await this.adaptPattern(pattern, teamName);
        
        // Inject into team's memory
        await team.ingestKnowledge(adaptedPattern);
        
        // Track transfer
        this.transferQueue.push({
          pattern: pattern.id,
          from: pattern.teams,
          to: teamName,
          timestamp: Date.now(),
          status: 'transferred'
        });
      }
    }
  }

  async identifyBeneficiaries(pattern) {
    const beneficiaries = [];
    
    for (const [teamName, team] of this.teams) {
      // Check if team could benefit from this pattern
      const relevanceScore = await this.calculateRelevance(pattern, team);
      
      if (relevanceScore > 0.6) {
        beneficiaries.push(teamName);
      }
    }
    
    return beneficiaries;
  }

  async adaptPattern(pattern, teamName) {
    const team = this.teams.get(teamName);
    const teamContext = await team.getContext();
    
    // Adapt the pattern to team's specific domain
    const adaptedPattern = {
      ...pattern,
      implementation: await this.customizeImplementation(pattern, teamContext),
      examples: await this.generateTeamSpecificExamples(pattern, teamName),
      constraints: await this.identifyTeamConstraints(pattern, teamName)
    };
    
    return adaptedPattern;
  }

  async updateGlobalKnowledge(patterns) {
    // Update the global knowledge graph
    for (const pattern of patterns) {
      await this.knowledgeGraph.set(pattern.id, {
        ...pattern,
        globalUsage: 0,
        successRate: 0,
        lastUpdated: Date.now()
      });
    }
    
    // Consolidate similar patterns
    await this.consolidatePatterns();
    
    // Update pattern relationships
    await this.updatePatternRelationships();
  }

  async generateInsights(patterns) {
    return {
      summary: `Discovered ${patterns.length} transferable patterns`,
      topPatterns: patterns.slice(0, 5).map(p => ({
        name: p.pattern.name,
        impact: p.pattern.impact,
        adoption: p.applications.length
      })),
      recommendations: await this.generateRecommendations(patterns),
      metrics: {
        knowledgeVelocity: this.calculateKnowledgeVelocity(),
        reuseRate: this.calculateReuseRate(),
        innovationIndex: this.calculateInnovationIndex()
      }
    };
  }

  async generateRecommendations(patterns) {
    const recommendations = [];
    
    // High-impact patterns that should be prioritized
    const highImpactPatterns = patterns.filter(p => p.impact > 0.8);
    if (highImpactPatterns.length > 0) {
      recommendations.push({
        type: 'priority_adoption',
        patterns: highImpactPatterns.slice(0, 3),
        rationale: 'High-impact patterns with proven success'
      });
    }
    
    // Teams that could benefit from specific patterns
    for (const pattern of patterns.slice(0, 5)) {
      const underutilizedTeams = await this.findUnderutilizedTeams(pattern);
      if (underutilizedTeams.length > 0) {
        recommendations.push({
          type: 'targeted_distribution',
          pattern: pattern,
          teams: underutilizedTeams,
          rationale: 'Teams with low adoption of proven patterns'
        });
      }
    }
    
    return recommendations;
  }

  calculateKnowledgeVelocity() {
    // Calculate how quickly knowledge is being generated and shared
    const transfersPerHour = this.transferQueue.filter(
      t => Date.now() - t.timestamp < 3600000
    ).length;
    
    return transfersPerHour;
  }

  calculateReuseRate() {
    // Calculate percentage of patterns that are reused across teams
    const uniquePatterns = new Set(this.transferQueue.map(t => t.pattern));
    const totalTransfers = this.transferQueue.length;
    
    return totalTransfers / uniquePatterns.size;
  }

  calculateInnovationIndex() {
    // Calculate innovation based on new pattern discovery rate
    const newPatternsThisWeek = this.transferQueue.filter(
      t => Date.now() - t.timestamp < 604800000
    ).length;
    
    return newPatternsThisWeek / 7; // Daily average
  }
}

module.exports = KnowledgeCurator; 