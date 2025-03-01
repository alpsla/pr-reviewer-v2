# Screen Designs

This document contains detailed design specifications for the priority screens of the PR Reviewer application.

## 1. Welcome Screen

The Welcome screen serves as the landing page and first impression for new users. It communicates the value proposition of PR Reviewer with a clean, professional interface.

### Layout Structure

#### Header
- **Logo** (left): PR Reviewer logo with "CodeQual" branding
- **Navigation** (center): Services, Pricing, About
- **UI Controls** (right): Language selector dropdown, Theme toggle
- **Call-to-Action** (far right): "Join Us" button

#### Hero Section
- **Background**: Subtle code pattern/gradient background
- **Title**: "AI-Powered Code Review"
- **Subtitle**: "Get professional code feedback in minutes"
- **Primary CTA**: "Try for Free" button
- **Secondary CTA**: "Learn More" link with downward arrow
- **Visual Element**: Animated code review illustration

#### Value Proposition Section
- **Title**: "Why Choose PR Reviewer"
- **Card Layout**: 3-column grid of benefit cards
  - Time savings
  - Code quality improvements
  - Progress tracking

#### Security Features Section
- **Title**: "Enterprise-grade Security"
- **Card Layout**: 4 security feature cards
  - Data protection
  - Secure authentication
  - Compliance readiness
  - LLM isolation
- **Security Certification Badges**: Future implementation placeholder

#### Team Collaboration Section
- **Title**: "Built for Teams and Organizations"
- **Card Layout**: 2×2 grid of team benefit cards
  - Knowledge sharing
  - Team performance analytics
  - Resource optimization
  - Standardization
- **Enterprise Features**: Horizontal badge row

#### Onboarding Slideshow
- **Title**: "How It Works"
- **Carousel**: 4-slide walkthrough of the process
- **Controls**: Left/right arrows and dot indicators

#### Free Trial Section
- **Headline**: "Start with 5 Free PRs"
- **Counter**: Visual indicator of free PRs remaining
- **CTA Button**: "Start Now"

#### Social Proof Section (Future)
- **Title**: "Trusted by Developers"
- **Testimonial Cards**: User testimonials with profile pictures

### Visual Design Elements

#### Color Scheme
- **Primary**: #3B82F6 (Bright blue)
- **Secondary**: #10B981 (Emerald green)
- **Background**: #FFFFFF / #0F172A (Dark mode)
- **Text**: #1E293B (Dark blue-gray)
- **Accent**: #F59E0B (Amber)

#### Typography
- **Headings**: Inter, semi-bold
- **Body**: Inter, regular, 16px
- **Code**: Fira Code, regular, 14px

#### Responsive Behavior
- **Desktop**: Full layout as described
- **Tablet**: 2-column layouts where appropriate
- **Mobile**: Single column, condensed navigation

## 2. PR Input Screen

The PR Input screen is where users submit a pull request for analysis. It provides a streamlined interface for entering PR URLs or selecting from repositories.

### Layout Structure

#### Header
- Same consistent header as Welcome screen
- **Breadcrumb**: Home > PR Analysis
- **Page Title**: "Analyze Your Pull Request"

#### URL Input Section
- **Instruction Text**: "Enter a GitHub or GitLab pull request URL to analyze"
- **URL Input Field**: Large text input with platform icons
- **Validation Feedback**: Success/error messages
- **Private Repository Handling**: Detection and access options
- **Submit Button**: "Analyze PR" (disabled until valid URL)

#### PR Preview Section
- **Title**: "PR Details" with repository icon
- **PR Metadata Display**:
  - PR title, repository name, author
  - Creation/update dates
  - Files changed, lines added/removed
- **Options**: Analysis type checkboxes, branch selection
- **Confirm Button**: "Confirm Analysis"

#### Recent Repositories Section
- **Title**: "Recent Repositories"
- **List View**: Grid of recently accessed repositories
- **Quick Select**: Click to prefill URL input

#### Repository Browser
- **Title**: "Browse Connected Repositories"
- **Search**: Filter repositories
- **List View**: Connected repositories with expandable PR lists

#### Analysis Options Panel
- **Title**: "Advanced Options" (collapsible)
- **Language Settings**: Language-specific toggles
- **Analysis Depth**: Slider from "Quick" to "Thorough"
- **Custom Rules**: Toggle for repository-specific rules

#### Subscription Status
- Free tier usage indicator or paid tier badge
- Upgrade CTA for free tier users

### Interactive Elements

- **Real-time Validation**: As user types, validate URL format
- **Auto-complete**: Suggest repositories as user types
- **Repository Selection**: Click to auto-fill URL
- **Expand/Collapse**: Toggle for advanced options

## 3. Results View Screen

The Results View screen presents analysis findings in a hierarchical, category-based structure with multi-level drill-down capabilities.

### Layout Structure

#### Header
- Same consistent header as other screens
- **Breadcrumb**: Home > PR Analysis > Results
- **Page Title**: "Analysis Results: [PR Title]"

#### Summary Dashboard
- **Overall Score**: Circular progress indicator (0-100)
- **Summary Metrics**: Critical issues, warnings, enhancements
- **Completion Time**: Analysis timestamp
- **LLM Model Information**: Model used, confidence level

#### Category Cards Section
- **Grid Layout**: 2-3 columns of category cards
- **Categories**: Code Quality, Dependencies, Performance, Security, Best Practices, Testing
- **Card Design**:
  - Header with icon and title
  - Category score circular progress indicator
  - Summary metrics in horizontal bar
  - Category-specific color coding
  - Interactive expansion on click

#### Expanded Category View
- **Header**: Category icon, color, title
- **Back Button**: Return to summary
- **Subcategory Navigation**: Tabs or secondary navigation
- **Filter Controls**: Severity, file type, search
- **Issue List**: Sortable list of detected issues

#### Issue Detail View
- **Issue Header**: Title, severity, file location
- **Code Context**: Syntax-highlighted snippet with problem area
- **Issue Description**: Explanation and impact
- **Recommendation**: Suggested solution approach with disclaimers

#### Action Panel
- **Export Options**: PR comments, report download
- **Batch Actions**: Review suggestions, dismiss minor issues
- **Feedback**: Helpfulness rating
- **IDE Integration**: Future implementation placeholder

### Interactive Elements

#### Card Expansion Behavior
- Click to expand category cards to full-width
- Smooth transition animation
- Persistent category header when expanded
- Breadcrumb navigation within category

#### Multi-level Drill-down
- Level 1: Category overview (cards)
- Level 2: Subcategory list with issue counts
- Level 3: Specific issues with summaries
- Level 4: Detailed issue with code context

#### Code Snippets
- Syntax highlighting for different languages
- Problem areas highlighted in red
- Suggested solutions in green
- Expand/collapse for more context

### Visual Design Elements

#### Category-based Color Coding
- **Code Quality**: Blue (#3B82F6)
- **Dependencies**: Purple (#8B5CF6)
- **Performance**: Green (#10B981)
- **Security**: Red (#EF4444)
- **Best Practices**: Amber (#F59E0B)
- **Testing**: Cyan (#06B6D4)

#### Status Indicators
- **Critical**: Red circular icon with exclamation
- **Warning**: Yellow triangle with exclamation
- **Enhancement**: Blue circle with arrow up
- **Info**: Gray circle with "i"

## 4. Error Pages and States

The application includes comprehensive error handling to maintain user trust even when issues occur.

### Error Types

- **Network/System Errors**: Connectivity issues, server problems
- **Not Found (404)**: Non-existent resources or pages
- **Permission Errors**: Lack of access to resources
- **Validation Errors**: Form input issues
- **Empty States**: Expected content not available

### Common Error Elements

- **Illustration**: Contextual to the error type
- **Title**: Clear, non-technical error message
- **Description**: Human-friendly explanation
- **Action Buttons**: Clear paths forward
- **Support Link**: Help or contact option

### Error-specific Designs

#### Network Error Modal
- **Title**: "Connection Issue"
- **Message**: Connection troubleshooting guidance
- **Actions**: Retry, contact support
- **Details**: Technical information (hidden by default)

#### Not Found Page
- **Title**: "Page Not Found"
- **Message**: Navigation assistance
- **Actions**: Dashboard return, search, support contact

## 5. Footer Service Pages

Common design template for Terms of Service, Privacy Policy, Contact, and other footer-linked pages.

### Common Structure

- **Hero Section**: Page title, brief description
- **Content Section**: Clear typography hierarchy
- **Navigation Aids**: Table of contents, back-to-top button

### Page-specific Layouts

#### Terms of Service / Privacy Policy
- Table of contents with anchor links
- Numbered sections and subsections
- Definition boxes for key terms

#### Contact Page
- Brief introduction
- Contact methods in card layout
- FAQ section with expandable questions

## Implementation Notes

These screen designs should be implemented with a focus on:

1. **Component Reuse**: Build reusable components that can be shared across screens
2. **Responsive Design**: Ensure proper adaptation to different screen sizes
3. **Accessibility**: Maintain keyboard navigation and screen reader support
4. **Performance**: Optimize animations and transitions for smooth interactions
5. **Consistent Styling**: Use the defined color palette and typography consistently

## Next Steps

1. Create high-fidelity mockups for each priority screen
2. Develop component prototypes to test interactions
3. Establish responsive breakpoints and behavior
4. Implement core UI components starting with the Button fix
