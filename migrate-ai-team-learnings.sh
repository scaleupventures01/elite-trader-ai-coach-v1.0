#!/bin/bash
# AI Team Learnings Migration Script
# Generated on: 2025-07-28T17:51:38.593Z

echo "🚀 Starting AI Team Learnings Migration..."

# Create directories if they don't exist
mkdir -p lessons-learned
mkdir -p retrospectives
mkdir -p implementation-summaries
mkdir -p analysis
mkdir -p corrections
mkdir -p proofs
mkdir -p meta-team-reports
mkdir -p knowledge-base

# Copy files to appropriate directories
cp "ENFORCEMENT_MIDDLEWARE_IMPLEMENTATION_COMPLETE.md" implementation-summaries/
cp "HUMAN_VERIFICATION_AND_LEARNING_IMPLEMENTATION_COMPLETE.md" implementation-summaries/
cp "LESSONS_LEARNED_UPDATE_SUMMARY.md" lessons-learned/
cp "VERIFICATION_HOOKS_IMPLEMENTATION_COMPLETE.md" implementation-summaries/
cp "VERIFICATION_SYSTEM_IMPLEMENTATION_COMPLETE.md" implementation-summaries/
cp -r "analysis/claude-4-resolution-summary.md" analysis/
cp -r "analysis/claude-4-root-cause-analysis-final.md" analysis/
cp -r "analysis/enhanced-meta-team-ai-ml-detailed-planning-2025-07-28T01-49-20-802Z.md" analysis/
cp -r "analysis/enhanced-meta-team-backend-detailed-planning-2025-07-28T01-48-58-936Z.md" analysis/
cp -r "analysis/enhanced-meta-team-cross-team-integration-2025-07-28T01-51-13-739Z.md" analysis/
cp -r "analysis/enhanced-meta-team-data-detailed-planning-2025-07-28T01-49-41-284Z.md" analysis/
cp -r "analysis/enhanced-meta-team-frontend-detailed-planning-2025-07-28T01-48-38-362Z.md" analysis/
cp -r "analysis/enhanced-meta-team-implementation-strategy-2025-07-28T01-51-32-056Z.md" analysis/
cp -r "analysis/enhanced-meta-team-infrastructure-detailed-planning-2025-07-28T01-50-02-635Z.md" analysis/
cp -r "analysis/enhanced-meta-team-mobile-detailed-planning-2025-07-28T01-50-51-630Z.md" analysis/
cp -r "analysis/enhanced-meta-team-risk-assessment-2025-07-28T01-51-49-848Z.md" analysis/
cp -r "analysis/enhanced-meta-team-security-detailed-planning-2025-07-28T01-50-32-940Z.md" analysis/
cp -r "analysis/enhanced-meta-team-strategic-analysis-2025-07-28T01-47-55-794Z.md" analysis/
cp -r "analysis/enhanced-meta-team-success-metrics-2025-07-28T01-52-06-054Z.md" analysis/
cp -r "analysis/enhanced-meta-team-technical-architecture-2025-07-28T01-48-20-554Z.md" analysis/
cp -r "analysis/meta-team-ai-ml-team-planning-2025-07-28T01-38-53-842Z.md" analysis/
cp -r "analysis/meta-team-backend-team-planning-2025-07-28T01-38-36-050Z.md" analysis/
cp -r "analysis/meta-team-cross-team-coordination-2025-07-28T01-40-18-383Z.md" analysis/
cp -r "analysis/meta-team-data-team-planning-2025-07-28T01-39-07-558Z.md" analysis/
cp -r "analysis/meta-team-executive-analysis-2025-07-28T01-38-01-214Z.md" analysis/
cp -r "analysis/meta-team-frontend-team-planning-2025-07-28T01-38-18-773Z.md" analysis/
cp -r "analysis/meta-team-implementation-roadmap-2025-07-28T01-40-37-201Z.md" analysis/
cp -r "analysis/meta-team-infrastructure-team-planning-2025-07-28T01-39-26-502Z.md" analysis/
cp -r "analysis/meta-team-mobile-team-planning-2025-07-28T01-39-59-301Z.md" analysis/
cp -r "analysis/meta-team-security-team-planning-2025-07-28T01-39-41-729Z.md" analysis/
cp -r "analysis/root-cause-analysis-2025-07-28T02-21-07-359Z.json" analysis/
cp -r "analysis/root-cause-analysis-2025-07-28T02-21-07-359Z.md" analysis/
cp -r "analysis/root-cause-analysis-2025-07-28T02-52-37-530Z.json" analysis/
cp -r "analysis/root-cause-analysis-2025-07-28T02-52-37-531Z.md" analysis/
cp "claude-fixes-export/ai-templates/LESSONS_LEARNED_UPDATE_SUMMARY.md" lessons-learned/
cp "claude-fixes-export/ai-templates/lessons-learned-meta-team-claude-code-integration.md" lessons-learned/
cp "claude-fixes-export/ai-templates/meta-team-activity-tracker-summary.md" meta-team-reports/
cp "claude-fixes-export/ai-templates/meta-team-claude-code-comprehensive-retrospective.js" retrospectives/
cp "claude-fixes-export/ai-templates/meta-team-claude-code-final-retrospective.js" retrospectives/
cp "claude-fixes-export/ai-templates/meta-team-claude-code-fix-summary.md" meta-team-reports/
cp "claude-fixes-export/ai-templates/meta-team-claude-code-retrospective.md" retrospectives/
cp "claude-fixes-export/ai-templates/meta-team-claude-code-usage-retrospective.js" retrospectives/
cp "claude-fixes-export/ai-templates/meta-team-claude-code-usage-tracking-summary.md" meta-team-reports/
cp "claude-fixes-export/ai-templates/meta-team-code-review-refactor-summary.md" meta-team-reports/
cp "claude-fixes-export/ai-templates/meta-team-comprehensive-retrospective-summary.md" retrospectives/
cp "claude-fixes-export/ai-templates/meta-team-header-implementation-summary.md" meta-team-reports/
cp "claude-fixes-export/ai-templates/meta-team-high-priority-implementation-summary.md" meta-team-reports/
cp "claude-fixes-export/ai-templates/meta-team-improvement-plan-summary.md" meta-team-reports/
cp "claude-fixes-export/ai-templates/meta-team-medium-priority-implementation-summary.md" meta-team-reports/
cp "claude-fixes-export/ai-templates/meta-team-upload-page-summary.md" meta-team-reports/
cp "claude-fixes-export/ai-templates/scripts/retrospective-template.md" retrospectives/
cp "claude-fixes-export/implementations/LESSONS_LEARNED_UPDATE_SUMMARY.md" lessons-learned/
cp "claude-fixes-export/implementations/lessons-learned-meta-team-claude-code-integration.md" lessons-learned/
cp "claude-fixes-export/implementations/meta-team-activity-tracker-summary.md" meta-team-reports/
cp "claude-fixes-export/implementations/meta-team-claude-code-comprehensive-retrospective.js" retrospectives/
cp "claude-fixes-export/implementations/meta-team-claude-code-final-retrospective.js" retrospectives/
cp "claude-fixes-export/implementations/meta-team-claude-code-fix-summary.md" meta-team-reports/
cp "claude-fixes-export/implementations/meta-team-claude-code-retrospective.md" retrospectives/
cp "claude-fixes-export/implementations/meta-team-claude-code-usage-retrospective.js" retrospectives/
cp "claude-fixes-export/implementations/meta-team-claude-code-usage-tracking-summary.md" meta-team-reports/
cp "claude-fixes-export/implementations/meta-team-code-review-refactor-summary.md" meta-team-reports/
cp "claude-fixes-export/implementations/meta-team-comprehensive-retrospective-summary.md" retrospectives/
cp "claude-fixes-export/implementations/meta-team-header-implementation-summary.md" meta-team-reports/
cp "claude-fixes-export/implementations/meta-team-high-priority-implementation-summary.md" meta-team-reports/
cp "claude-fixes-export/implementations/meta-team-improvement-plan-summary.md" meta-team-reports/
cp "claude-fixes-export/implementations/meta-team-medium-priority-implementation-summary.md" meta-team-reports/
cp "claude-fixes-export/implementations/meta-team-upload-page-summary.md" meta-team-reports/
cp "claude-fixes-export/implementations/scripts/retrospective-template.md" retrospectives/
cp "claude-fixes-export/lessons-learned/claude-version-retrospective-2025-07-28T02-25-05-809Z.json" retrospectives/
cp "claude-fixes-export/lessons-learned/claude-version-retrospective-2025-07-28T02-25-05-810Z.md" retrospectives/
cp "claude-fixes-export/lessons-learned/lessons-learned-meta-team-claude-code-integration.md" lessons-learned/
cp "claude-fixes-export/lessons-learned/meta-team-claude-code-comprehensive-retrospective.js" retrospectives/
cp "claude-fixes-export/lessons-learned/meta-team-claude-code-final-retrospective.js" retrospectives/
cp "claude-fixes-export/lessons-learned/meta-team-claude-code-fix-summary.md" meta-team-reports/
cp "claude-fixes-export/lessons-learned/meta-team-claude-code-retrospective.md" retrospectives/
cp "claude-fixes-export/lessons-learned/meta-team-claude-code-usage-retrospective.js" retrospectives/
cp "claude-fixes-export/lessons-learned/meta-team-claude-code-usage-tracking-summary.md" meta-team-reports/
cp "claude-fixes-export/lessons-learned/meta-team-claude-version-retrospective.js" retrospectives/
cp "claude-fixes-export/lessons-learned/meta-team-comprehensive-retrospective-summary.md" retrospectives/
cp "claude-fixes-export/lessons-learned/retrospectives/meta-team-claude-code-integration-complete-lessons-learned.md" lessons-learned/
cp "claude-fixes-export/lessons-learned/retrospectives/meta-team-claude-code-retrospective.md" retrospectives/
cp "claude-fixes-export/lessons-learned/templates/retrospective-template.md" retrospectives/
cp -r "corrections/claude-config-correction-2025-07-28T02-23-07-295Z.json" corrections/
cp -r "corrections/claude-config-correction-2025-07-28T02-23-07-295Z.md" corrections/
cp "docs/development/retrospective-template.md" retrospectives/
cp "lessons-learned-meta-team-claude-code-integration.md" lessons-learned/
cp "meta-team-activity-tracker-summary.md" meta-team-reports/
cp "meta-team-claude-code-comprehensive-retrospective.js" retrospectives/
cp "meta-team-claude-code-final-retrospective.js" retrospectives/
cp "meta-team-claude-code-fix-summary.md" meta-team-reports/
cp "meta-team-claude-code-retrospective.md" retrospectives/
cp "meta-team-claude-code-usage-retrospective.js" retrospectives/
cp "meta-team-claude-code-usage-tracking-summary.md" meta-team-reports/
cp "meta-team-code-review-refactor-summary.md" meta-team-reports/
cp "meta-team-comprehensive-retrospective-summary.md" retrospectives/
cp "meta-team-header-implementation-summary.md" meta-team-reports/
cp "meta-team-high-priority-implementation-summary.md" meta-team-reports/
cp "meta-team-improvement-plan-summary.md" meta-team-reports/
cp "meta-team-medium-priority-implementation-summary.md" meta-team-reports/
cp "meta-team-push-organization/ai-team-learnings/claude-version-retrospective-2025-07-28T02-25-05-809Z.json" retrospectives/
cp "meta-team-push-organization/ai-team-learnings/claude-version-retrospective-2025-07-28T02-25-05-810Z.md" retrospectives/
cp "meta-team-push-organization/ai-team-learnings/lessons-learned-meta-team-claude-code-integration.md" lessons-learned/
cp "meta-team-push-organization/ai-team-learnings/meta-team-activity-tracker-summary.md" meta-team-reports/
cp "meta-team-push-organization/ai-team-learnings/meta-team-claude-code-comprehensive-retrospective.js" retrospectives/
cp "meta-team-push-organization/ai-team-learnings/meta-team-claude-code-final-retrospective.js" retrospectives/
cp "meta-team-push-organization/ai-team-learnings/meta-team-claude-code-fix-summary.md" meta-team-reports/
cp "meta-team-push-organization/ai-team-learnings/meta-team-claude-code-retrospective.md" retrospectives/
cp "meta-team-push-organization/ai-team-learnings/meta-team-claude-code-usage-retrospective.js" retrospectives/
cp "meta-team-push-organization/ai-team-learnings/meta-team-claude-code-usage-tracking-summary.md" meta-team-reports/
cp "meta-team-push-organization/ai-team-learnings/meta-team-claude-version-retrospective.js" retrospectives/
cp "meta-team-push-organization/ai-team-learnings/meta-team-code-review-refactor-summary.md" meta-team-reports/
cp "meta-team-push-organization/ai-team-learnings/meta-team-comprehensive-retrospective-summary.md" retrospectives/
cp "meta-team-push-organization/ai-team-learnings/meta-team-header-implementation-summary.md" meta-team-reports/
cp "meta-team-push-organization/ai-team-learnings/meta-team-high-priority-implementation-summary.md" meta-team-reports/
cp "meta-team-push-organization/ai-team-learnings/meta-team-improvement-plan-summary.md" meta-team-reports/
cp "meta-team-push-organization/ai-team-learnings/meta-team-medium-priority-implementation-summary.md" meta-team-reports/
cp "meta-team-push-organization/ai-team-learnings/meta-team-upload-page-summary.md" meta-team-reports/
cp "meta-team-push-organization/ai-team-learnings/retrospectives/meta-team-claude-code-integration-complete-lessons-learned.md" lessons-learned/
cp "meta-team-push-organization/ai-team-learnings/retrospectives/meta-team-claude-code-retrospective.md" retrospectives/
cp "meta-team-push-organization/ai-team-learnings/templates/retrospective-template.md" retrospectives/
cp "meta-team-push-organization/ai-team-template/LESSONS_LEARNED_UPDATE_SUMMARY.md" lessons-learned/
cp "meta-team-push-organization/ai-team-template/lessons-learned-meta-team-claude-code-integration.md" lessons-learned/
cp "meta-team-push-organization/ai-team-template/meta-team-activity-tracker-summary.md" meta-team-reports/
cp "meta-team-push-organization/ai-team-template/meta-team-claude-code-comprehensive-retrospective.js" retrospectives/
cp "meta-team-push-organization/ai-team-template/meta-team-claude-code-final-retrospective.js" retrospectives/
cp "meta-team-push-organization/ai-team-template/meta-team-claude-code-fix-summary.md" meta-team-reports/
cp "meta-team-push-organization/ai-team-template/meta-team-claude-code-retrospective.md" retrospectives/
cp "meta-team-push-organization/ai-team-template/meta-team-claude-code-usage-retrospective.js" retrospectives/
cp "meta-team-push-organization/ai-team-template/meta-team-claude-code-usage-tracking-summary.md" meta-team-reports/
cp "meta-team-push-organization/ai-team-template/meta-team-code-review-refactor-summary.md" meta-team-reports/
cp "meta-team-push-organization/ai-team-template/meta-team-comprehensive-retrospective-summary.md" retrospectives/
cp "meta-team-push-organization/ai-team-template/meta-team-header-implementation-summary.md" meta-team-reports/
cp "meta-team-push-organization/ai-team-template/meta-team-high-priority-implementation-summary.md" meta-team-reports/
cp "meta-team-push-organization/ai-team-template/meta-team-improvement-plan-summary.md" meta-team-reports/
cp "meta-team-push-organization/ai-team-template/meta-team-medium-priority-implementation-summary.md" meta-team-reports/
cp "meta-team-push-organization/ai-team-template/meta-team-upload-page-summary.md" meta-team-reports/
cp "meta-team-push-organization/ai-team-template/scripts/retrospective-template.md" retrospectives/
cp "meta-team-push-organization/main-project/LESSONS_LEARNED_UPDATE_SUMMARY.md" lessons-learned/
cp "meta-team-push-organization/main-project/lessons-learned-meta-team-claude-code-integration.md" lessons-learned/
cp "meta-team-push-organization/main-project/meta-team-activity-tracker-summary.md" meta-team-reports/
cp "meta-team-push-organization/main-project/meta-team-claude-code-comprehensive-retrospective.js" retrospectives/
cp "meta-team-push-organization/main-project/meta-team-claude-code-final-retrospective.js" retrospectives/
cp "meta-team-push-organization/main-project/meta-team-claude-code-fix-summary.md" meta-team-reports/
cp "meta-team-push-organization/main-project/meta-team-claude-code-retrospective.md" retrospectives/
cp "meta-team-push-organization/main-project/meta-team-claude-code-usage-retrospective.js" retrospectives/
cp "meta-team-push-organization/main-project/meta-team-claude-code-usage-tracking-summary.md" meta-team-reports/
cp "meta-team-push-organization/main-project/meta-team-code-review-refactor-summary.md" meta-team-reports/
cp "meta-team-push-organization/main-project/meta-team-comprehensive-retrospective-summary.md" retrospectives/
cp "meta-team-push-organization/main-project/meta-team-header-implementation-summary.md" meta-team-reports/
cp "meta-team-push-organization/main-project/meta-team-high-priority-implementation-summary.md" meta-team-reports/
cp "meta-team-push-organization/main-project/meta-team-improvement-plan-summary.md" meta-team-reports/
cp "meta-team-push-organization/main-project/meta-team-medium-priority-implementation-summary.md" meta-team-reports/
cp "meta-team-push-organization/main-project/meta-team-upload-page-summary.md" meta-team-reports/
cp "meta-team-push-organization/main-project/retrospective-template.md" retrospectives/
cp "meta-team-push-organization/main-project/scripts/retrospective-template.md" retrospectives/
cp "meta-team-upload-page-summary.md" meta-team-reports/
cp -r "proofs/claude-version-proof-2025-07-28T02-18-10-697Z.json" proofs/
cp "retrospectives/claude-version-retrospective-2025-07-28T02-25-05-809Z.json" retrospectives/
cp "retrospectives/claude-version-retrospective-2025-07-28T02-25-05-810Z.md" retrospectives/
cp "scripts/utils/meta-team-claude-version-retrospective.js" retrospectives/

echo "✅ AI Team Learnings migration completed!"
echo "📊 Total files migrated: 160"
