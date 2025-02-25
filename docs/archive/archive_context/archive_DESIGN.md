# PR Reviewer Design Guidelines

## UI Design Principles

### Visual Language
- **Color Scheme**
  - Primary: `#0f172a` (Slate 900)
  - Secondary: `#475569` (Slate 600)
  - Accent: `#3b82f6` (Blue 500)
  - Success: `#10b981` (Emerald 500)
  - Warning: `#f59e0b` (Amber 500)
  - Error: `#ef4444` (Red 500)
  - Background: `#f8fafc` (Slate 50)
  - Dark mode background: `#1e293b` (Slate 800)

- **Typography**
  - Base font: Inter
  - Code font: JetBrains Mono
  - Headings: 
    - H1: 2.25rem/2.5rem, font-weight: 700
    - H2: 1.875rem/2.25rem, font-weight: 700
    - H3: 1.5rem/2rem, font-weight: 600
  - Body: 1rem/1.5rem, font-weight: 400
  - Small text: 0.875rem/1.25rem, font-weight: 400

- **Spacing System**
  - Base unit: 4px
  - Scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px
  - Component spacing: 16px (default)
  - Section spacing: 32px (default)
  - Page margins: 24px (mobile), 48px (desktop)

- **Shadows**
  - Subtle: `0 1px 2px rgba(0, 0, 0, 0.05)`
  - Medium: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
  - Large: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`

- **Border Radius**
  - Small: 4px
  - Medium: 6px
  - Large: 8px
  - Round: 9999px (for pills, avatars)

### Design Tokens
All design values should be implemented using design tokens in Tailwind configuration:

```js
// tailwind.config.js example
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f172a',
          // ... other shades
        },
        // ... other color categories
      },
      spacing: {
        // ... custom spacing if needed beyond Tailwind defaults
      },
      borderRadius: {
        // ... custom radius values if needed
      },
      boxShadow: {
        // ... custom shadows
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
}
```

## Component Design

### Component Hierarchy
```
└── App
    ├── Layout
    │   ├── Navbar
    │   ├── Sidebar
    │   └── Footer
    ├── Pages
    │   ├── Dashboard
    │   ├── Repository
    │   ├── PullRequest
    │   ├── Analysis
    │   └── Settings
    └── Components
        ├── Common
        │   ├── Button
        │   ├── Input
        │   ├── Card
        │   └── Modal
        ├── Auth
        │   ├── SignIn
        │   ├── ProvidersMenu
        │   └── UserMenu
        ├── Repository
        │   ├── RepositoryList
        │   ├── RepositoryCard
        │   └── RepositoryStats
        ├── PullRequest
        │   ├── PRList
        │   ├── PRDetails
        │   └── PRDiff
        └── Analysis
            ├── AnalysisProgress
            ├── AnalysisSummary
            ├── Suggestions
            └── CodeAnnotations
```

### Component Guidelines

#### Pattern: Component + Hook
For complex components, separate business logic into custom hooks:

```tsx
// Component
function RepositoryList({ userId }: { userId: string }) {
  const { repositories, isLoading, error } = useRepositories(userId);
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <ul className="space-y-4">
      {repositories.map(repo => (
        <RepositoryCard key={repo.id} repository={repo} />
      ))}
    </ul>
  );
}

// Hook
function useRepositories(userId: string) {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    async function fetchRepositories() {
      try {
        setIsLoading(true);
        const repos = await repositoryService.getForUser(userId);
        setRepositories(repos);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchRepositories();
  }, [userId]);
  
  return { repositories, isLoading, error };
}
```

#### Component States
Every interactive component should handle these states:
- Default/Idle
- Loading/Processing
- Success
- Error
- Disabled
- Focused
- Hovered

### Responsive Design

#### Breakpoints
```
xs: 0px (base)
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

#### Mobile-First Approach
- Design for mobile first, then enhance for larger screens
- Use Tailwind's responsive prefixes consistently
- Minimize content shifts between breakpoints

#### Layout Patterns
- Stack vertically on mobile
- Use grids or multi-column layouts on larger screens
- Collapse navigation into menu on mobile
- Adjust spacing proportionally between breakpoints

## Interactions & Animations

### Transitions
- Use consistent timing: 150ms (fast), 300ms (medium), 500ms (slow)
- Default easing: cubic-bezier(0.4, 0, 0.2, 1) (standard)
- Enter transitions: fade in, slide in
- Exit transitions: fade out, slide out

### Loading States
- Use skeletons for content loading
- Use spinners for actions and submissions
- Include progress indicators for multi-step processes
- Always provide visual feedback for user actions

### Feedback Patterns
- Toast notifications for non-critical updates
- Modal dialogs for important decisions
- Inline validation for forms
- Success/error states for actions

## Accessibility Guidelines

### Standards Compliance
- Follow WCAG 2.1 AA standards
- Implement proper ARIA attributes
- Ensure keyboard navigation
- Maintain sufficient color contrast (4.5:1 minimum)

### Implementation Checklist
- Proper heading hierarchy (h1-h6)
- Alt text for all images
- Focus indicators for interactive elements
- Screen reader announcements for dynamic content
- Form labels and error messaging
- Skip navigation links
- Keyboard accessible components

## Code Review UI

### Diff Visualization
- Color scheme:
  - Added: `#dcfce7` background, `#166534` text (Light mode)
  - Removed: `#fee2e2` background, `#991b1b` text (Light mode)
  - Changed: `#fef3c7` background, `#92400e` text (Light mode)
  - Dark mode equivalents with appropriate contrast

- Line numbering: subdued color, right-aligned
- Code font: monospace, consistent size
- Syntax highlighting: using Prism.js themes

### Annotation Patterns
- Inline comments with threads
- Margin indicators for issues
- Severity indicators (critical, warning, info)
- Expandable code context
- Suggestion diff previews

### Review Results
- Summary cards with expandable details
- Category-based organization
- Severity filtering and sorting
- Actionable suggestions with apply/ignore options
- Progress tracking for addressed items

## Implementation Guidelines

### CSS Approach
- Use Tailwind utility classes as primary styling method
- Create component variants using cva (class-variance-authority)
- Extract common patterns to custom utility classes
- Use CSS variables for theme values

### State Management
- Use React Context for theme and authentication
- Use React Query for server state
- Use local component state for UI state
- Consider Zustand for complex shared state

### Code Organization
- Group components by feature domain
- Co-locate component styles and logic
- Use consistent naming conventions
- Document component APIs with TypeScript and comments
