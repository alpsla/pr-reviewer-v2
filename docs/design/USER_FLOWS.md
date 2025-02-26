# User Flows

This document outlines the core user journeys and interaction models for the PR Reviewer application.

## Common UI Elements

### Page Header
All pages include a consistent header with:
- Logo (left)
- Main navigation menu (center)
- UI controls (right):
  - Language selector
  - Theme toggle (light/dark mode)
- Authentication/subscription actions (far right):
  - Sign in/Sign up or "Join Us" button for new users
  - User profile dropdown for authenticated users

### Page Footer
All pages include a consistent footer with:
- Copyright information
- Links to legal documents (Terms of Service, Privacy Policy)
- Contact information
- Social media links

## Primary User Journeys

### 1. New User Onboarding Flow

The initial experience for users discovering the application.

#### Screens
1. **Welcome Page**: Entry point for new visitors
   - Hero section with compelling title and description
     - Title (e.g., "AI-Powered Code Review")
     - Short description (e.g., "Get professional code feedback in minutes")
     - Background image (code-related visuals)
     - "Join Us" call-to-action button
   - Value proposition section
     - Information about free trial option
     - Key benefits (e.g., "Save time", "Improve code quality", "Learn best practices")
   - Onboarding slideshow
     - Step-by-step explanation of the workflow
     - Visual illustrations of each step
     - Simple, engaging copy
   - Social proof section (for future)
     - Testimonials/feedback from users
     - Influencer endorsements
     - Video testimonials

2. **Authentication**: User account creation
   - OAuth options (GitHub, GitLab)
   - Email magic link option
   - Terms acceptance

3. **Onboarding Guide**: Quick introduction to features
   - How to submit PRs
   - How to interpret results
   - Benefits of different subscription tiers

#### User Steps
1. User visits welcome page
2. User explores value proposition and examples
3. User clicks "Join Us" button
4. User completes authentication process
5. User is guided through brief onboarding
6. User is prompted to submit first PR for analysis

### 2. PR Analysis Flow

The core workflow for analyzing a pull request and receiving feedback.

#### Screens
1. **PR Input**: Form for entering PR URL or selecting from repositories
   - Clear instructions
   - URL input field with validation
   - Recent/favorite repositories selector
   - Analysis options and settings

2. **Analysis Queue**: Status of analysis in progress
   - Progress visualization
   - Estimated completion time
   - Option to cancel analysis

3. **Results View**: Detailed feedback from analysis
   - Summary dashboard with overall metrics
   - Category-based organization with cards for each category:
     - Code Quality
     - Dependencies
     - Performance
     - Security
     - Best Practices
     - Testing
   - Each category card includes:
     - Distinctive icon and primary color background
     - Summary metadata (number of issues/warnings/enhancements)
     - Collapsible/expandable interface for multi-level drill-down
     - Lowest level shows specific code examples with issues/recommendations
   - Additional service offers (full for subscribers, limited for free tier):
     - Code improvement suggestions
     - Documentation generation
     - Test recommendations
     - Performance optimizations

4. **Export Options**: Export results to external systems
   - Export to PR comments
   - Download report (PDF/Markdown)
   - Push suggestions to GitHub/GitLab
   - Share results

#### User Steps
1. User enters PR URL or selects from recent repos
2. System validates URL and fetches PR metadata
3. User confirms analysis request
4. System queues PR for analysis and shows progress
5. User is notified when analysis is complete
6. User reviews feedback and suggestions
7. User applies suggestions or exports results

#### Interaction Patterns
- Show immediate validation when URL is entered
- Display PR metadata preview before confirmation
- Show real-time progress updates during analysis
- Allow filtering/sorting of results by category
- Enable direct navigation to specific code sections

### 3. Home Dashboard Flow (Registered Users)

The main dashboard for registered users to manage their analyses.

#### Screens
1. **Home Dashboard**: Overview of user's activity and options
   - Recent analyses
   - Quick stats and trends
   - Skill improvement metrics (for subscribers)
   - Quick actions (New Analysis, View History)
   - Subscription status and limits

2. **Account Overview**: User profile and settings
   - Profile information
   - Subscription details
   - Usage statistics
   - Skill development trends

#### User Steps
1. User logs in and is directed to home dashboard
2. User sees overview of recent activity and metrics
3. User selects action (new analysis, view history, etc.)

### 4. Subscription Management Flow

How users select and manage their subscription plans.

#### Screens
1. **Pricing Page**: Plan comparison and selection
   - Free tier limits and features
   - Paid tier options with feature comparison
   - Annual/monthly pricing options
   - Special offers

2. **Payment Processing**: Secure payment information collection
   - Payment method selection
   - Billing information
   - Order summary
   - Confirmation

3. **Subscription Management**: Managing active subscriptions
   - Current plan details
   - Usage statistics
   - Upgrade/downgrade options
   - Billing history
   - Cancellation options

#### User Steps
1. User navigates to pricing page
2. User compares available plans
3. User selects desired plan
4. User enters payment information
5. System processes payment and activates subscription
6. User receives confirmation and updated account status

### 5. History Review Flow

Reviewing past analyses and their results.

#### Screens
1. **History List**: Overview of past analyses
   - Filterable/sortable list of past analyses
   - Key metrics for each analysis
   - Search functionality

2. **History Detail**: Specific analysis results
   - Full analysis report
   - Comparison with past analyses
   - Improvement tracking

3. **Trends and Metrics** (Subscribers only)
   - Skill improvement over time
   - Code quality trends
   - Common issue categories
   - Developer/team performance comparison

#### User Steps
1. User navigates to history section
2. System displays list of past analyses
3. User filters or searches for specific analyses
4. User selects specific analysis to view
5. System loads detailed results
6. User optionally compares with other analyses

### 6. Services Page

Detailed information about the analysis capabilities.

#### Screens
1. **Services Overview**: Summary of analysis capabilities
   - Detailed description of analysis capabilities
   - Language support information 
   - Use cases and examples

#### User Steps
1. User navigates to services section
2. User explores available analysis capabilities
3. User learns about language support and use cases

### 7. Settings Management Flow

Configuring user preferences and integrations.

#### Screens
1. **Settings Overview**: Categories of settings
   - Account settings
   - Integration settings
   - Analysis preferences
   - Notification settings

2. **Account Settings**: User profile information
   - Profile information from authentication providers
   - Additional user metadata
   - Subscription management

3. **Integration Settings**: VCS connections
   - GitHub integration
   - GitLab integration
   - Future provider integrations

4. **Analysis Preferences**: Customization options for analysis
   - Default analysis settings
   - Language-specific preferences
   - Report format preferences
   - LLM preferences:
     - Selection of preferred LLM provider from supported options
     - Default is dynamic evaluation based on performance and cost
     - Option to prioritize specific models for different analysis types

5. **Notification Settings**: Control over system communications
   - Email notifications
   - In-app notifications
   - Analysis completion alerts

#### User Steps
1. User navigates to settings
2. System displays setting categories
3. User selects specific category
4. System shows related settings
5. User modifies settings
6. System saves and applies changes

## Screen Map

### Application Structure

```
├── Welcome Page
├── Auth
│   ├── Login
│   ├── Register
│   └── Password Reset
├── Onboarding
├── Home Dashboard (for registered users)
├── PR Analysis
│   ├── PR Input
│   ├── Analysis Queue/Progress
│   └── Results View
│       ├── Summary
│       ├── Code Issues
│       ├── Suggestions
│       └── Additional Services
├── Services (detailed capabilities)
├── Pricing
│   ├── Plans Comparison
│   ├── Payment Processing
│   └── Subscription Management
├── History
│   ├── History List
│   ├── History Detail
│   └── Trends & Metrics
└── Settings
    ├── Account
    ├── Integrations
    ├── Analysis Preferences
    └── Notifications
```

### Navigation Structure

1. **Primary Navigation** (Header)
   - Logo/Home (left)
   - Main navigation menu (center):
     - PR Analysis
     - Services
     - Pricing
     - History (if authenticated)
     - Settings (if authenticated)
   - UI Controls (right):
     - Language Selection
     - Theme Toggle
   - Authentication (far right):
     - "Join Us" button (if not authenticated)
     - User Account Menu (if authenticated)

2. **Secondary Navigation** (Tabs within sections)
   - Results: Summary, Issues, Suggestions, Services
   - Settings: Account, Integrations, Preferences, Notifications

3. **Contextual Navigation**
   - Breadcrumbs for deep navigation
   - "Back" links for multi-step processes

## Interaction Models

### Form Inputs and Validation

1. **Real-time Validation**
   - Validate inputs as user types
   - Show validation messages inline
   - Disable submission until valid

2. **Multi-step Forms**
   - Break complex inputs into logical steps
   - Show progress indicator
   - Allow navigation between steps
   - Validate each step before proceeding

### Feedback and Notifications

1. **Loading States**
   - Show progress indicators for all operations
   - Use skeleton loaders for content areas
   - Provide estimated completion times when available

2. **Success States**
   - Confirm successful actions with brief notifications
   - Provide next step suggestions

3. **Error States**
   - Display clear error messages
   - Suggest recovery actions
   - Preserve user input when possible

### Analysis Results Interaction

1. **Overview and Detail Pattern**
   - Start with card-based summary of categories
   - Allow drilling down through multiple levels of detail
   - Use consistent color-coding and iconography per category
   - Provide context with highlighted code snippets at the lowest level

2. **Action-oriented Feedback**
   - Present actionable suggestions
   - Allow direct acceptance of suggestions
   - Enable export to PR comments

3. **Filtering and Sorting**
   - Filter by severity, category, file
   - Sort by importance, location, confidence

## Internationalization

The application will support multiple languages to improve accessibility and enable global growth:

1. **Implementation Strategy**
   - Start with English as the default language
   - Add Spanish as the next supported language
   - Design the system to easily accommodate additional languages
   - Use a standardized i18n approach in the codebase

2. **Language Selection**
   - Language selector in the header for quick access from any page
   - Position near theme toggle for related UI controls
   - Persist language preference across sessions

3. **Content Management**
   - Separate text content from UI components
   - Support for right-to-left languages in design system
   - Date, time, and number formatting based on locale

## Priority Screens for Implementation

Based on the core user flow, the following screens should be implemented first:

1. **Welcome Page**
   - Hero section with clear value proposition
   - Information about free trial
   - Onboarding slideshow
   - "Join Us" call-to-action

2. **PR Input Screen**
   - Simple form with URL input
   - Repository selection dropdown
   - Branch/PR metadata preview

3. **Results View**
   - Summary section with key metrics
   - Categorized issues list
   - Code context view with suggestions

These screens enable the basic PR analysis workflow for both new and returning users, providing a foundation for testing the core functionality of the application.

## Next Steps

1. Create detailed mockups for priority screens
2. Implement Welcome Page and PR Input screen components
3. Design Results View layout and components
4. Develop navigation patterns between screens
5. Address Button component rendering issues
