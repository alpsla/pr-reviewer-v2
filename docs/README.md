# PR Reviewer Documentation

## Overview

This directory contains essential documentation for the PR Reviewer project. We've organized it to provide quick access to the most important information while reducing duplication.

## Directory Structure

```
/docs
├── content/                  # Core project documentation
│   ├── PROJECT_OVERVIEW.md   # High-level project description
│   ├── ONBOARDING.md         # Getting started guide
│   ├── TESTING_STRATEGY.md   # Testing philosophy and patterns
│   └── CURRENT_TASKS.md      # Active development priorities
└── MANUAL_TESTS.md           # Comprehensive manual testing plan
```

## Key Documents

### For New Team Members
Start with these documents:
1. [`content/PROJECT_OVERVIEW.md`](./content/PROJECT_OVERVIEW.md) - Understand what we're building
2. [`content/ONBOARDING.md`](./content/ONBOARDING.md) - Set up your development environment
3. [`MANUAL_TESTS.md`](./MANUAL_TESTS.md) - Learn how we validate features

### For Active Contributors
Reference these regularly:
1. [`content/CURRENT_TASKS.md`](./content/CURRENT_TASKS.md) - See current priorities
2. [`content/TESTING_STRATEGY.md`](./content/TESTING_STRATEGY.md) - Understand our testing approach

## Using Documentation in Chat Sessions

When starting a new chat session (after hitting context limits or for a new assistant):

1. Share these key files to provide context:
```
I'm continuing work on the PR Reviewer project. Here's the current context:
[Share PROJECT_OVERVIEW.md and CURRENT_TASKS.md]
```

2. For testing-specific work, include:
```
We're following this testing strategy:
[Share TESTING_STRATEGY.md]
```

## Maintaining Documentation

To keep documentation valuable:

1. Update `CURRENT_TASKS.md` at the end of productive sessions
2. Keep `MANUAL_TESTS.md` in sync with new features
3. Only update `PROJECT_OVERVIEW.md` for significant architectural changes

## Documentation Philosophy

We've focused on:
1. **Essential Information** - Core details without duplication
2. **Current Status** - Up-to-date priorities and tasks
3. **Practical Guides** - Actionable testing and onboarding instructions
4. **Reduced Maintenance** - Fewer documents that need updating
