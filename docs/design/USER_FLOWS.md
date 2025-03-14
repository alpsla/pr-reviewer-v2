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

## Updated User Journeys

### 1. New User Onboarding Flow

The initial journey for users discovering the application.

#### Screens
1. **Welcome Page**: Pure informational, explains value proposition
   - No direct product access, only information
   - Describes features, benefits, and workflow
   - Contains "Get Started" or "Sign In" links to Home page
   - Multiple information sections with detailed explanations

2. **Home Page**: Authentication gateway
   - Clear sign-in options prominently displayed
     - GitHub OAuth (recommended)
     - GitLab OAuth (recommended)
     - Email authentication
   - Link back to Welcome page for users who want more information
   - Persistent header and footer for brand consistency

3. **Authentication Process**:
   - OAuth provider selection
   - Provider authentication screen
   - Account linking/creation
   - Email verification (for email authentication)
   - Redirect to Dashboard after successful authentication
   
4. **Dashboard**: Entry point to application features
   - Welcome message for new users
   - Quick access to analyze new PR
   - Learning resources and guides
   - Account status and free usage counter
   - Premium features preview for free tier users

#### User Steps
1. User visits Welcome page to learn about the service
2. User clicks "Get Started" to proceed to Home page
3. User selects authentication method (GitHub/GitLab/Email)
4. User completes authentication process
5. User arrives at personalized Dashboard
6. User initiates their first PR analysis

### 2. PR Analysis Flow

The core workflow for analyzing a pull request and receiving feedback.

#### Screens
1. **Dashboard**: Starting point for authenticated users
   - "Analyze New PR" button prominently displayed
   - Previous analyses listed if any exist
   - Resource usage indicators (used 2/5 free analyses)

2. **PR Input**: Form for entering PR URL or selecting from repositories
   - Clear instructions
   - URL input field with validation
   - Repository browser with recent/connected repos
   - Analysis options and settings

3. **Analysis Queue**: Status of analysis in progress
   - Progress visualization
   - Estimated completion time
   - Option to cancel analysis

4. **Results View**: Detailed feedback from analysis
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
   - Additional service offers (full for subscribers, limited for free tier)

5. **Export Options**: Export results to external systems
   - Export to PR comments
   - Download report (PDF/Markdown)
   - Push suggestions to GitHub/GitLab
   - Share results

#### User Steps
1. User navigates to Dashboard
2. User clicks "Analyze New PR"
3. User enters PR URL or selects from repositories
4. System checks repository analysis limits before proceeding
   - If limit reached, prompts for upgrade
   - If within limits, proceeds with analysis
5. System queues PR for analysis and shows progress
6. User is notified when analysis is complete
7. User reviews feedback and suggestions
8. User applies suggestions or exports results

#### Repository Analysis Limits
- Each repository has a limit of 5 free analyses
- System tracks analysis count per repository
- Prevents abuse through multiple accounts
- User can see remaining analyses for each repository

### 3. Authentication Flows

Different ways users can authenticate with the application.

#### OAuth Flow (GitHub/GitLab)
1. User clicks "Continue with GitHub/GitLab" on Home page
2. User is redirected to provider's authorization page
3. User approves access permissions
4. User is redirected back to PR Reviewer
5. System creates/updates user account
6. User arrives at Dashboard

#### Email Flow
1. User clicks "Continue with Email" on Home page
2. User enters email address
3. System sends magic link to email
4. User clicks link in email
5. User is redirected to PR Reviewer with authenticated session
6. User arrives at Dashboard

### 4. Dashboard Flow (Registered Users)

The main dashboard experience for registered users.

#### Screens
1. **Dashboard**: Overview of user's activity and options
   - Recent analyses with status and timestamps
   - Quick stats and trends
   - Usage metrics (free analyses remaining)
   - Quick actions (New Analysis, View History)
   - Subscription status and upgrade options

2. **Account Overview**: User profile and settings
   - Profile information
   - Subscription details
   - Usage statistics
   - Skill development trends

#### User Steps
1. User logs in and is directed to Dashboard
2. User sees overview of recent activity and metrics
3. User selects action (new analysis, view history, etc.)

### 5. Subscription Management Flow

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
1. User navigates to pricing page from Dashboard
2. User compares available plans
3. User selects desired plan
4. User enters payment information
5. System processes payment and activates subscription
6. User receives confirmation and updated account status

### 6. History Review Flow

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
1. User navigates to history section from Dashboard
2. System displays list of past analyses
3. User filters or searches for specific analyses
4. User selects specific analysis to view
5. System loads detailed results
6. User optionally compares with other analyses

## Screen Map (Updated)

### Application Structure

```
├── Welcome Page (Public)
├── Home Page (Authentication Gateway)
├── Auth
│   ├── OAuth Provider Flows
│   ├── Email Authentication
│   └── Password Reset
├── Dashboard (Authenticated)
│   ├── Overview
│   ├── Recent Analyses
│   └── Quick Actions
├── PR Analysis
│   ├── PR Input
│   ├── Analysis Queue/Progress
│   └── Results View
│       ├── Summary
│       ├── Category Cards
│       ├── Detailed Issue Views
│       └── Export Options
├── History
│   ├── History List
│   ├── History Detail
│   └── Trends & Metrics
├── Account
│   ├── Profile Settings
│   ├── Subscription Management
│   └── Notification Preferences
└── Help & Resources
    ├── Documentation
    ├── FAQs
    └── Support
```

### Navigation Structure

1. **Public Navigation**
   - Logo (links to Welcome for unauthenticated, Dashboard for authenticated)
   - Sign In/Join button
   - Learn More links
   - Language/Theme controls

2. **Authenticated Navigation**
   - Logo (links to Dashboard)
   - Main sections:
     - Dashboard
     - Analyze
     - History
     - Account
   - User profile dropdown
   - Subscription indicator

3. **Contextual Navigation**
   - Breadcrumbs for deep navigation
   - Back buttons for multi-step processes
   - Category tabs in analysis results

## Interaction Models

### Responsive Navigation

1. **Desktop Navigation**
   - Full horizontal menu in header
   - Primary sections: Services, Pricing, About
   - Authentication button prominently displayed
   - Language selector and theme toggle accessible

2. **Mobile Navigation**
   - Collapsible menu triggered by hamburger icon
   - Slides down below header when activated
   - Maintains same navigation structure as desktop
   - Closes automatically after selection

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

### Theme Mode Consistency

1. **Light/Dark Mode Support**
   - All components support both light and dark modes
   - Seamless transitions between modes when toggled
   - Proper color contrasts maintained in both modes
   - Form elements maintain consistent styling across modes

2. **Dropdown Component Behavior**
   - Dropdowns maintain theme consistency even when expanded
   - Selection indicators visible in both modes
   - Hover states appropriate to current theme
   - Z-index management prevents visual artifacts

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

## Repository Analysis Limits

To prevent abuse while still offering a free tier:

1. **Repository-Based Limits**
   - Each unique repository is limited to 5 free analyses
   - System creates a fingerprint of each repository (repo name, owner, structure)
   - Counters track analyses used per repository
   - Applies across all user accounts

2. **User Experience**
   - Users see remaining free analyses for each repository
   - Clear messaging when approaching or hitting limits
   - Upgrade prompts when limits are reached
   - No interruption of analysis flow for analyses within limits

3. **Implementation Details**
   - Database stores repository fingerprints with analysis counts
   - System checks limits before starting analysis
   - Repository information obtained from PR URL or API
   - Unique identifiers prevent duplicate counting

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

Based on the updated user flow, the following screens should be implemented first:

1. **Welcome Page**
   - Purely informational
   - Links to Home/authentication

2. **Home Page**
   - Authentication gateway
   - OAuth and email options

3. **Dashboard**
   - Starting point for authenticated users
   - Quick access to features
   - Usage tracking and history

4. **PR Input Screen**
   - Repository selection options
   - URL input with validation
   - Analysis settings

5. **Results View**
   - Summary dashboard with metrics
   - Category-based feedback organization
   - Detailed code suggestions

These screens enable the complete user journey from discovery to using the core features, with proper authentication and analysis limits in place.

## Implementation Progress

### Completed
- ✅ Basic UI component library implementation
- ✅ Welcome Page implementation
- ✅ Home Page implementation
- ✅ Dark/light mode theming system
- ✅ Mobile responsive navigation
- ✅ Form components with proper validation
- ✅ Demo scheduling page

## Next Steps

1. Complete authentication integration with OAuth providers
2. Implement repository analysis tracking system
3. Build user dashboard for authenticated users
4. Finalize results view with enhanced features
5. Create subscription management flows
6. Integrate core package functionality with UI components
