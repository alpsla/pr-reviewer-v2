# Component Specifications

This document provides detailed specifications for key UI components of the PR Reviewer application. It serves as a reference for developers implementing these components.

## Core Components

### Button Component

The Button component is a fundamental UI element that appears throughout the application. The current implementation has rendering issues that need to be addressed.

#### Implementation Requirements

```jsx
// Button.jsx implementation
import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  // Base styles that apply to all variants
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Button component that supports various visual styles and states
 */
const Button = React.forwardRef(({
  className,
  children,
  variant,
  size,
  isLoading = false,
  disabled = false,
  ...props
}, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      ref={ref}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {typeof children === 'string' ? 'Loading...' : children}
        </>
      ) : (
        children
      )}
    </button>
  );
});

Button.displayName = 'Button';

export { Button, buttonVariants };
```

#### Variants and States

| Variant | Purpose | Visual Style |
|---------|---------|-------------|
| default | Primary actions | Solid blue background, white text |
| destructive | Dangerous actions | Red background, white text |
| outline | Secondary actions | Transparent with border |
| secondary | Alternative actions | Light gray background, dark text |
| ghost | Subtle actions | No background until hover |
| link | Navigation actions | Text with underline on hover |

#### Size Options

| Size | Height | Padding | Use Case |
|------|--------|---------|----------|
| sm | 36px (h-9) | px-3 | Tight spaces, compact UI |
| default | 40px (h-10) | py-2 px-4 | Standard button size |
| lg | 44px (h-11) | px-8 | Primary page actions, emphasis |
| icon | 40px (h-10, w-10) | N/A | Icon-only buttons |

#### States

- **Normal**: Default appearance
- **Hover**: Slightly darker background
- **Focus**: Ring outline for accessibility
- **Active**: Pressed state appearance
- **Disabled**: Reduced opacity, no pointer events
- **Loading**: Shows spinner icon with loading text

### Card Component

Card components are used throughout the interface to group related content, most prominently in the Results View for category cards.

#### Implementation Requirements

- Consistent padding, border-radius, and shadow
- Optional header, body, and footer sections
- Support for different background colors for categories
- Interactive states for clickable cards
- Expandable/collapsible behavior

#### Category Card Requirements

- Icon placement in top-left
- Category name as title
- Circular progress indicator in top-right
- Metadata display in horizontal bar
- Expandable on click with smooth animation

### Input Component

Input components are critical for the PR Input screen and other forms.

#### Implementation Requirements

- Clear visual states (default, hover, focus, error)
- Left-aligned labels
- Inline validation with error messages
- Support for leading and trailing icons/elements
- Consistent height and padding with button components

## Composite Components

### Header Component

The consistent header that appears across all pages.

#### Implementation Requirements

- Logo placement on left
- Centered navigation with responsive collapse
- Right-aligned UI controls (language, theme)
- Far-right authentication actions
- Responsive behavior for mobile devices
- Proper z-index for sticky positioning

### LLM Information Card

The card displaying information about the LLM model used for analysis.

#### Implementation Requirements

- Model name and badge
- Visual indicator for preferred/alternative model
- Expandable details section
- Confidence rating visualization
- Subtle, non-distracting design
- Tooltip for additional information

### Code Context Viewer

Displays code snippets with syntax highlighting and issue indicators.

#### Implementation Requirements

- Syntax highlighting for multiple languages
- Line numbers
- Highlighted problem areas
- Before/after comparison view
- Expandable to show more context
- Copy button functionality

### Category Drill-Down Navigation

The multi-level navigation system for Results View.

#### Implementation Requirements

- Breadcrumb component showing current location
- Smooth transitions between levels
- Consistent back navigation
- Preservation of state across navigation
- Responsive adaptation for smaller screens

## Implementation Notes

1. **Component Consistency**
   - All components should use the same design tokens
   - Maintain consistent spacing and sizing
   - Use the utility functions for class name merging

2. **Accessibility Requirements**
   - All interactive components must support keyboard navigation
   - Include proper ARIA attributes
   - Maintain adequate color contrast
   - Support screen readers

3. **Performance Considerations**
   - Use code-splitting for larger components
   - Implement virtualization for long lists
   - Optimize animations for performance

4. **Testing Approach**
   - Unit tests for all components
   - Visual regression tests for appearance
   - Interaction tests for complex components
   - Accessibility tests with automated tools

## Next Steps

1. Implement the Button component fix as highest priority
2. Create a component library with Storybook documentation
3. Establish visual testing pipeline
4. Develop composite components based on the fixed foundational components
