# Components Directory

This directory contains all the shared components for the PR Reviewer application.

## Directory Structure

- `/auth` - Authentication-related components
- `/icons` - Icon components
- `/layout` - Layout components (headers, footers, navigation)
- `/repository` - Repository-related components
- `/ui` - UI components (buttons, inputs, etc.)
- `/wrappers` - Component wrappers and HOCs
- `/welcome` - Welcome page components
- `/pr-input` - PR Input page components
- `/results` - Results view components

## Component Organization

According to our design specifications, components should be organized as follows:

### Layout Components (`/layout`)
- `header.tsx` - Header with navigation, language selector, and theme toggle
- `footer.tsx` - Footer with links and social icons

### Welcome Page Components (`/welcome`)
- `hero-section.tsx` - Hero section with animated code review illustration
- `value-proposition.tsx` - Value proposition cards
- `security-features.tsx` - Security features section
- `team-collaboration.tsx` - Team collaboration section
- `onboarding-slideshow.tsx` - Onboarding slideshow
- `free-trial-section.tsx` - Free trial section

### PR Input Components (`/pr-input`)
- `url-input.tsx` - URL input with validation and private repository handling
- `repository-selection.tsx` - Repository browser with PR selection
- `pr-preview.tsx` - PR metadata display and options
- `analysis-options.tsx` - Analysis customization options
- `subscription-status.tsx` - Subscription information

### Results View Components (`/results`)
- `summary-dashboard.tsx` - Overall results with LLM model information
- `category-card.tsx` - Individual category card with collapsible interface
- `category-grid.tsx` - Grid layout of category cards
- `code-context-viewer.tsx` - Code display with suggestions (future)

## Usage

All components should be imported from this directory:

```jsx
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
```
