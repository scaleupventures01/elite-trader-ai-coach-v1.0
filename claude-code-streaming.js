const { query } = require('@anthropic-ai/claude-code');
const fs = require('fs');

async function runClaudeCodeStreaming() {
  try {
    console.log('🚀 Running Claude Code with Streaming Response...');
    console.log('=' .repeat(60));
    
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is required');
    }
    
    console.log('🤖 Claude Code analyzing file: index.html');
    
    // Use the query function with proper streaming handling
    const queryResult = query({
      apiKey: apiKey,
      model: 'claude-3-5-sonnet-20241022',
      prompt: `Analyze this HTML file and provide a brief summary of the file upload functionality. 
      Focus on how files are displayed and what improvements could be made.`,
      files: ['index.html'],
      maxTokens: 1000
    });
    
    console.log('📡 Processing streaming response...');
    
    // Handle the streaming response
    let fullResponse = '';
    for await (const chunk of queryResult.sdkMessages) {
      if (chunk.type === 'content_block_delta' && chunk.delta && chunk.delta.text) {
        fullResponse += chunk.delta.text;
        process.stdout.write(chunk.delta.text); // Show real-time output
      }
    }
    
    console.log('\n✅ Claude Code analysis completed!');
    console.log('\n📝 Full Response:');
    console.log(fullResponse);
    
    // Save the response
    fs.writeFileSync('claude-analysis.txt', fullResponse);
    console.log('\n💾 Analysis saved to claude-analysis.txt');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the streaming version
if (require.main === module) {
  runClaudeCodeStreaming();
}

module.exports = { runClaudeCodeStreaming }; 