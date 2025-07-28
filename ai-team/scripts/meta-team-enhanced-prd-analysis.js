const { ClaudeCodeAPI } = require('./utils/claude-code-api-fix.js');
const { TeamActivityTracker } = require('./utils/team-activity-tracker.js');
const { ComprehensiveErrorHandler } = require('./utils/comprehensive-error-handler.js');


// Using Claude Sonnet 4: claude-sonnet-4-20250514

// Updated to use actual Claude Sonnet 4: claude-sonnet-4-20250514 - 2025-07-28T02:23:07.294Z
class MetaTeamEnhancedPRDAnalysis {
    constructor() {
        this.claudeAPI = new ClaudeCodeAPI();
        this.activityTracker = new TeamActivityTracker();
        this.errorHandler = new ComprehensiveErrorHandler();
        this.teams = ['frontend', 'backend', 'ai-ml', 'data', 'infrastructure', 'security', 'mobile'];
    }

    async analyzePRD() {
        console.log('🚀 Enhanced Meta Team PRD Analysis - Trading Journal Platform');
        console.log('============================================================');
        console.log('Using Claude 4.0 for advanced analysis and planning');
        console.log('');

        const prdContent = this.getPRDContent();
        
        try {
            // Phase 1: Strategic Analysis
            console.log('📋 Phase 1: Strategic Analysis');
            await this.performStrategicAnalysis(prdContent);

            // Phase 2: Technical Architecture Planning
            console.log('\n📋 Phase 2: Technical Architecture Planning');
            await this.performTechnicalArchitecturePlanning(prdContent);

            // Phase 3: Team-Specific Detailed Planning
            console.log('\n📋 Phase 3: Team-Specific Detailed Planning');
            await this.performDetailedTeamPlanning(prdContent);

            // Phase 4: Cross-Team Integration Planning
            console.log('\n📋 Phase 4: Cross-Team Integration Planning');
            await this.performCrossTeamIntegrationPlanning(prdContent);

            // Phase 5: Implementation Strategy
            console.log('\n📋 Phase 5: Implementation Strategy');
            await this.createImplementationStrategy(prdContent);

            // Phase 6: Risk Assessment & Mitigation
            console.log('\n📋 Phase 6: Risk Assessment & Mitigation');
            await this.performRiskAssessment(prdContent);

            // Phase 7: Success Metrics & KPIs
            console.log('\n📋 Phase 7: Success Metrics & KPIs');
            await this.defineSuccessMetrics(prdContent);

            console.log('\n🎉 Enhanced PRD Analysis Complete!');
            this.activityTracker.logActivity('meta-team', 'enhanced-prd-analysis-complete', {
                timestamp: new Date().toISOString(),
                teams: this.teams,
                status: 'success',
                model: 'claude-4.0'
            });

        } catch (error) {
            this.errorHandler.handleError('MetaTeamEnhancedPRDAnalysis', error);
        }
    }

    getPRDContent() {
        return `
# Trading Journal Platform - Complete Product Requirements Document

## Executive Summary
The Trading Journal Platform is a comprehensive digital solution designed to help traders systematically track, analyze, and improve their trading performance. The platform combines intelligent trade logging, performance analytics, psychological insights, and educational features to create a complete ecosystem for trader development.

## Vision Statement
To create the most intuitive and insightful trading journal platform that empowers traders to achieve consistent profitability through data-driven self-improvement and disciplined practice.

## Core Value Proposition
1. **Comprehensive Tracking**: Capture every aspect of trading performance beyond just P&L
2. **Actionable Insights**: Transform raw data into specific, personalized improvement recommendations
3. **Psychological Integration**: Address the mental and emotional aspects of trading
4. **Learning Acceleration**: Identify and reinforce successful patterns while eliminating costly mistakes
5. **Flexible Data Entry**: Support multiple journal formats and upload methods for seamless integration

## Key Features

### 1. Trade Entry & Management
- Manual Trade Entry with quick entry form
- Multi-Format Journal Upload System (PDF, Markdown, CSV/Excel)
- Automated Import Options (Broker API integration)
- Trade screenshots and chart markup
- Voice note attachments
- Pre-trade planning vs. execution comparison

### 2. Performance Analytics Dashboard
- Key Metrics (Win rate, profit factor, Sharpe ratio)
- Visual Analytics (Equity curve, heat maps, charts)
- Risk/reward distribution graphs
- Trade clustering analysis

### 3. Pattern Recognition & Insights
- AI-Powered Analysis with automatic setup classification
- Winning vs. losing pattern identification
- Market condition correlation
- Custom Alerts and notifications

### 4. Psychological Tracking
- Emotional State Monitoring
- Behavioral Analytics
- Stress level tracking
- Confidence metrics over time

### 5. Review & Reflection Tools
- Daily Review Workflow
- Periodic Reviews (weekly, monthly, quarterly)
- Trade replay functionality
- Lesson learned documentation

### 6. Educational Integration
- Learning Modules
- Community Features
- Anonymous performance sharing
- Mentor matching system

## Technical Architecture

### Frontend
- React/Vue.js for responsive UI
- React Dropzone for file uploads
- PDF.js for PDF processing
- Chart.js/D3.js for visualizations
- Progressive Web App capabilities

### Backend
- Node.js/Express or Python/FastAPI
- PostgreSQL for data storage
- Redis for caching
- Background job processing for file uploads
- RESTful API design

### File Processing
- PDF parsing with OCR capabilities
- Markdown parsing with flexible structure support
- Image processing and storage
- Machine learning for pattern recognition

### Infrastructure
- Cloud hosting (AWS/GCP/Azure)
- CDN for global performance
- Automated backups
- SSL encryption
- GDPR compliance

## Development Roadmap

### Phase 1 (Months 1-3): Foundation
- Core trade entry and storage
- Basic analytics dashboard
- User authentication
- Basic upload functionality

### Phase 2 (Months 3-6): Enhancement
- Advanced analytics
- Multi-format upload system
- Pattern recognition
- Mobile applications

### Phase 3 (Months 6-9): Intelligence
- AI-powered insights
- Psychological tracking
- Advanced upload features (OCR, batch processing)
- Community features

### Phase 4 (Months 9-12): Scale
- Broker integrations
- Educational platform
- Enterprise features
- Global expansion

## Success Metrics
- Daily Active Users (target: 60%+)
- Upload feature adoption (target: 80%+)
- Average session duration (target: 15+ minutes)
- Paid conversion rate (target: 15%+)
- Churn rate (target: <5% monthly)

## Monetization Strategy

### Subscription Tiers
**Basic (Free)**: 50 trades/month, basic analytics, 1GB storage
**Professional ($29/month)**: Unlimited trades, advanced analytics, 10GB storage, AI insights
**Elite ($79/month)**: Everything in Professional, API access, custom reports, priority support

## Target Audience
1. **Primary**: Active retail day traders
2. **Secondary**: Swing traders and investors
3. **Tertiary**: Trading educators and prop firms
        `;
    }

    async performStrategicAnalysis(prdContent) {
        const prompt = `
You are a Senior Strategic Consultant analyzing the Trading Journal Platform PRD using advanced strategic frameworks.

Please provide a comprehensive strategic analysis covering:

1. **Market Analysis & Competitive Positioning**
   - Porter's Five Forces analysis
   - Blue Ocean Strategy assessment
   - Competitive landscape mapping
   - Market segmentation and targeting strategy

2. **Business Model Innovation**
   - Value proposition canvas analysis
   - Revenue model optimization
   - Customer acquisition strategy
   - Unit economics analysis

3. **Strategic Positioning**
   - Unique competitive advantages
   - Barriers to entry creation
   - Strategic partnerships opportunities
   - International expansion potential

4. **Technology Strategy**
   - Technology stack competitive analysis
   - Scalability and performance requirements
   - Innovation roadmap alignment
   - Technical debt management strategy

5. **Go-to-Market Strategy**
   - Customer journey mapping
   - Channel strategy optimization
   - Pricing strategy analysis
   - Growth hacking opportunities

6. **Strategic Recommendations**
   - MVP feature prioritization matrix
   - Resource allocation strategy
   - Risk mitigation framework
   - Success measurement framework

PRD Content:
${prdContent}

Provide detailed strategic insights with actionable recommendations.
        `;

        const response = await this.claudeAPI.query(prompt);
        console.log('✅ Strategic Analysis completed');
        this.saveAnalysis('strategic-analysis', response);
    }

    async performTechnicalArchitecturePlanning(prdContent) {
        const prompt = `
You are a Senior Technical Architect designing the system architecture for the Trading Journal Platform.

Please provide a comprehensive technical architecture plan covering:

1. **System Architecture Design**
   - Microservices vs monolithic architecture analysis
   - Event-driven architecture design
   - API-first design principles
   - Scalability and performance architecture

2. **Data Architecture**
   - Data modeling strategy
   - Database design patterns
   - Data warehousing and analytics architecture
   - Data governance and compliance framework

3. **Security Architecture**
   - Zero-trust security model
   - Data encryption and protection
   - Authentication and authorization design
   - Compliance and audit requirements

4. **Infrastructure Architecture**
   - Cloud-native architecture design
   - Containerization and orchestration strategy
   - CI/CD pipeline architecture
   - Monitoring and observability design

5. **Integration Architecture**
   - Third-party integrations strategy
   - API gateway design
   - Message queuing and event streaming
   - Data synchronization patterns

6. **Performance and Scalability**
   - Load balancing and auto-scaling
   - Caching strategies
   - Database optimization
   - CDN and edge computing

PRD Content:
${prdContent}

Provide detailed technical architecture with diagrams and implementation guidance.
        `;

        const response = await this.claudeAPI.query(prompt);
        console.log('✅ Technical Architecture Planning completed');
        this.saveAnalysis('technical-architecture', response);
    }

    async performDetailedTeamPlanning(prdContent) {
        for (const team of this.teams) {
            console.log(`\n🔧 Detailed planning for ${team.toUpperCase()} team...`);
            
            const teamPrompt = this.getDetailedTeamPrompt(team, prdContent);
            const response = await this.claudeAPI.query(teamPrompt);
            
            console.log(`✅ ${team.toUpperCase()} team detailed planning completed`);
            this.saveAnalysis(`${team}-detailed-planning`, response);
            
            this.activityTracker.logActivity(team, 'detailed-planning-complete', {
                timestamp: new Date().toISOString(),
                team: team,
                status: 'completed'
            });
        }
    }

    getDetailedTeamPrompt(team, prdContent) {
        const teamPrompts = {
            'frontend': `
You are the Senior Frontend Architect for the Trading Journal Platform.

Provide a comprehensive frontend development plan covering:

1. **Architecture & Design Patterns**
   - Component architecture design
   - State management strategy (Redux, Context, Zustand)
   - Design system and component library
   - Performance optimization patterns

2. **Technology Stack Selection**
   - Framework comparison (React vs Vue vs Angular)
   - Build tools and bundlers
   - Testing framework strategy
   - Development tools and workflows

3. **User Experience Design**
   - Information architecture
   - User interface design principles
   - Accessibility compliance (WCAG 2.1)
   - Mobile-first responsive design

4. **Performance & Optimization**
   - Bundle size optimization
   - Lazy loading and code splitting
   - Caching strategies
   - Performance monitoring

5. **File Upload System Design**
   - Multi-format file handling
   - Progress tracking and error handling
   - Client-side validation
   - Drag-and-drop implementation

6. **Data Visualization Strategy**
   - Chart library selection
   - Real-time data updates
   - Interactive visualizations
   - Mobile chart optimization

7. **Development Workflow**
   - Git workflow and branching strategy
   - Code review process
   - Testing strategy (unit, integration, e2e)
   - Deployment pipeline

PRD Content:
${prdContent}
            `,
            
            'backend': `
You are the Senior Backend Architect for the Trading Journal Platform.

Provide a comprehensive backend development plan covering:

1. **API Design & Architecture**
   - RESTful API design principles
   - GraphQL consideration and implementation
   - API versioning strategy
   - Rate limiting and throttling

2. **Database Design & Optimization**
   - Database schema design
   - Query optimization strategies
   - Indexing strategy
   - Data migration and versioning

3. **Authentication & Authorization**
   - JWT implementation strategy
   - OAuth2 integration
   - Role-based access control (RBAC)
   - Multi-factor authentication

4. **File Processing Pipeline**
   - PDF parsing and OCR implementation
   - Markdown processing strategy
   - Image processing and optimization
   - Batch processing capabilities

5. **Background Job Processing**
   - Job queue architecture
   - Task scheduling and monitoring
   - Error handling and retry logic
   - Resource management

6. **Caching Strategy**
   - Redis implementation
   - Cache invalidation strategies
   - Distributed caching
   - Performance optimization

7. **Security Implementation**
   - Input validation and sanitization
   - SQL injection prevention
   - XSS protection
   - CSRF protection

8. **Monitoring & Logging**
   - Application monitoring
   - Error tracking and alerting
   - Performance metrics
   - Audit logging

PRD Content:
${prdContent}
            `,
            
            'ai-ml': `
You are the Senior AI/ML Architect for the Trading Journal Platform.

Provide a comprehensive AI/ML development plan covering:

1. **Machine Learning Strategy**
   - Model selection and comparison
   - Feature engineering strategy
   - Data preprocessing pipeline
   - Model training and validation

2. **Pattern Recognition Systems**
   - Trading pattern identification algorithms
   - Setup classification models
   - Performance prediction models
   - Anomaly detection systems

3. **Natural Language Processing**
   - Text analysis for trading journals
   - Sentiment analysis implementation
   - Named entity recognition
   - Topic modeling for insights

4. **Computer Vision Integration**
   - Chart image analysis
   - Screenshot processing
   - OCR for handwritten notes
   - Image classification for setups

5. **Real-time AI Processing**
   - Stream processing architecture
   - Real-time inference optimization
   - Model serving infrastructure
   - A/B testing framework

6. **Data Pipeline Design**
   - Feature store implementation
   - Data versioning and lineage
   - Model versioning strategy
   - Continuous training pipeline

7. **Model Monitoring & Maintenance**
   - Model performance monitoring
   - Drift detection
   - Automated retraining
   - Model explainability

8. **Ethical AI Considerations**
   - Bias detection and mitigation
   - Fairness metrics
   - Transparency requirements
   - Privacy-preserving ML

PRD Content:
${prdContent}
            `,
            
            'data': `
You are the Senior Data Architect for the Trading Journal Platform.

Provide a comprehensive data strategy plan covering:

1. **Data Architecture Design**
   - Data warehouse architecture
   - Data lake implementation
   - ETL/ELT pipeline design
   - Data governance framework

2. **Analytics Platform Design**
   - Business intelligence tools
   - Real-time analytics processing
   - Custom metric calculations
   - Report generation system

3. **Data Quality Management**
   - Data validation rules
   - Quality monitoring
   - Data cleansing processes
   - Master data management

4. **Performance Analytics**
   - Trading performance metrics
   - Risk analytics
   - Behavioral analytics
   - Predictive analytics

5. **Data Privacy & Compliance**
   - GDPR compliance implementation
   - Data anonymization
   - Consent management
   - Data retention policies

6. **Data Integration Strategy**
   - Third-party data sources
   - API integrations
   - Real-time data streaming
   - Data synchronization

7. **Data Visualization Strategy**
   - Dashboard design principles
   - Interactive visualizations
   - Mobile-optimized charts
   - Custom reporting tools

8. **Data Security**
   - Data encryption at rest and in transit
   - Access control and audit
   - Data backup and recovery
   - Disaster recovery planning

PRD Content:
${prdContent}
            `,
            
            'infrastructure': `
You are the Senior Infrastructure Architect for the Trading Journal Platform.

Provide a comprehensive infrastructure plan covering:

1. **Cloud Architecture Design**
   - Multi-cloud vs single-cloud strategy
   - Region selection and global distribution
   - Auto-scaling and load balancing
   - High availability design

2. **Containerization Strategy**
   - Docker implementation
   - Kubernetes orchestration
   - Service mesh implementation
   - Container security

3. **CI/CD Pipeline Design**
   - Build automation
   - Testing automation
   - Deployment strategies
   - Rollback procedures

4. **Monitoring & Observability**
   - Application performance monitoring
   - Infrastructure monitoring
   - Log aggregation and analysis
   - Alerting and notification systems

5. **Security Infrastructure**
   - Network security design
   - Firewall and WAF implementation
   - DDoS protection
   - Security monitoring and incident response

6. **Backup & Disaster Recovery**
   - Backup strategy and automation
   - Disaster recovery planning
   - Business continuity
   - Data replication

7. **Performance Optimization**
   - CDN implementation
   - Database optimization
   - Caching strategies
   - Performance testing

8. **Cost Optimization**
   - Resource optimization
   - Reserved instances strategy
   - Cost monitoring and alerting
   - Budget management

PRD Content:
${prdContent}
            `,
            
            'security': `
You are the Senior Security Architect for the Trading Journal Platform.

Provide a comprehensive security plan covering:

1. **Security Architecture Design**
   - Zero-trust security model
   - Defense in depth strategy
   - Security by design principles
   - Threat modeling

2. **Application Security**
   - Secure coding practices
   - Vulnerability assessment
   - Penetration testing
   - Security code review

3. **Data Protection**
   - Data classification
   - Encryption strategies
   - Data loss prevention
   - Privacy protection

4. **Identity & Access Management**
   - Authentication systems
   - Authorization frameworks
   - Single sign-on (SSO)
   - Multi-factor authentication

5. **Compliance & Governance**
   - GDPR compliance
   - Financial regulations
   - Audit requirements
   - Security policies and procedures

6. **Security Monitoring**
   - Security information and event management (SIEM)
   - Intrusion detection and prevention
   - Security analytics
   - Incident response

7. **Risk Management**
   - Risk assessment methodology
   - Risk mitigation strategies
   - Security metrics and KPIs
   - Business continuity planning

8. **Security Operations**
   - Security team structure
   - Security tools and technologies
   - Security training and awareness
   - Vendor security management

PRD Content:
${prdContent}
            `,
            
            'mobile': `
You are the Senior Mobile Architect for the Trading Journal Platform.

Provide a comprehensive mobile development plan covering:

1. **Mobile Strategy**
   - Native vs hybrid vs PWA analysis
   - Cross-platform development strategy
   - Platform-specific optimizations
   - App store strategy

2. **Mobile Architecture**
   - Mobile app architecture patterns
   - State management for mobile
   - Offline-first design
   - Performance optimization

3. **User Experience Design**
   - Mobile-first design principles
   - Touch interface optimization
   - Gesture-based interactions
   - Accessibility for mobile

4. **Mobile-Specific Features**
   - Push notifications
   - Location services
   - Camera and photo integration
   - Biometric authentication

5. **Performance & Optimization**
   - App size optimization
   - Battery usage optimization
   - Network optimization
   - Memory management

6. **Testing Strategy**
   - Mobile testing frameworks
   - Device testing strategy
   - Automated testing
   - Beta testing program

7. **Deployment & Distribution**
   - App store deployment
   - Enterprise distribution
   - Over-the-air updates
   - Version management

8. **Security & Privacy**
   - Mobile security best practices
   - Data protection on mobile
   - App store security requirements
   - Privacy compliance

PRD Content:
${prdContent}
            `
        };

        return teamPrompts[team] || teamPrompts['backend'];
    }

    async performCrossTeamIntegrationPlanning(prdContent) {
        const prompt = `
You are the Senior Integration Architect coordinating cross-team dependencies for the Trading Journal Platform.

Please provide a comprehensive integration planning covering:

1. **API Integration Strategy**
   - API design standards and conventions
   - API versioning and backward compatibility
   - API documentation and testing
   - API gateway implementation

2. **Data Integration Patterns**
   - Data flow between teams
   - Data transformation and mapping
   - Real-time data synchronization
   - Data quality and validation

3. **Service Integration**
   - Microservices communication patterns
   - Event-driven architecture
   - Message queuing and streaming
   - Service discovery and load balancing

4. **Cross-Team Dependencies**
   - Dependency mapping and management
   - Interface contracts and specifications
   - Integration testing strategies
   - Release coordination

5. **Integration Testing**
   - End-to-end testing strategy
   - Integration test automation
   - Performance testing for integrations
   - Security testing for integrations

6. **Deployment Coordination**
   - Coordinated deployment strategies
   - Feature flag management
   - Rollback procedures
   - Environment management

7. **Monitoring & Observability**
   - Distributed tracing
   - Cross-service monitoring
   - Error correlation
   - Performance analysis

8. **Communication & Collaboration**
   - Cross-team communication protocols
   - Documentation standards
   - Code review processes
   - Knowledge sharing practices

PRD Content:
${prdContent}
        `;

        const response = await this.claudeAPI.query(prompt);
        console.log('✅ Cross-Team Integration Planning completed');
        this.saveAnalysis('cross-team-integration', response);
    }

    async createImplementationStrategy(prdContent) {
        const prompt = `
You are the Senior Project Manager creating a comprehensive implementation strategy for the Trading Journal Platform.

Please provide a detailed implementation strategy covering:

1. **Project Management Framework**
   - Agile methodology implementation
   - Sprint planning and execution
   - Risk management framework
   - Quality assurance processes

2. **Team Structure & Organization**
   - Team composition and roles
   - Communication channels
   - Decision-making framework
   - Conflict resolution processes

3. **Development Phases**
   - Phase 1 (Months 1-3): Foundation
   - Phase 2 (Months 3-6): Enhancement
   - Phase 3 (Months 6-9): Intelligence
   - Phase 4 (Months 9-12): Scale

4. **Resource Planning**
   - Human resource requirements
   - Technology resource planning
   - Budget allocation
   - Timeline management

5. **Quality Assurance**
   - Testing strategy and automation
   - Code quality standards
   - Performance benchmarks
   - Security testing

6. **Deployment Strategy**
   - Environment management
   - Release management
   - Rollback procedures
   - Monitoring and alerting

7. **Change Management**
   - User adoption strategy
   - Training and documentation
   - Feedback collection
   - Continuous improvement

8. **Success Measurement**
   - Key performance indicators
   - Success metrics tracking
   - Progress monitoring
   - Outcome evaluation

PRD Content:
${prdContent}
        `;

        const response = await this.claudeAPI.query(prompt);
        console.log('✅ Implementation Strategy created');
        this.saveAnalysis('implementation-strategy', response);
    }

    async performRiskAssessment(prdContent) {
        const prompt = `
You are the Senior Risk Manager conducting a comprehensive risk assessment for the Trading Journal Platform.

Please provide a detailed risk assessment covering:

1. **Technical Risks**
   - Technology stack risks
   - Scalability and performance risks
   - Security vulnerabilities
   - Integration complexity risks

2. **Business Risks**
   - Market competition risks
   - User adoption risks
   - Revenue model risks
   - Regulatory compliance risks

3. **Operational Risks**
   - Team capacity and capability risks
   - Timeline and budget risks
   - Quality and reliability risks
   - Vendor and dependency risks

4. **Financial Risks**
   - Funding and cash flow risks
   - Cost overrun risks
   - Revenue projection risks
   - Investment return risks

5. **Risk Mitigation Strategies**
   - Risk prevention measures
   - Risk reduction strategies
   - Risk transfer options
   - Contingency planning

6. **Risk Monitoring & Control**
   - Risk tracking mechanisms
   - Early warning systems
   - Risk reporting processes
   - Risk review procedures

7. **Compliance & Legal Risks**
   - Data protection compliance
   - Financial regulations
   - Intellectual property risks
   - Contract and liability risks

8. **Market & Competitive Risks**
   - Market timing risks
   - Competitive response risks
   - Technology disruption risks
   - Economic environment risks

PRD Content:
${prdContent}
        `;

        const response = await this.claudeAPI.query(prompt);
        console.log('✅ Risk Assessment completed');
        this.saveAnalysis('risk-assessment', response);
    }

    async defineSuccessMetrics(prdContent) {
        const prompt = `
You are the Senior Analytics Manager defining comprehensive success metrics for the Trading Journal Platform.

Please provide detailed success metrics covering:

1. **Product Success Metrics**
   - User engagement metrics
   - Feature adoption rates
   - User satisfaction scores
   - Product-market fit indicators

2. **Business Success Metrics**
   - Revenue and growth metrics
   - Customer acquisition costs
   - Customer lifetime value
   - Churn and retention rates

3. **Technical Success Metrics**
   - Performance and reliability metrics
   - Security and compliance metrics
   - Scalability and efficiency metrics
   - Quality and defect metrics

4. **User Success Metrics**
   - User onboarding success
   - Feature usage patterns
   - User feedback and ratings
   - Support ticket metrics

5. **Team Success Metrics**
   - Development velocity
   - Code quality metrics
   - Team productivity
   - Knowledge sharing effectiveness

6. **Market Success Metrics**
   - Market share and penetration
   - Competitive positioning
   - Brand awareness and recognition
   - Partnership and integration success

7. **Financial Success Metrics**
   - Revenue growth rates
   - Profitability metrics
   - Unit economics
   - Investment return metrics

8. **Long-term Success Metrics**
   - Strategic goal achievement
   - Innovation and R&D success
   - Market expansion success
   - Sustainability metrics

PRD Content:
${prdContent}
        `;

        const response = await this.claudeAPI.query(prompt);
        console.log('✅ Success Metrics defined');
        this.saveAnalysis('success-metrics', response);
    }

    saveAnalysis(type, content) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `enhanced-meta-team-${type}-${timestamp}.md`;
        
        const fs = require('fs');
        const path = require('path');
        
        const analysisDir = path.join(__dirname, 'analysis');
        if (!fs.existsSync(analysisDir)) {
            fs.mkdirSync(analysisDir, { recursive: true });
        }
        
        const filepath = path.join(analysisDir, filename);
        fs.writeFileSync(filepath, content);
        
        console.log(`📄 Enhanced analysis saved: ${filename}`);
    }
}

// Run the enhanced analysis
async function main() {
    const analyzer = new MetaTeamEnhancedPRDAnalysis();
    await analyzer.analyzePRD();
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = MetaTeamEnhancedPRDAnalysis; 