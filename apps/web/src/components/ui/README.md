# CodeQual.dev Design System

This directory contains the implementation of the CodeQual.dev design system, focusing on the foundation setup and base components.

## Overview

The design system is built with a few core principles in mind:

1. **Consistency** - Using design tokens and carefully crafted components to ensure a consistent look and feel
2. **Accessibility** - Incorporating WCAG guidelines with proper semantics and keyboard navigation
3. **Composability** - Components can be combined in various ways to create complex interfaces
4. **Theming** - Support for both light and dark modes with a consistent color palette
5. **Performance** - Minimal bundle size and optimal rendering performance

## Component Structure

The components are built using:

- **Tailwind CSS** for styling
- **Class Variance Authority (CVA)** for component variants
- **React** with TypeScript for strong typing
- **Custom hooks** for separating business logic from presentation

## Files in this Directory

- **Brand Components**
  - `logo.tsx` - Logo component with various sizes and text options
  - `favicon.tsx` - Favicon component for web app head integration

- **Base Components**
  - `button.tsx` - Button component with various variants and states
  - `input.tsx` - Input component with different styles and states
  - `card.tsx` - Card component with header, content, and footer subcomponents
  - `typography.tsx` - Typography components (Heading, Text, Code, Link)
  - `alert.tsx`, `badge.tsx`, `dialog.tsx`, etc. - Additional UI components

- **Layout Components**
  - `layout.tsx` - Container, Stack, Grid, Divider, and AspectRatio components

- **Code-specific Components**
  - `code-block.tsx` - Syntax highlighted code blocks with line numbers
  - `diff-viewer.tsx` - Code diff viewer for PR reviews

- **Utilities**
  - `index.ts` - Exports all components for easy imports

## Demo

A demonstration page showcasing all components is available at `/app/design-system/page.tsx`.

## Usage

To use these components in your Next.js application:

```tsx
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export default function MyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is an example card.</p>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  );
}
```

## Design Tokens

The design system uses the following token categories:

- **Colors** - Primary, secondary, accent, and status colors
- **Typography** - Font families, sizes, weights, and line heights
- **Spacing** - Consistent spacing scale based on 4px
- **Shadows** - Elevation levels
- **Border radius** - Consistent rounding
- **Transitions** - Duration and timing functions

These tokens are defined in the project's Tailwind configuration.

## Next Steps

Future enhancements will focus on implementing more complex UI components:

- Navigation components (Header, Sidebar, Breadcrumbs)
- Feedback components (Alert, Toast)
- Interactive elements (Modal, Dropdown, Accordion)
- Form components (Select, Checkbox, Radio, etc.)
- Data visualization components (Charts, Graphs)
- And more

## Notes for Developers

When extending or modifying these components:

1. Maintain the existing variant patterns
2. Ensure all components have proper accessibility attributes
3. Test in both light and dark modes
4. Add appropriate TypeScript types
5. Keep the bundle size in mind
