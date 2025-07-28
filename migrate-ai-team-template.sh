#!/bin/bash
# AI Team Template Migration Script
# Generated on: 2025-07-28T17:51:41.921Z

echo "🚀 Starting AI Team Template Migration..."

# Create directories if they don't exist
mkdir -p .claude
mkdir -p scripts/verification
mkdir -p teams
mkdir -p config
mkdir -p templates
mkdir -p frameworks

# Copy files to appropriate directories
cp -r ".claude/agents/dev-persona.md" .claude/
cp -r ".claude/agents/meta-team-persona.md" .claude/
cp -r ".claude/agents/pm-persona.md" .claude/
cp -r ".claude/agents/qa-persona.md" .claude/
cp -r ".claude/commands/build.md" .claude/
cp -r ".claude/commands/global-status.md" .claude/
cp -r ".claude/commands/init-meta-team.md" .claude/
cp -r ".claude/commands/next.md" .claude/
cp -r ".claude/commands/verify.md" .claude/
cp -r ".claude/hooks/claim-interceptor.js" .claude/
cp -r ".claude/hooks/verify-claims.js" .claude/
cp -r ".claude/learning/evolution-engine.js" .claude/
cp -r ".claude/learning/honesty-reinforcement.js" .claude/
cp -r ".claude/logs/honesty-memory.json" .claude/
cp -r ".claude/logs/honesty-patterns.json" .claude/
cp -r ".claude/logs/honesty-stats.json" .claude/
cp -r ".claude/logs/interceptions.json" .claude/
cp -r ".claude/logs/verification-log.json" .claude/
cp -r ".claude/logs/violations-log.json" .claude/
cp -r ".claude/memory/memory-manager.js" .claude/
cp -r ".claude/middleware/truth-enforcer.js" .claude/
cp -r ".claude/orchestration/knowledge-curator.js" .claude/
cp -r ".claude/orchestration/meta-orchestrator.js" .claude/
cp -r ".claude/settings.json" .claude/
cp -r ".claude/teams/backend/team-config.md" .claude/
cp -r ".claude/teams/frontend/team-config.md" .claude/
cp -r ".claude/verification/verification-rules.md" .claude/
cp "CLAUDE_META.md" .
cp "claude-fixes-export/ai-templates/CLAUDE_META.md" .
cp "claude-fixes-export/ai-templates/meta-team-api-key-manager.js" scripts/
cp "claude-fixes-export/ai-templates/meta-team-claude-code-comprehensive-retrospective.js" scripts/
cp "claude-fixes-export/ai-templates/meta-team-claude-code-final-retrospective.js" scripts/
cp "claude-fixes-export/ai-templates/meta-team-claude-code-fix-implementation.js" scripts/
cp "claude-fixes-export/ai-templates/meta-team-claude-code-fix.js" scripts/
cp "claude-fixes-export/ai-templates/meta-team-claude-code-fixes.js" scripts/
cp "claude-fixes-export/ai-templates/meta-team-claude-code-usage-investigation.js" scripts/
cp "claude-fixes-export/ai-templates/meta-team-claude-code-usage-retrospective.js" scripts/
cp -r "claude-fixes-export/ai-templates/meta-team-claude-version-verification.js" scripts/verification/
cp "claude-fixes-export/ai-templates/meta-team-code-review-and-refactor.js" scripts/
cp "claude-fixes-export/ai-templates/meta-team-corrected-claude-config.js" scripts/
cp "claude-fixes-export/ai-templates/meta-team-demo.js" scripts/
cp "claude-fixes-export/ai-templates/meta-team-file-preview.js" scripts/
cp "claude-fixes-export/ai-templates/meta-team-header-image-task.js" scripts/
cp "claude-fixes-export/ai-templates/meta-team-high-priority-implementation.js" scripts/
cp "claude-fixes-export/ai-templates/meta-team-improvement-planning.js" scripts/
cp "claude-fixes-export/ai-templates/meta-team-medium-priority-implementation.js" scripts/
cp "claude-fixes-export/ai-templates/meta-team-root-cause-analysis.js" scripts/
cp "claude-fixes-export/ai-templates/meta-team-upload-page-fixed.js" scripts/
cp "claude-fixes-export/ai-templates/meta-team-upload-page.js" scripts/
cp "claude-fixes-export/ai-templates/meta-team-with-activity-tracker-demo.js" scripts/
cp "claude-fixes-export/ai-templates/scripts/meta-team-orchestrator-v2.js" scripts/
cp "claude-fixes-export/ai-templates/scripts/meta-team-orchestrator-v3.js" scripts/
cp "claude-fixes-export/ai-templates/scripts/meta-team-orchestrator-v4.js" scripts/
cp "claude-fixes-export/implementations/CLAUDE_META.md" .
cp -r "claude-fixes-export/implementations/ai002-verification-process-update.js" scripts/verification/
cp "claude-fixes-export/implementations/meta-team-action-items-implementer.js" scripts/
cp "claude-fixes-export/implementations/meta-team-api-key-manager.js" scripts/
cp "claude-fixes-export/implementations/meta-team-claude-code-comprehensive-retrospective.js" scripts/
cp "claude-fixes-export/implementations/meta-team-claude-code-final-retrospective.js" scripts/
cp "claude-fixes-export/implementations/meta-team-claude-code-fix-implementation.js" scripts/
cp "claude-fixes-export/implementations/meta-team-claude-code-fix.js" scripts/
cp "claude-fixes-export/implementations/meta-team-claude-code-fixes.js" scripts/
cp "claude-fixes-export/implementations/meta-team-claude-code-usage-investigation.js" scripts/
cp "claude-fixes-export/implementations/meta-team-claude-code-usage-retrospective.js" scripts/
cp -r "claude-fixes-export/implementations/meta-team-claude-version-verification.js" scripts/verification/
cp "claude-fixes-export/implementations/meta-team-code-review-and-refactor.js" scripts/
cp "claude-fixes-export/implementations/meta-team-corrected-claude-config.js" scripts/
cp "claude-fixes-export/implementations/meta-team-demo.js" scripts/
cp "claude-fixes-export/implementations/meta-team-file-preview.js" scripts/
cp "claude-fixes-export/implementations/meta-team-header-image-task.js" scripts/
cp "claude-fixes-export/implementations/meta-team-high-priority-implementation.js" scripts/
cp "claude-fixes-export/implementations/meta-team-improvement-planning.js" scripts/
cp "claude-fixes-export/implementations/meta-team-medium-priority-implementation.js" scripts/
cp "claude-fixes-export/implementations/meta-team-root-cause-analysis.js" scripts/
cp "claude-fixes-export/implementations/meta-team-upload-page-fixed.js" scripts/
cp "claude-fixes-export/implementations/meta-team-upload-page.js" scripts/
cp "claude-fixes-export/implementations/meta-team-with-activity-tracker-demo.js" scripts/
cp "claude-fixes-export/implementations/scripts/meta-team-orchestrator-v2.js" scripts/
cp "claude-fixes-export/implementations/scripts/meta-team-orchestrator-v3.js" scripts/
cp "claude-fixes-export/implementations/scripts/meta-team-orchestrator-v4.js" scripts/
cp "claude-fixes-export/lessons-learned/meta-team-claude-code-comprehensive-retrospective.js" scripts/
cp "claude-fixes-export/lessons-learned/meta-team-claude-code-final-retrospective.js" scripts/
cp "claude-fixes-export/lessons-learned/meta-team-claude-code-fixes.js" scripts/
cp "claude-fixes-export/lessons-learned/meta-team-claude-code-usage-investigation.js" scripts/
cp "claude-fixes-export/lessons-learned/meta-team-claude-code-usage-retrospective.js" scripts/
cp "claude-fixes-export/lessons-learned/meta-team-claude-version-retrospective.js" scripts/
cp -r "config/claude-code-config-backup-2025-07-28T02-35-06-191Z.js" config/
cp -r "implementations/ai002-verification-process-update.js" scripts/verification/
cp "implementations/meta-team-action-items-implementer.js" scripts/
cp "meta-team-actual-file-reorganization.js" scripts/
cp "meta-team-api-key-manager.js" scripts/
cp "meta-team-claude-code-comprehensive-retrospective.js" scripts/
cp "meta-team-claude-code-final-retrospective.js" scripts/
cp "meta-team-claude-code-fix-implementation.js" scripts/
cp "meta-team-claude-code-fix.js" scripts/
cp "meta-team-claude-code-fixes.js" scripts/
cp "meta-team-claude-code-usage-investigation.js" scripts/
cp "meta-team-claude-code-usage-retrospective.js" scripts/
cp "meta-team-code-review-and-refactor.js" scripts/
cp "meta-team-demo.js" scripts/
cp "meta-team-file-preview.js" scripts/
cp "meta-team-header-image-task.js" scripts/
cp "meta-team-high-priority-implementation.js" scripts/
cp "meta-team-improvement-planning.js" scripts/
cp "meta-team-medium-priority-implementation.js" scripts/
cp "meta-team-prd-analysis.js" scripts/
cp "meta-team-push-organization/ai-team-learnings/meta-team-claude-code-comprehensive-retrospective.js" scripts/
cp "meta-team-push-organization/ai-team-learnings/meta-team-claude-code-final-retrospective.js" scripts/
cp "meta-team-push-organization/ai-team-learnings/meta-team-claude-code-fixes.js" scripts/
cp "meta-team-push-organization/ai-team-learnings/meta-team-claude-code-usage-investigation.js" scripts/
cp "meta-team-push-organization/ai-team-learnings/meta-team-claude-code-usage-retrospective.js" scripts/
cp "meta-team-push-organization/ai-team-learnings/meta-team-claude-version-retrospective.js" scripts/
cp -r "meta-team-push-organization/ai-team-learnings/verification-process-update-2025-07-28T02-35-06-600Z.json" scripts/verification/
cp "meta-team-push-organization/ai-team-template/CLAUDE_META.md" .
cp -r "meta-team-push-organization/ai-team-template/ai002-verification-process-update.js" scripts/verification/
cp "meta-team-push-organization/ai-team-template/meta-team-action-items-implementer.js" scripts/
cp "meta-team-push-organization/ai-team-template/meta-team-api-key-manager.js" scripts/
cp "meta-team-push-organization/ai-team-template/meta-team-claude-4-api-test.js" scripts/
cp "meta-team-push-organization/ai-team-template/meta-team-claude-code-comprehensive-retrospective.js" scripts/
cp "meta-team-push-organization/ai-team-template/meta-team-claude-code-final-retrospective.js" scripts/
cp "meta-team-push-organization/ai-team-template/meta-team-claude-code-fix-implementation.js" scripts/
cp "meta-team-push-organization/ai-team-template/meta-team-claude-code-fix.js" scripts/
cp "meta-team-push-organization/ai-team-template/meta-team-claude-code-fixes.js" scripts/
cp "meta-team-push-organization/ai-team-template/meta-team-claude-code-usage-investigation.js" scripts/
cp "meta-team-push-organization/ai-team-template/meta-team-claude-code-usage-retrospective.js" scripts/
cp -r "meta-team-push-organization/ai-team-template/meta-team-claude-version-verification.js" scripts/verification/
cp "meta-team-push-organization/ai-team-template/meta-team-code-review-and-refactor.js" scripts/
cp "meta-team-push-organization/ai-team-template/meta-team-corrected-claude-config.js" scripts/
cp "meta-team-push-organization/ai-team-template/meta-team-demo.js" scripts/
cp "meta-team-push-organization/ai-team-template/meta-team-enhanced-prd-analysis.js" scripts/
cp "meta-team-push-organization/ai-team-template/meta-team-file-preview.js" scripts/
cp "meta-team-push-organization/ai-team-template/meta-team-header-image-task.js" scripts/
cp "meta-team-push-organization/ai-team-template/meta-team-high-priority-implementation.js" scripts/
cp "meta-team-push-organization/ai-team-template/meta-team-improvement-planning.js" scripts/
cp "meta-team-push-organization/ai-team-template/meta-team-medium-priority-implementation.js" scripts/
cp "meta-team-push-organization/ai-team-template/meta-team-roadmap-planner.js" scripts/
cp "meta-team-push-organization/ai-team-template/meta-team-root-cause-analysis.js" scripts/
cp "meta-team-push-organization/ai-team-template/meta-team-sprint-executor.js" scripts/
cp "meta-team-push-organization/ai-team-template/meta-team-sprint-planner.js" scripts/
cp "meta-team-push-organization/ai-team-template/meta-team-upload-page-fixed.js" scripts/
cp "meta-team-push-organization/ai-team-template/meta-team-upload-page.js" scripts/
cp "meta-team-push-organization/ai-team-template/meta-team-with-activity-tracker-demo.js" scripts/
cp "meta-team-push-organization/ai-team-template/scripts/meta-team-orchestrator-v2.js" scripts/
cp "meta-team-push-organization/ai-team-template/scripts/meta-team-orchestrator-v3.js" scripts/
cp "meta-team-push-organization/ai-team-template/scripts/meta-team-orchestrator-v4.js" scripts/
cp "meta-team-push-organization/main-project/CLAUDE_META.md" .
cp "meta-team-push-organization/main-project/meta-team-api-key-manager.js" scripts/
cp "meta-team-push-organization/main-project/meta-team-claude-code-comprehensive-retrospective.js" scripts/
cp "meta-team-push-organization/main-project/meta-team-claude-code-final-retrospective.js" scripts/
cp "meta-team-push-organization/main-project/meta-team-claude-code-fix-implementation.js" scripts/
cp "meta-team-push-organization/main-project/meta-team-claude-code-fix.js" scripts/
cp "meta-team-push-organization/main-project/meta-team-claude-code-fixes.js" scripts/
cp "meta-team-push-organization/main-project/meta-team-claude-code-usage-investigation.js" scripts/
cp "meta-team-push-organization/main-project/meta-team-claude-code-usage-retrospective.js" scripts/
cp "meta-team-push-organization/main-project/meta-team-code-review-and-refactor.js" scripts/
cp "meta-team-push-organization/main-project/meta-team-create-detailed-roadmap.js" scripts/
cp "meta-team-push-organization/main-project/meta-team-create-roadmap-file.js" scripts/
cp "meta-team-push-organization/main-project/meta-team-demo.js" scripts/
cp "meta-team-push-organization/main-project/meta-team-enhanced-prd-analysis.js" scripts/
cp "meta-team-push-organization/main-project/meta-team-file-preview.js" scripts/
cp "meta-team-push-organization/main-project/meta-team-header-image-task.js" scripts/
cp "meta-team-push-organization/main-project/meta-team-high-priority-implementation.js" scripts/
cp "meta-team-push-organization/main-project/meta-team-improvement-planning.js" scripts/
cp "meta-team-push-organization/main-project/meta-team-medium-priority-implementation.js" scripts/
cp "meta-team-push-organization/main-project/meta-team-orchestrator-v2.js" scripts/
cp "meta-team-push-organization/main-project/meta-team-orchestrator-v3.js" scripts/
cp "meta-team-push-organization/main-project/meta-team-orchestrator-v4.js" scripts/
cp "meta-team-push-organization/main-project/meta-team-prd-analysis.js" scripts/
cp "meta-team-push-organization/main-project/meta-team-roadmap-planner.js" scripts/
cp "meta-team-push-organization/main-project/meta-team-root-cause-analysis.js" scripts/
cp "meta-team-push-organization/main-project/meta-team-upload-page-fixed.js" scripts/
cp "meta-team-push-organization/main-project/meta-team-upload-page.js" scripts/
cp "meta-team-push-organization/main-project/meta-team-with-activity-tracker-demo.js" scripts/
cp "meta-team-push-organization/main-project/scripts/meta-team-orchestrator-v2.js" scripts/
cp "meta-team-push-organization/main-project/scripts/meta-team-orchestrator-v3.js" scripts/
cp "meta-team-push-organization/main-project/scripts/meta-team-orchestrator-v4.js" scripts/
cp "meta-team-upload-page-fixed.js" scripts/
cp "meta-team-upload-page.js" scripts/
cp "meta-team-with-activity-tracker-demo.js" scripts/
cp -r "metrics-backup/verification-metrics.json" scripts/verification/
cp -r "reports/verification-process-update-2025-07-28T02-35-06-600Z.json" scripts/verification/
cp "scripts/utils/meta-team-ceo-proof-generator.js" scripts/
cp "scripts/utils/meta-team-claude-4-api-test.js" scripts/
cp "scripts/utils/meta-team-claude-version-retrospective.js" scripts/
cp -r "scripts/utils/meta-team-claude-version-verification.js" scripts/verification/
cp "scripts/utils/meta-team-corrected-claude-config.js" scripts/
cp "scripts/utils/meta-team-corrective-actions-executor.js" scripts/
cp "scripts/utils/meta-team-create-detailed-roadmap.js" scripts/
cp "scripts/utils/meta-team-create-roadmap-file.js" scripts/
cp "scripts/utils/meta-team-enhanced-prd-analysis.js" scripts/
cp "scripts/utils/meta-team-file-reorganization.js" scripts/
cp "scripts/utils/meta-team-localhost-status-checker.js" scripts/
cp "scripts/utils/meta-team-orchestrator-v2.js" scripts/
cp "scripts/utils/meta-team-orchestrator-v3.js" scripts/
cp "scripts/utils/meta-team-orchestrator-v4.js" scripts/
cp "scripts/utils/meta-team-qa-failure-response.js" scripts/
cp "scripts/utils/meta-team-roadmap-integrated-sprint-planner.js" scripts/
cp "scripts/utils/meta-team-roadmap-planner.js" scripts/
cp "scripts/utils/meta-team-roadmap-review-sprint-2-planner.js" scripts/
cp "scripts/utils/meta-team-root-cause-analysis.js" scripts/
cp "scripts/utils/meta-team-sprint-1-demo.js" scripts/
cp "scripts/utils/meta-team-sprint-1-executor.js" scripts/
cp "scripts/utils/meta-team-sprint-1-gap-analysis-ceo-demo.js" scripts/
cp "scripts/utils/meta-team-sprint-2-signoff-sprint-3-planning.js" scripts/
cp "scripts/utils/meta-team-sprint-3-demo-detailing.js" scripts/
cp "scripts/utils/meta-team-sprint-deliverables-loader.js" scripts/
cp "scripts/utils/meta-team-sprint-executor.js" scripts/
cp "scripts/utils/meta-team-sprint-planner.js" scripts/
cp "scripts/utils/meta-team-system-fix-implementation.js" scripts/
cp "scripts/utils/meta-team-update-claude-config.js" scripts/
cp -r "scripts/verification/meta-team-verification-integration.js" scripts/verification/
cp -r "scripts/verification/quick-verification-checklist.js" scripts/verification/
cp -r "scripts/verification/truthfulness-enforcer.js" scripts/verification/
cp -r "scripts/verification/truthfulness-monitor.sh" scripts/verification/
cp -r "scripts/verification/verification-check.sh" scripts/verification/
cp -r "test-human-verification-and-learning.js" scripts/verification/
cp -r "verification/claude-verification-2025-07-28T02-18-10-692Z.json" scripts/verification/
cp -r "verification-metrics.json" scripts/verification/
cp -r "verification-output.log" scripts/verification/

echo "✅ AI Team Template migration completed!"
echo "📊 Total files migrated: 219"
