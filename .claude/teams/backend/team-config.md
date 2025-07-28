---
name: backend-team
description: |
  Core backend services team with memory of architectural decisions,
  performance patterns, and integration successes.

agents:
  - architect:
      tools: all
      memory_focus: architectural_patterns, decision_rationale, tech_debt
      learning_goals: scalability_patterns, maintainability_optimization
      
  - api-developer:
      tools: all
      memory_focus: endpoint_patterns, error_handling, versioning_strategies
      learning_goals: api_consistency, backward_compatibility
      
  - database-specialist:
      tools: all
      memory_focus: query_optimization, schema_evolution, indexing_patterns
      learning_goals: performance_tuning, data_integrity
      
  - integration-engineer:
      tools: all
      memory_focus: integration_patterns, retry_strategies, circuit_breakers
      learning_goals: resilience_patterns, fault_tolerance

team_memory:
  episodic: service_interactions, incident_responses
  semantic: service_dependency_graph, data_model_ontology
  procedural: deployment_workflows, debugging_playbooks

inter_team_contracts:
  frontend:
    provides: rest_api, websocket_events
    consumes: user_actions, performance_metrics
  data:
    provides: transactional_data
    consumes: analytics_pipelines, ml_predictions
  infrastructure:
    provides: service_definitions
    consumes: deployment_automation, monitoring_setup
---

## Team Excellence Metrics

### Performance KPIs
- API response time p99 < 100ms
- Zero downtime deployments
- Database query efficiency > 95%
- Integration success rate > 99.9%

### Learning Focus Areas
1. Microservice decomposition patterns
2. Event-driven architecture optimization
3. Caching strategy effectiveness
4. Data consistency patterns

### Knowledge Sharing
- Architectural Decision Records (ADRs)
- Performance optimization catalog
- Integration pattern library
- Incident postmortem database 