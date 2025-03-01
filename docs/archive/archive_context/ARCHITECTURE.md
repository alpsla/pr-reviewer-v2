# PR Reviewer Architecture

## System Overview
PR Reviewer follows a modular, service-oriented architecture with clear separation between authentication, VCS integration, and analysis components.

## Key Components

### 1. Authentication System (Implemented)
- Multi-provider authentication (GitHub, GitLab, Email)
- Session management via Supabase
- Token storage and refresh
- Provider-specific client initialization

### 2. VCS Abstraction Layer (Implemented)
- Common interface for GitHub and GitLab
- Standardized types for repositories, PRs, files, etc.
- Platform-specific client implementations
- Error normalization and handling
- Rate limit protection
- Comprehensive test coverage
- Mock clients for testing

### 3. Repository Service (Implemented)
- High-level repository and PR operations
- Database caching for API responses
- Unified error handling
- Data transformation and normalization
- Multi-platform repository listing
- Test coverage with mock VCS clients

### 4. Testing Infrastructure (Implemented)
- Jest-based unit testing
- Mock implementations for external services
- Factory functions for test data
- Consistent Arrange-Act-Assert pattern
- Error scenario testing
- Pagination and filtering tests

### 5. Analysis Pipeline (Planned)
- Language detection
- Analysis job queue
- LLM integration
- Result processing and storage

### 6. UI Components (Planned)
- Repository selection
- PR configuration
- Analysis progress tracking
- Result visualization

## Data Flow
```
┌──────────┐     ┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│  GitHub/ │     │ Repository  │     │  Analysis    │     │    UI        │
│  GitLab  │◄───►│  Service    │◄───►│  Pipeline    │◄───►│  Components  │
└──────────┘     └─────────────┘     └──────────────┘     └──────────────┘
```

## Database Schema (Simplified)
- **users**: User accounts and authentication
- **repositories**: Repository metadata and access info
- **pull_requests**: PR metadata and status
- **analyses**: Analysis jobs and results

## API Design
- RESTful endpoints for core operations
- GraphQL exploration for complex queries (future)
- Rate limiting and caching at multiple levels

## Security Considerations
- OAuth token management
- Rate limit protection
- Database access controls
- Input validation

## Performance Strategy
- Multi-level caching
- Asynchronous job processing
- Selective analysis for large PRs
- Response compression

## Testing Strategy
- Unit tests for core services
- Mock implementations for external dependencies
- Error scenario testing
- Pagination and edge case coverage
- Integration tests for service interactions
- End-to-end tests for critical flows
- Coverage reporting and thresholds

## Testing Best Practices

### 1. Mock Design
- Create dedicated mock factories for each external service
- Structure mocks to match actual implementation hierarchy
- Support instanceof checks by extending actual classes where possible
- Avoid deep nesting in mock implementations
- Create helper utilities for test object creation

### 2. Testing Patterns
- Use consistent Arrange-Act-Assert pattern 
- Create isolated tests that don't depend on each other
- Mock only what's necessary, preferring real implementations when possible
- Use descriptive test names that explain the scenario being tested
- Group related tests with nested describes

### 3. Import Considerations
- Be cautious with barrel file imports in production code
- Import directly from source files when inheritance is important
- Consider restructuring imports to make mocking easier
- Document import patterns for testable code

### 4. Test Organization
- Start with simple tests to verify basic functionality
- Add complexity gradually with additional test cases
- Focus on behavioral testing rather than implementation details
- Create snapshot tests for complex object structures
- Document common testing patterns in README files
