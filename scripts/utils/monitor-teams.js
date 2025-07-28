#!/usr/bin/env node

require('dotenv').config();
const { ClaudeCode } = require('@anthropic-ai/claude-code');
const fs = require('fs');
const path = require('path');

class TeamMonitor {
  constructor() {
    this.claudeCode = new ClaudeCode({
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: 'claude-3-5-sonnet-20241022'
    });
    this.teams = new Map();
    this.metrics = new Map();
    this.alerts = [];
    this.isMonitoring = false;
  }

  async initialize() {
    console.log('📊 Initializing Team Monitor with Claude Code...\n');
    
    try {
      // Initialize team metrics
      await this.initializeTeamMetrics();
      
      // Load historical data
      await this.loadHistoricalData();
      
      // Set up monitoring intervals
      this.setupMonitoring();
      
      console.log('✅ Team Monitor initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Team Monitor initialization failed:', error);
      return false;
    }
  }

  async initializeTeamMetrics() {
    const teamConfigs = [
      { name: 'Frontend', metrics: ['code_quality', 'performance', 'user_experience', 'deployment_success'] },
      { name: 'Backend', metrics: ['api_performance', 'database_efficiency', 'security', 'scalability'] },
      { name: 'Data', metrics: ['data_quality', 'processing_speed', 'insight_generation', 'model_accuracy'] },
      { name: 'Security', metrics: ['vulnerability_scan', 'compliance_score', 'incident_response', 'threat_detection'] },
      { name: 'Infrastructure', metrics: ['uptime', 'resource_utilization', 'deployment_speed', 'cost_efficiency'] },
      { name: 'Mobile', metrics: ['app_performance', 'user_engagement', 'crash_rate', 'store_rating'] },
      { name: 'AI/ML', metrics: ['model_performance', 'training_efficiency', 'inference_speed', 'accuracy_improvement'] }
    ];

    for (const config of teamConfigs) {
      this.teams.set(config.name, {
        name: config.name,
        status: 'idle',
        metrics: config.metrics,
        performance: {},
        lastUpdate: new Date().toISOString()
      });
      
      this.metrics.set(config.name, new Map());
      for (const metric of config.metrics) {
        this.metrics.get(config.name).set(metric, {
          current: 0,
          target: 90,
          trend: 'stable',
          history: []
        });
      }
    }
  }

  async loadHistoricalData() {
    const dataPath = path.join(process.cwd(), 'monitoring');
    
    if (!fs.existsSync(dataPath)) {
      fs.mkdirSync(dataPath, { recursive: true });
      console.log('📁 Created monitoring directory');
    }

    const historicalPath = path.join(dataPath, 'historical.json');
    if (fs.existsSync(historicalPath)) {
      const content = await fs.promises.readFile(historicalPath, 'utf8');
      const historical = JSON.parse(content);
      
      // Restore metrics from historical data
      for (const [teamName, teamData] of Object.entries(historical)) {
        if (this.metrics.has(teamName)) {
          for (const [metric, data] of Object.entries(teamData.metrics)) {
            if (this.metrics.get(teamName).has(metric)) {
              this.metrics.get(teamName).get(metric).history = data.history || [];
            }
          }
        }
      }
      
      console.log('📚 Loaded historical monitoring data');
    }
  }

  setupMonitoring() {
    // Monitor teams every 30 seconds
    setInterval(async () => {
      if (!this.isMonitoring) return;
      
      try {
        await this.updateTeamMetrics();
        await this.analyzePerformance();
        await this.checkAlerts();
      } catch (error) {
        console.error('❌ Monitoring error:', error);
      }
    }, 30000);

    // Generate reports every 5 minutes
    setInterval(async () => {
      if (!this.isMonitoring) return;
      
      try {
        await this.generateReport();
      } catch (error) {
        console.error('❌ Report generation error:', error);
      }
    }, 300000);
  }

  async updateTeamMetrics() {
    console.log('🔄 Updating team metrics...');
    
    for (const [teamName, team] of this.teams) {
      // Simulate metric updates (in real implementation, this would come from actual team data)
      const metrics = this.metrics.get(teamName);
      
      for (const [metricName, metric] of metrics) {
        // Generate realistic metric values
        const currentValue = this.generateMetricValue(metricName, teamName);
        const previousValue = metric.current;
        
        metric.current = currentValue;
        metric.history.push({
          value: currentValue,
          timestamp: new Date().toISOString()
        });
        
        // Keep only last 100 data points
        if (metric.history.length > 100) {
          metric.history.shift();
        }
        
        // Update trend
        metric.trend = this.calculateTrend(previousValue, currentValue);
      }
      
      team.lastUpdate = new Date().toISOString();
    }
  }

  generateMetricValue(metricName, teamName) {
    // Generate realistic metric values based on team and metric type
    const baseValue = 85 + Math.random() * 15; // 85-100 range
    
    // Add some variation based on metric type
    switch (metricName) {
      case 'code_quality':
        return Math.min(100, baseValue + Math.random() * 5);
      case 'performance':
        return Math.min(100, baseValue - Math.random() * 10);
      case 'security':
        return Math.min(100, baseValue + Math.random() * 8);
      case 'uptime':
        return Math.min(100, baseValue + Math.random() * 12);
      default:
        return Math.min(100, baseValue);
    }
  }

  calculateTrend(previous, current) {
    const diff = current - previous;
    if (diff > 2) return 'improving';
    if (diff < -2) return 'declining';
    return 'stable';
  }

  async analyzePerformance() {
    console.log('🧠 Analyzing team performance with Claude Code...');
    
    const performanceData = {};
    for (const [teamName, metrics] of this.metrics) {
      performanceData[teamName] = {};
      for (const [metricName, metric] of metrics) {
        performanceData[teamName][metricName] = {
          current: metric.current,
          target: metric.target,
          trend: metric.trend,
          history: metric.history.slice(-10) // Last 10 data points
        };
      }
    }
    
    const analysisPrompt = `Analyze the performance of these AI teams and provide insights:
    
    Performance Data:
    ${JSON.stringify(performanceData, null, 2)}
    
    Provide:
    1. Overall performance assessment
    2. Teams that need attention
    3. Recommended actions
    4. Success patterns to replicate`;
    
    const analysis = await this.claudeCode.generate({
      prompt: analysisPrompt,
      maxTokens: 2000
    });
    
    console.log('📊 Performance Analysis:', analysis.substring(0, 200) + '...');
    
    // Store analysis for reporting
    this.lastAnalysis = {
      timestamp: new Date().toISOString(),
      analysis: analysis
    };
  }

  async checkAlerts() {
    console.log('🚨 Checking for alerts...');
    
    const newAlerts = [];
    
    for (const [teamName, metrics] of this.metrics) {
      for (const [metricName, metric] of metrics) {
        if (metric.current < metric.target * 0.8) { // 20% below target
          const alert = {
            team: teamName,
            metric: metricName,
            current: metric.current,
            target: metric.target,
            severity: 'high',
            timestamp: new Date().toISOString(),
            message: `${teamName} ${metricName} is ${metric.target - metric.current}% below target`
          };
          
          newAlerts.push(alert);
        } else if (metric.current < metric.target * 0.9) { // 10% below target
          const alert = {
            team: teamName,
            metric: metricName,
            current: metric.current,
            target: metric.target,
            severity: 'medium',
            timestamp: new Date().toISOString(),
            message: `${teamName} ${metricName} is ${metric.target - metric.current}% below target`
          };
          
          newAlerts.push(alert);
        }
      }
    }
    
    // Use Claude Code to analyze alerts
    if (newAlerts.length > 0) {
      const alertAnalysisPrompt = `Analyze these team alerts and provide actionable recommendations:
      
      Alerts:
      ${JSON.stringify(newAlerts, null, 2)}
      
      Provide:
      1. Root cause analysis
      2. Immediate actions needed
      3. Long-term solutions
      4. Prevention strategies`;
      
      const alertAnalysis = await this.claudeCode.generate({
        prompt: alertAnalysisPrompt,
        maxTokens: 1500
      });
      
      console.log('🚨 Alert Analysis:', alertAnalysis.substring(0, 200) + '...');
      
      // Add analysis to alerts
      newAlerts.forEach(alert => {
        alert.analysis = alertAnalysis;
      });
    }
    
    this.alerts.push(...newAlerts);
    
    // Keep only last 50 alerts
    if (this.alerts.length > 50) {
      this.alerts = this.alerts.slice(-50);
    }
    
    if (newAlerts.length > 0) {
      console.log(`🚨 Generated ${newAlerts.length} new alerts`);
    }
  }

  async generateReport() {
    console.log('📋 Generating team performance report...');
    
    const reportData = {
      timestamp: new Date().toISOString(),
      teams: {},
      overallMetrics: {},
      alerts: this.alerts.slice(-10), // Last 10 alerts
      analysis: this.lastAnalysis
    };
    
    // Compile team data
    for (const [teamName, metrics] of this.metrics) {
      reportData.teams[teamName] = {
        status: this.teams.get(teamName).status,
        metrics: {}
      };
      
      let teamAverage = 0;
      let metricCount = 0;
      
      for (const [metricName, metric] of metrics) {
        reportData.teams[teamName].metrics[metricName] = {
          current: metric.current,
          target: metric.target,
          trend: metric.trend
        };
        
        teamAverage += metric.current;
        metricCount++;
      }
      
      reportData.teams[teamName].average = teamAverage / metricCount;
    }
    
    // Calculate overall metrics
    let totalAverage = 0;
    let totalTeams = 0;
    
    for (const teamName in reportData.teams) {
      totalAverage += reportData.teams[teamName].average;
      totalTeams++;
    }
    
    reportData.overallMetrics = {
      averagePerformance: totalAverage / totalTeams,
      activeAlerts: this.alerts.filter(a => a.severity === 'high').length,
      teamsAtTarget: Object.values(reportData.teams).filter(t => t.average >= 90).length
    };
    
    // Use Claude Code to generate human-readable report
    const reportPrompt = `Generate a comprehensive team performance report based on this data:
    
    Report Data:
    ${JSON.stringify(reportData, null, 2)}
    
    Format the report with:
    1. Executive Summary
    2. Team Performance Overview
    3. Key Metrics Analysis
    4. Alerts and Issues
    5. Recommendations
    6. Next Steps`;
    
    const report = await this.claudeCode.generate({
      prompt: reportPrompt,
      maxTokens: 3000
    });
    
    // Save report
    const reportPath = path.join(process.cwd(), 'monitoring', `report_${Date.now()}.json`);
    await fs.promises.writeFile(reportPath, JSON.stringify({
      data: reportData,
      report: report
    }, null, 2));
    
    console.log('📋 Report generated and saved');
    console.log('\n📊 Executive Summary:', report.substring(0, 300) + '...');
  }

  async start() {
    if (this.isMonitoring) {
      console.log('⚠️ Team Monitor is already running');
      return;
    }

    this.isMonitoring = true;
    console.log('🎯 Starting Team Monitor...');
    
    // Initial metrics update
    await this.updateTeamMetrics();
    await this.analyzePerformance();
    
    console.log('✅ Team Monitor started successfully');
  }

  async stop() {
    this.isMonitoring = false;
    console.log('🛑 Stopping Team Monitor...');
    
    // Save final data
    await this.saveData();
    
    console.log('✅ Team Monitor stopped');
  }

  async saveData() {
    const dataPath = path.join(process.cwd(), 'monitoring');
    
    // Save historical data
    const historicalData = {};
    for (const [teamName, metrics] of this.metrics) {
      historicalData[teamName] = {
        metrics: {}
      };
      
      for (const [metricName, metric] of metrics) {
        historicalData[teamName].metrics[metricName] = {
          history: metric.history
        };
      }
    }
    
    const historicalPath = path.join(dataPath, 'historical.json');
    await fs.promises.writeFile(historicalPath, JSON.stringify(historicalData, null, 2));
    
    // Save alerts
    const alertsPath = path.join(dataPath, 'alerts.json');
    await fs.promises.writeFile(alertsPath, JSON.stringify(this.alerts, null, 2));
    
    console.log('💾 Monitoring data saved');
  }

  getTeamStatus(teamName) {
    const team = this.teams.get(teamName);
    const metrics = this.metrics.get(teamName);
    
    if (!team || !metrics) {
      return null;
    }
    
    const status = {
      name: teamName,
      status: team.status,
      lastUpdate: team.lastUpdate,
      metrics: {}
    };
    
    for (const [metricName, metric] of metrics) {
      status.metrics[metricName] = {
        current: metric.current,
        target: metric.target,
        trend: metric.trend
      };
    }
    
    return status;
  }

  getAllTeamsStatus() {
    const status = {};
    for (const teamName of this.teams.keys()) {
      status[teamName] = this.getTeamStatus(teamName);
    }
    return status;
  }

  getAlerts(severity = null) {
    if (severity) {
      return this.alerts.filter(alert => alert.severity === severity);
    }
    return this.alerts;
  }
}

// Main execution
async function main() {
  const monitor = new TeamMonitor();
  
  try {
    const initialized = await monitor.initialize();
    if (!initialized) {
      console.error('❌ Failed to initialize team monitor');
      process.exit(1);
    }

    await monitor.start();
    
    // Keep running for continuous monitoring
    console.log('\n🔄 Team Monitor running continuously...');
    console.log('Press Ctrl+C to stop');
    
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down...');
      await monitor.stop();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Team Monitor error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { TeamMonitor }; 