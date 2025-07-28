/**
 * Documentation Configuration
 * Configuration for documentation framework
 */

module.exports = {
  templates: {
    enabled: true,
    directory: 'docs/templates',
    defaultTemplate: 'standard'
  },
  standards: {
    enabled: true,
    directory: 'docs/standards',
    enforceStandards: true
  },
  knowledge: {
    enabled: true,
    directory: 'docs/knowledge',
    autoSave: true,
    categorize: true
  },
  validation: {
    enabled: true,
    checkRequiredSections: true,
    checkFormatting: true,
    checkLinks: true
  },
  automation: {
    enabled: true,
    generateOnSave: false,
    generateOnCommit: true,
    updateIndex: true
  }
};