# Design System

This document outlines the design principles and components for the PR Reviewer application.

## Design Principles

1. **Consistency**: Maintain consistent look and feel across the application
2. **Simplicity**: Keep UI elements simple and intuitive
3. **Feedback**: Provide clear feedback for all user actions
4. **Accessibility**: Ensure components are accessible to all users
5. **Responsiveness**: Design for all screen sizes and devices

## Design Tokens

### Colors

- **Primary**: `#4f46e5` (Indigo)
- **Secondary**: `#64748b` (Slate)
- **Success**: `#10b981` (Emerald)
- **Warning**: `#f59e0b` (Amber)
- **Error**: `#ef4444` (Red)
- **Background**: `#ffffff` (White)
- **Card**: `#f8fafc` (Slate 50)
- **Text**: `#0f172a` (Slate 900)
- **Muted Text**: `#64748b` (Slate 500)

### Typography

- **Base Font**: Inter, system-ui, sans-serif
- **Code Font**: Menlo, Monaco, Consolas, monospace
- **Scale**:
  - Heading 1: 2rem (32px)
  - Heading 2: 1.5rem (24px)
  - Heading 3: 1.25rem (20px)
  - Body: 1rem (16px)
  - Small: 0.875rem (14px)
  - Tiny: 0.75rem (12px)

### Spacing

- **Base Unit**: 0.25rem (4px)
- **Scale**: 0.25rem, 0.5rem, 0.75rem, 1rem, 1.5rem, 2rem, 3rem, 4rem, 6rem, 8rem

### Borders & Shadows

- **Border Radius**: 0.375rem (6px)
- **Border Width**: 1px
- **Shadow Small**: `0 1px 2px 0 rgb(0 0 0 / 0.05)`
- **Shadow Medium**: `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`
- **Shadow Large**: `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`

## Component Documentation

### Brand Identity

#### Logo

The PR Reviewer logo consists of a shield with code brackets and a checkmark, representing code safety and verification.

- **Variants**: Default (with text), Icon only
- **Sizes**: XS, SM, MD, LG, XL, 2XL
- **Props**:
  - `withText`: Boolean to show text with logo
  - `textPosition`: Position of text ("right" or "bottom")
  - `greenCheckmark`: Boolean to use green checkmark (default) or current color

#### Avatar

User avatars with support for images, initials, and logo fallback.

- **Sizes**: XS, SM, MD, LG, XL, 2XL
- **Variants**: Image, Initials, Logo, Custom Fallback
- **Props**:
  - `src`: Image source URL
  - `alt`: Alternative text/name (used for initials)
  - `fallback`: React node for custom fallback
  - `useLogo`: Boolean to use logo as fallback
  - `ring`: Ring size (none, sm, md, lg)
  - `ringColor`: Color of the ring

### Base Components

#### Button

- **Variants**: Default, Secondary, Outline, Ghost, Link, Destructive, Success, Warning
- **Sizes**: SM, Default, LG, Icon
- **Props**:
  - `variant`: Button style variant
  - `size`: Button size
  - `isLoading`: Boolean for loading state
  - `leftIcon`/`rightIcon`: Icons to display
  - `fullWidth`: Boolean for full width button
  - `asChild`: Boolean to use as polymorphic component

#### Card

Container for related content with a clean, bordered appearance.

- **Parts**: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- **Variants**: Default, Elevated, Outlined, Filled
- **Props**:
  - `variant`: Card style variant
  - `padding`: Padding size (none, sm, default, lg)

#### Input

Text input field for forms.

- **Variants**: Default, Filled, Flushed, Outlined
- **States**: Default, Error, Success, Disabled
- **Props**:
  - `variant`: Input style variant
  - `status`: Input status for validation
  - `leftElement`/`rightElement`: Elements to display inside input
  - `size`: Input size (sm, default, lg)

#### Typography

Text components for consistent typography.

- **Components**: Heading, Text, Code, Link
- **Props** (Heading):
  - `as`: HTML element to render (h1-h6)
  - `size`: Text size
  - `align`: Text alignment
  - `weight`: Font weight
- **Props** (Text):
  - `as`: HTML element to render
  - `size`: Text size
  - `variant`: Text style variant
  - `weight`: Font weight

### Code-specific Components

#### CodeBlock

Syntax-highlighted code display with line numbers and highlighting.

- **Props**:
  - `code`: String of code to display
  - `language`: Programming language for syntax highlighting
  - `showLineNumbers`: Boolean to show line numbers
  - `highlightLines`: Array of line numbers to highlight
  - `title`: Optional title for the code block

#### DiffViewer

Side-by-side or unified code diff viewer.

- **Props**:
  - `oldCode`: Previous code version
  - `newCode`: Updated code version
  - `filename`: Optional filename to display
  - `language`: Programming language for syntax highlighting
  - `viewType`: "split" or "unified" view

### Media Components

#### VideoPlayer

Embed video player with support for YouTube, Vimeo, and local sources.

- **Props**:
  - `src`: Video source URL or file
  - `type`: "youtube", "vimeo", or "local"
  - `ratio`: Aspect ratio (16:9, 4:3, etc.)
  - `controls`: Boolean to show video controls
  - `poster`: Preview image for local videos

#### Slideshow

Carousel/slideshow component for displaying multiple images or content.

- **Props**:
  - `slides`: Array of slide objects
  - `autoPlay`: Boolean to auto-advance slides
  - `interval`: Time between slides in ms
  - `showDots`: Boolean to show navigation dots
  - `showArrows`: Boolean to show navigation arrows

## Core UI Patterns

### Loading States

All interactive components should have consistent loading states:

1. **Button Loading**: Spinner replacing or alongside text
2. **Page Loading**: Centered spinner with optional message
3. **Content Loading**: Skeleton placeholders matching content shape

### Error States

Error handling patterns:

1. **Form Validation**: Inline error messages below inputs
2. **Network Errors**: Toast notifications for transient errors
3. **Fatal Errors**: Full-page error messages with recovery actions

### Navigation Patterns

1. **Primary Navigation**: Left sidebar with icon + text labels
2. **Secondary Navigation**: Tabs for related sections
3. **Breadcrumbs**: For deep navigation hierarchies
4. **Action Buttons**: Primary actions on top-right of content areas

## Next Steps

The following components are planned for the next phase:

1. **Form Components**: Checkbox, Radio, Select, Toggle
2. **Data Display**: Tables, Data Grids, Charts
3. **Feedback Components**: Toast, Progress, Skeletons
4. **Navigation Components**: Tabs, Breadcrumbs, Pagination
