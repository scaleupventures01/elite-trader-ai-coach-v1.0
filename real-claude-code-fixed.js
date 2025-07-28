const { query } = require('@anthropic-ai/claude-code');
const fs = require('fs');
const path = require('path');

class FixedClaudeCodeIntegration {
  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY;
    if (!this.apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is required');
    }
  }

  async analyzeWithClaudeCode(filePath, prompt) {
    try {
      console.log('🤖 Claude Code analyzing file:', filePath);
      
      const result = await query({
        apiKey: this.apiKey,
        model: 'claude-3-5-sonnet-20241022',
        prompt: prompt,
        files: [filePath],
        maxTokens: 2000
      });
      
      console.log('✅ Claude Code analysis completed');
      return result;
      
    } catch (error) {
      console.error('❌ Claude Code analysis failed:', error.message);
      throw error;
    }
  }

  async generateWithClaudeCode(filePath, prompt) {
    try {
      console.log('🤖 Claude Code generating enhancement...');
      
      const result = await query({
        apiKey: this.apiKey,
        model: 'claude-3-5-sonnet-20241022',
        prompt: prompt,
        files: [filePath],
        maxTokens: 4000
      });
      
      console.log('✅ Claude Code generation completed');
      
      // Handle the response properly - extract the content
      let content = '';
      if (typeof result === 'string') {
        content = result;
      } else if (result && result.content) {
        content = result.content;
      } else if (result && result.text) {
        content = result.text;
      } else {
        // Try to extract HTML content from the response
        content = JSON.stringify(result, null, 2);
        console.log('⚠️ Could not extract HTML content, saving raw response');
      }
      
      return content;
      
    } catch (error) {
      console.error('❌ Claude Code generation failed:', error.message);
      throw error;
    }
  }
}

async function runRealClaudeCodeEnhancement() {
  try {
    console.log('🚀 Running REAL Claude Code Enhancement...');
    console.log('=' .repeat(60));
    
    const claudeCode = new FixedClaudeCodeIntegration();
    
    // Step 1: Analyze the current file
    console.log('\n📋 Step 1: Analyzing current implementation...');
    const analysisPrompt = `Analyze this HTML file and provide a brief summary of:
    1. What file upload functionality exists
    2. How files are currently displayed
    3. What improvements could be made for user experience
    Keep your response concise and focused.`;
    
    const analysis = await claudeCode.analyzeWithClaudeCode('index.html', analysisPrompt);
    console.log('🔍 Claude Code Analysis:');
    console.log(analysis);
    
    // Step 2: Generate enhancement
    console.log('\n🔨 Step 2: Generating enhancement...');
    const generationPrompt = `Enhance this HTML file to add click-to-preview functionality for uploaded files.

    Requirements:
    - Add a "Preview" button next to each file
    - When clicked, show/hide a preview section
    - For images: show thumbnail, click to open full-size modal
    - For text files: show first 1000 characters
    - For other files: show file information
    - Add smooth animations
    - Keep all existing functionality (upload, download, remove, confetti)

    Return ONLY the complete enhanced HTML file, no explanations.`;
    
    const enhancedHtml = await claudeCode.generateWithClaudeCode('index.html', generationPrompt);
    
    // Step 3: Save the enhanced version
    console.log('\n💾 Step 3: Saving enhanced version...');
    fs.writeFileSync('index-claude-real.html', enhancedHtml);
    console.log('✅ Enhanced HTML saved as index-claude-real.html');
    
    console.log('\n🎉 REAL Claude Code Enhancement Completed!');
    console.log('📁 File: index-claude-real.html');
    console.log('🌐 Test at: http://localhost:8000');
    
  } catch (error) {
    console.error('❌ Enhancement failed:', error.message);
  }
}

// Run the enhancement
if (require.main === module) {
  runRealClaudeCodeEnhancement();
}

module.exports = { FixedClaudeCodeIntegration, runRealClaudeCodeEnhancement }; 