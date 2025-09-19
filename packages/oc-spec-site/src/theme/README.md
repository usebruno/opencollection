# Theme Configuration Guide

The theme system allows you to easily customize the entire site's appearance by modifying the configuration in `src/theme/index.js`.

## Usage in Components

### 1. Import the useTheme hook
```javascript
import { useTheme } from '../theme/ThemeProvider'
import { cn } from '../theme'
```

### 2. Access theme values
```javascript
function MyComponent() {
  const theme = useTheme();
  const { typography, colors, spacing } = theme;
  
  return (
    <h2 className={typography.heading.h2}>
      My Heading
    </h2>
  );
}
```

## Theme Structure

### Colors
- `primary`: Main brand color (blue)
- `secondary`: Secondary color (gray)
- `danger`: Error/warning states (red)
- `success`: Success states (green)
- `neutral`: Grays for text, backgrounds, borders

### Typography
- `heading`: h2, h3 styles
- `body`: default, small, xsmall text
- `code`: inline and block code styles

### Spacing
- `section`: Space between major sections
- `paragraph`: Space between paragraphs
- `element`: General element spacing

### Components
Pre-configured styles for:
- Tables
- Badges
- Property displays
- Sidebar

## Customizing the Theme

To change colors, fonts, or spacing across the entire site:

1. Open `src/theme/index.js`
2. Modify the desired values
3. All components using the theme will automatically update

### Example: Changing Primary Color
```javascript
// In src/theme/index.js
primary: {
  text: 'text-indigo-600',  // Changed from blue to indigo
  bg: 'bg-indigo-600',
  hover: 'hover:bg-indigo-700',
  light: 'bg-indigo-50',
  lightText: 'text-indigo-800'
}
```

### Example: Changing Font Sizes
```javascript
// In src/theme/index.js
typography: {
  heading: {
    h2: 'text-3xl font-bold mb-6',  // Larger h2
    h3: 'text-xl font-semibold mb-4'  // Larger h3
  }
}
```

## Helper Functions

### cn()
Utility for combining class names:
```javascript
<div className={cn(theme.colors.primary.bg, 'rounded-lg', isActive && 'shadow-lg')}>
```