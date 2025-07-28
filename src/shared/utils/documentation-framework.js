/**
 * Documentation Framework
 * Documentation standards and knowledge management for Meta Team
 */

const fs = require('fs');
const path = require('path');
const config = require('../config/documentation-config');

class DocumentationFramework {
  constructor() {
    this.templates = new Map();
    this.standards = new Map();
    this.knowledgeBase = new Map();
    this.loadTemplates();
    this.loadStandards();
  }

  loadTemplates() {
    const templatesDir = 'docs/templates';
    if (fs.existsSync(templatesDir)) {
      const files = fs.readdirSync(templatesDir);
      files.forEach(file => {
        if (file.endsWith('.md')) {
          const templateName = path.basename(file, '.md');
          const templateContent = fs.readFileSync(path.join(templatesDir, file), 'utf8');
          this.templates.set(templateName, templateContent);
        }
      });
    }
  }

  loadStandards() {
    const standardsDir = 'docs/standards';
    if (fs.existsSync(standardsDir)) {
      const files = fs.readdirSync(standardsDir);
      files.forEach(file => {
        if (file.endsWith('.md')) {
          const standardName = path.basename(file, '.md');
          const standardContent = fs.readFileSync(path.join(standardsDir, file), 'utf8');
          this.standards.set(standardName, standardContent);
        }
      });
    }
  }

  generateDocumentation(type, data) {
    const template = this.templates.get(type);
    if (!template) {
      throw new Error(`Template not found for type: ${type}`);
    }

    let content = template;
    
    // Replace placeholders with data
    Object.entries(data).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      content = content.replace(new RegExp(placeholder, 'g'), value);
    });

    return content;
  }

  saveDocumentation(filename, content) {
    const docsDir = 'docs';
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    const filepath = path.join(docsDir, filename);
    fs.writeFileSync(filepath, content);
    
    console.log(`📝 Documentation saved: ${filepath}`);
    return filepath;
  }

  captureKnowledge(category, title, content) {
    const knowledge = {
      category,
      title,
      content,
      timestamp: new Date(),
      author: process.env.USER || 'Meta Team'
    };

    if (!this.knowledgeBase.has(category)) {
      this.knowledgeBase.set(category, []);
    }

    this.knowledgeBase.get(category).push(knowledge);
    
    // Save to file
    this.saveKnowledgeToFile(category, knowledge);
    
    return knowledge;
  }

  saveKnowledgeToFile(category, knowledge) {
    const knowledgeDir = 'docs/knowledge';
    if (!fs.existsSync(knowledgeDir)) {
      fs.mkdirSync(knowledgeDir, { recursive: true });
    }

    const categoryDir = path.join(knowledgeDir, category);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }

    const filename = `${knowledge.timestamp.toISOString().split('T')[0]}-${knowledge.title.replace(/[^a-zA-Z0-9]/g, '-')}.md`;
    const filepath = path.join(categoryDir, filename);
    
    const content = `# ${knowledge.title}

**Category**: ${knowledge.category}
**Date**: ${knowledge.timestamp.toISOString()}
**Author**: ${knowledge.author}

${knowledge.content}
`;

    fs.writeFileSync(filepath, content);
  }

  getKnowledge(category) {
    return this.knowledgeBase.get(category) || [];
  }

  getAllKnowledge() {
    return Object.fromEntries(this.knowledgeBase);
  }

  validateDocumentation(content, type) {
    const standard = this.standards.get(type);
    if (!standard) {
      return { valid: true, issues: [] };
    }

    const issues = [];
    
    // Check for required sections
    const requiredSections = ['##', '###'];
    requiredSections.forEach(section => {
      if (!content.includes(section)) {
        issues.push(`Missing required section: ${section}`);
      }
    });

    return {
      valid: issues.length === 0,
      issues
    };
  }
}

module.exports = { DocumentationFramework };