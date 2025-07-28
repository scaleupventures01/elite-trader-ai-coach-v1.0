const { ClaudeCode } = require('@anthropic-ai/claude-code');

// Example of direct Claude Code usage
async function exampleClaudeCodeUsage() {
  const claudeCode = new ClaudeCode({
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-3-5-sonnet-20241022'
  });

  // Example: Ask Claude Code to analyze a codebase
  const result = await claudeCode.analyze({
    prompt: "Analyze this codebase and suggest improvements",
    files: ["./package.json", "./README.md"],
    maxTokens: 4000
  });

  console.log("Claude Code Analysis:", result);
}

// Example: Generate code with Claude Code
async function generateCode() {
  const claudeCode = new ClaudeCode({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  const code = await claudeCode.generate({
    prompt: "Create a React component for a user profile",
    language: "javascript",
    framework: "react"
  });

  console.log("Generated Code:", code);
}

module.exports = { exampleClaudeCodeUsage, generateCode }; 