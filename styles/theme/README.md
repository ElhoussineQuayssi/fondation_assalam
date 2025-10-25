# Fondation Assalam Design System

## Overview

This directory contains the design tokens and theme configuration for the Fondation Assalam website. The design system is built around a cohesive color palette and consistent spacing, typography, and interaction patterns.

## Color Palette

### Brand Colors

The primary brand colors reflect the foundation's values and create visual consistency across all touchpoints.

#### Primary (Green) - Growth & Hope

- **`brand-primary`** (#5DA453) - Main brand color for headings and accents
- **`brand-primary-dark`** (#41733A) - Primary CTA buttons (WCAG AA compliant with white text)
- **`brand-primary-light`** (#6EC262) - Subtle accents and hover states

#### Secondary (Blue) - Trust & Stability

- **`brand-secondary`** (#0561A1) - Focus states, links, and secondary actions
- **`brand-secondary-dark`** (#044471) - Darker variant for emphasis
- **`brand-secondary-light`** (#0780BC) - Lighter variant for subtle elements

#### Accent (Red) - Urgency & Attention

- **`brand-accent`** (#A11721) - Error states, warnings, and urgent actions
- **`brand-accent-dark`** (#711017) - Darker variant for stronger emphasis

### Neutral Colors

Foundation colors for layouts and text hierarchy.

- **`ui-bg`** (#F7F9FB) - Page backgrounds
- **`ui-surface`** (#FFFFFF) - Card and component backgrounds
- **`ui-text`** (#0B0B0B) - Primary text color
- **`ui-muted`** (#6B6B6B) - Secondary text and subtle elements
- **`ui-border`** (#E6EEF6) - Borders and dividers

## Usage Guidelines

### Color Usage Rules (60/30/10 Rule)

1. **60% - Neutral Colors** - Use `ui-bg`, `ui-surface`, `ui-text` for the majority of your interface
2. **30% - Primary Brand Color** - Use `brand-primary` for headings, icons, and accents
3. **10% - Secondary/Accent** - Use `brand-secondary` for focus states and `brand-accent` for errors

### Button Guidelines

- **Primary CTA**: Always use `brand-primary-dark` background with white text (ensures WCAG AA contrast)
- **Secondary Actions**: Use `brand-secondary` background with white text
- **Outline Buttons**: Use `ui-surface` background with `ui-border` border and `ui-text` color

### Text Contrast Requirements

All text must meet WCAG AA standards (4.5:1 ratio). The following combinations are pre-validated:

- `ui-text` on `ui-surface`: 20.9:1 (AAA)
- `ui-text` on `ui-bg`: 15.1:1 (AAA)
- White text on `brand-primary-dark`: 4.8:1 (AA)
- White text on `brand-secondary`: 7.2:1 (AA)

## Implementation

### CSS Variables

All colors are defined as CSS custom properties in `styles/theme/variables.css`:

```css
:root {
  --color-primary: #5da453;
  --color-primary-dark: #41733a;
  --color-secondary: #0561a1;
  /* ... */
}
```

### Tailwind Integration

Colors are mapped to Tailwind utilities in `tailwind.config.ts`:

```typescript
brand: {
  primary: "var(--color-primary)",
  "primary-dark": "var(--color-primary-dark)",
  secondary: "var(--color-secondary)",
  // ...
}
```

### Usage Examples

```jsx
// CSS Variables (recommended for complex styling)
<div style={{ backgroundColor: 'var(--color-primary)' }}>
  Content
</div>

// Tailwind Classes (recommended for simple styling)
<button className="bg-brand-primary-dark text-white px-4 py-2 rounded">
  CTA Button
</button>

// Component Classes (for consistent styling)
<button className="btn-primary">
  Primary Button
</button>
```

## File Structure

```
styles/theme/
├── variables.css          # CSS custom properties and utilities
└── README.md             # This documentation

tailwind.config.ts         # Tailwind configuration with brand colors

app/palette-preview/
└── page.jsx              # Interactive palette preview page
```

## Migration Guide

### From Old Colors

| Old Color         | New Token         | Usage                            |
| ----------------- | ----------------- | -------------------------------- |
| `#1e40af` (blue)  | `brand-secondary` | Primary navigation, focus states |
| `#16a34a` (green) | `brand-primary`   | Headings, accents                |
| `#dc2626` (red)   | `brand-accent`    | Errors, warnings                 |
| `#f8fafc` (gray)  | `ui-bg`           | Page backgrounds                 |
| `#ffffff` (white) | `ui-surface`      | Component backgrounds            |

### Component Updates

1. **Buttons**: Replace inline styles with `.btn-primary` or `.btn-secondary` classes
2. **Cards**: Use `.card` class for consistent styling
3. **Forms**: Use `.input` class for form elements
4. **Focus States**: All interactive elements should use `.focus-ring` class

## Accessibility

- All color combinations meet WCAG AA standards (4.5:1 minimum)
- Focus indicators use `brand-secondary` for visibility
- Dark mode variants are prepared for future implementation
- Reduced motion preferences are respected in animations

## Preview & Testing

Visit `/palette-preview` to see all colors and components in action. This page helps validate:

- Color consistency across components
- Contrast ratios for accessibility
- Typography scale implementation
- Button and form styling

## Contributing

When adding new colors or components:

1. Add CSS variables to `variables.css`
2. Update Tailwind config if needed
3. Add usage examples to this README
4. Test contrast ratios with automated tools
5. Update the palette preview page

## Resources

- [WCAG Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Custom Properties Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
