# PROJECT STRUCTURE

## Overview
The Elite Trader AI Coach project has been reorganized with a logical folder structure for better maintainability and scalability.

## Directory Structure

### 📁 src/
Source code for the application.

#### 📁 src/frontend/
Frontend application code.
- **components/**: React components
- **pages/**: Page components and routing
- **styles/**: CSS and styling files
- **utils/**: Frontend utility functions

#### 📁 src/backend/
Backend application code.
- **api/**: API routes and endpoints
- **controllers/**: Business logic controllers
- **models/**: Data models and schemas
- **middleware/**: Express middleware
- **utils/**: Backend utility functions

#### 📁 src/shared/
Shared code between frontend and backend.
- **types/**: TypeScript type definitions
- **constants/**: Shared constants and configurations
- **utils/**: Shared utility functions

### 📁 docs/
Documentation for the project.
- **api/**: API documentation
- **architecture/**: System architecture docs
- **deployment/**: Deployment guides
- **development/**: Development guides
- **user/**: User documentation

### 📁 config/
Configuration files.
- **environments/**: Environment configurations
- **database/**: Database configurations
- **security/**: Security configurations

### 📁 scripts/
Build and utility scripts.
- **build/**: Build and deployment scripts
- **database/**: Database migration scripts
- **utils/**: Utility scripts

### 📁 tests/
Test files.
- **unit/**: Unit tests
- **integration/**: Integration tests
- **e2e/**: End-to-end tests
- **mocks/**: Test mocks and fixtures

### 📁 deployment/
Deployment configurations.
- **docker/**: Docker configurations
- **kubernetes/**: Kubernetes configurations
- **environments/**: Environment-specific configs

### 📁 assets/
Static assets.
- **images/**: Image assets
- **fonts/**: Font files
- **icons/**: Icon files

### 📁 reports/
Reports and analytics.
- **sprints/**: Sprint reports and retrospectives
- **analytics/**: Analytics and metrics reports
- **audits/**: Security and performance audits
- **dashboards/**: Dashboard configurations

### 📁 sprints/
Sprint-related documentation.
- **completed/**: Completed sprint documentation
- **active/**: Active sprint documentation
- **planning/**: Sprint planning documents

### 📁 teams/
Team-specific documentation.
- **frontend/**: Frontend team documentation
- **backend/**: Backend team documentation
- **qa/**: QA team documentation
- **infrastructure/**: Infrastructure team documentation

## File Naming Conventions

### Frontend Files
- Components: PascalCase (e.g., TradeEntryForm.js)
- Pages: kebab-case (e.g., trade-history.js)
- Styles: kebab-case (e.g., trade-entry.css)
- Utils: camelCase (e.g., tradeUtils.js)

### Backend Files
- Controllers: camelCase (e.g., tradeController.js)
- Models: PascalCase (e.g., Trade.js)
- Middleware: camelCase (e.g., authMiddleware.js)
- Utils: camelCase (e.g., validationUtils.js)

### Configuration Files
- Environment: .env files
- Database: database.config.js
- Security: security.config.js

### Test Files
- Unit tests: *.test.js
- Integration tests: *.spec.js
- E2E tests: *.e2e.js

## Best Practices

### File Organization
1. Keep related files together
2. Use descriptive folder names
3. Maintain consistent naming conventions
4. Separate concerns (frontend/backend/shared)
5. Group by functionality, not by type

### Documentation
1. Keep documentation close to code
2. Use README files in each major directory
3. Maintain up-to-date API documentation
4. Document architectural decisions

### Testing
1. Mirror source structure in test folders
2. Keep test files close to source files
3. Use descriptive test names
4. Maintain test data separately

## Migration Notes

This structure was reorganized from the original flat structure to improve:
- Code organization and maintainability
- Team collaboration and ownership
- Build and deployment processes
- Testing and quality assurance
- Documentation and knowledge sharing

For questions about the new structure, contact the Meta Team.
