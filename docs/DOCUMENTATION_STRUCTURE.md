# Documentation Structure

This document provides an overview of the PR Reviewer documentation organization.

## Core Documentation (Always Reviewed)

These documents should be read first and provide essential information for understanding the project:

- **README.md** - Project overview, quick start guide, and links to other docs
- **docs/content/PROJECT_PLAN.md** - Current status, priorities, and implementation roadmap

## Specialized Documentation (By Category)

The documentation is organized into specialized directories based on domain:

### Design Documentation

Located in `docs/design/`:

- **DESIGN_SYSTEM.md** - Design principles and component documentation
- **USER_FLOWS.md** - Core user journeys and interaction models
- **SCREENS.md** - Screen mockups and layouts

### Development Documentation

Located in `docs/development/`:

- **ARCHITECTURE.md** - System architecture and design patterns
- **CODING_STANDARDS.md** - Code style and best practices

### API Documentation 

Located in `docs/api/`:

- **API_REFERENCE.md** - Internal and external API documentation

### Database Documentation

Located in `docs/database/`:

- **DATA_MODELS.md** - Database schema and data structures

### LLM Documentation

Located in `docs/llm/`:

- **PROMPT_ENGINEERING.md** - LLM prompting patterns and strategies

### Testing Documentation

Located in `docs/testing/`:

- **TESTING_STRATEGY.md** - Testing approach and methodologies
- **MANUAL_TESTS.md** - Manual testing procedures

### Deployment Documentation

Located in `docs/deployment/`:

- **DEPLOYMENT_GUIDE.md** - Deployment process and infrastructure setup

## Document Updates

When updating documentation:

1. Focus on the core documents for project-wide changes
2. Update relevant specialized documents for domain-specific changes
3. Keep documentation in sync with code changes

## Documentation Principles

1. **Clarity**: Write clear, concise documentation with simple language
2. **Completeness**: Cover all necessary information without redundancy
3. **Organization**: Follow the established structure for consistency
4. **Examples**: Include practical examples to illustrate concepts
5. **Maintenance**: Keep documentation up-to-date with code changes
