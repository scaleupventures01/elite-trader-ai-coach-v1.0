# 🔑 API Key Setup Guide

## Overview

The Elite Trader AI Coach application uses **environment variables** for API keys, not hardcoded values. This is a security best practice.

## 🔒 What Was Removed (For Security)

During the reorganization, I removed API keys from:
- ❌ **Documentation files** (markdown files with examples)
- ❌ **Analysis reports** (files containing investigation results)

**These were NOT functional API keys - just examples in documentation.**

## ✅ What the App Actually Uses

The application reads API keys from **environment variables**:

### Environment Variables Used
```bash
# Primary API key
ANTHROPIC_API_KEY=your_actual_api_key_here

# Alternative API key name
CLAUDE_API_KEY=your_actual_api_key_here

# OAuth token (if using OAuth instead of API key)
CLAUDE_CODE_OAUTH_TOKEN=your_oauth_token_here
```

### Configuration Files
The app uses these configuration files that read from environment variables:

```javascript
// config/claude-code-config.js
module.exports = {
  apiKey: process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY,
  // ... other config
};
```

## 🚀 How to Set Up API Keys

### Option 1: Environment Variables (Recommended)

1. **Set environment variable:**
   ```bash
   export ANTHROPIC_API_KEY="your_actual_api_key_here"
   ```

2. **Or create a .env file:**
   ```bash
   # Create .env file in project root
   echo "ANTHROPIC_API_KEY=your_actual_api_key_here" > .env
   ```

3. **The application will automatically read it**

### Option 2: System Environment

Set the environment variable in your shell profile:
```bash
# Add to ~/.bashrc, ~/.zshrc, or ~/.profile
export ANTHROPIC_API_KEY="your_actual_api_key_here"
```

### Option 3: Runtime Environment

Set when running the application:
```bash
ANTHROPIC_API_KEY="your_key" node src/backend/api/trading-journal-working.js
```

## 🔍 How to Verify API Key is Working

### Check Environment Variable
```bash
echo $ANTHROPIC_API_KEY
```

### Test API Connection
```bash
# Run the trading journal platform
node src/backend/api/trading-journal-working.js
```

### Check Application Logs
The application will log:
- ✅ "Authentication system: WORKING" if API key is valid
- ❌ Error messages if API key is missing or invalid

## 🛡️ Security Best Practices

### ✅ Do This
- Use environment variables
- Keep API keys out of code
- Use `.env` files (add to `.gitignore`)
- Rotate API keys regularly

### ❌ Don't Do This
- Hardcode API keys in source code
- Commit API keys to git
- Share API keys in documentation
- Use the same key for development and production

## 📁 File Structure

```
elite-trader-ai-coach/
├── .env                    # Your actual API keys (not in git)
├── .env.example           # Example configuration (safe to commit)
├── config/
│   └── claude-code-config.js  # Reads from environment variables
└── src/
    └── backend/
        └── api/
            └── trading-journal-working.js  # Uses API key from env
```

## 🔧 Troubleshooting

### "API Key Not Found" Error
1. Check if environment variable is set:
   ```bash
   echo $ANTHROPIC_API_KEY
   ```

2. If not set, set it:
   ```bash
   export ANTHROPIC_API_KEY="your_key"
   ```

### "Invalid API Key" Error
1. Verify your API key is correct
2. Check if you have sufficient credits
3. Ensure you're using the right API key type

### "Authentication Failed" Error
1. Check if the API key is valid
2. Verify network connectivity
3. Check if Anthropic API is available

## 📞 Support

If you need help setting up API keys:
1. Check the Anthropic console: https://console.anthropic.com/
2. Review the application logs
3. Contact the Meta Team for assistance

---

**🎯 Summary**: The application is designed to use environment variables for API keys. The reorganization only removed API keys from documentation files, not from the functional configuration system. 