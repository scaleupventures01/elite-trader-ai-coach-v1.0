---
name: frontend-team
description: |
  Specialized team for all frontend development with persistent memory
  of UI patterns, performance optimizations, and user interactions.
  
agents:
  - ui-ux-designer:
      tools: file_read, file_write, search_files, memory_access, figma_api
      memory_focus: design_patterns, user_feedback, accessibility
      learning_goals: optimal_ux_patterns, conversion_optimization
      
  - react-developer:
      tools: all
      memory_focus: component_patterns, performance_tricks, state_management
      learning_goals: code_reusability, render_optimization
      
  - accessibility-specialist:
      tools: file_read, file_write, terminal, a11y_tools
      memory_focus: wcag_compliance, assistive_tech_patterns
      learning_goals: inclusive_design_patterns
      
  - performance-engineer:
      tools: all
      memory_focus: optimization_patterns, bottleneck_solutions
      learning_goals: load_time_reduction, interaction_responsiveness

team_memory:
  episodic: frontend_interactions
  semantic: ui_component_graph, design_system_ontology
  procedural: responsive_workflows, optimization_playbooks

inter_team_contracts:
  backend:
    protocol: rest_api
    format: openapi_3.0
    sync_pattern: async_with_polling
  data:
    protocol: graphql
    format: schema_first
    sync_pattern: subscription_based
---

## Team Coordination Protocol

### Intra-Team Communication
- Daily sync via shared memory
- Component library updates broadcast
- Design token changes propagated
- Performance regression alerts

### Inter-Team Interfaces
1. Backend API Contract
   - Versioned endpoints
   - Type-safe interfaces
   - Error handling standards

2. Data Team Integration
   - Real-time data subscriptions
   - Analytics event contracts
   - Performance metrics sharing

### Learning Objectives
- Reduce Time to Interactive (TTI) by 50%
- Improve accessibility score to 100
- Optimize component reuse to 80%
- Minimize bundle size growth

### Memory Utilization Strategy
- Cache successful optimization patterns
- Learn from user interaction data
- Build knowledge graph of UI patterns
- Transfer learnings to mobile team 