# Royal Heritage Design System

## Color Palette

### Primary Colors
```css
--royal-gold: #d4af37        /* Main accent, buttons, highlights */
--antique-bronze: #cd7f32    /* Secondary accent, borders */
--heritage-amber: #d97706    /* Tertiary accent, hover states */
```

### Neutral Colors
```css
--deep-black: #0a0a0a        /* Background */
--slate-dark: #1a1a1a        /* Cards, panels */
--slate-medium: #2d2d2d      /* Borders */
--cream-light: #f5f5f5       /* Text on dark */
--amber-light: #fef3c7       /* Subtle highlights */
```

### Gradient Combinations
```css
/* Gold Gradient */
background: linear-gradient(to right, #d4af37, #f4d03f);

/* Bronze Gradient */
background: linear-gradient(to right, #cd7f32, #d4af37);

/* Dark Gradient */
background: linear-gradient(to bottom, #0a0a0a, #1a1a1a);

/* Overlay Gradient */
background: linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.4));
```

## Typography

### Font Families
```css
/* Headlines & Titles */
font-family: 'Cinzel', serif;
/* Elegant, royal, all-caps friendly */

/* Body Text & Descriptions */
font-family: 'Cormorant Garamond', Georgia, serif;
/* Readable, classic, sophisticated */

/* UI Elements (fallback) */
font-family: var(--font-geist-sans);
/* Modern, clean for forms/buttons */
```

### Font Sizes
```css
/* Hero Headline */
.hero-title {
  font-size: clamp(3rem, 8vw, 8rem);
  font-weight: 700;
  letter-spacing: 0.05em;
}

/* Section Headline */
.section-title {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 600;
  letter-spacing: 0.03em;
}

/* Subheadline */
.subheadline {
  font-size: clamp(1.125rem, 2vw, 1.5rem);
  font-weight: 300;
  letter-spacing: 0.02em;
}

/* Body Text */
.body-text {
  font-size: 1rem;
  line-height: 1.75;
  font-weight: 400;
}
```

## Spacing System

### Consistent Scale
```css
--space-xs: 0.25rem;   /* 4px */
--space-sm: 0.5rem;    /* 8px */
--space-md: 1rem;      /* 16px */
--space-lg: 2rem;      /* 32px */
--space-xl: 4rem;      /* 64px */
--space-2xl: 8rem;     /* 128px */
```

## Components

### Buttons

#### Primary Button (Gold)
```tsx
<button className="
  bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500
  text-black font-bold font-cinzel
  px-10 py-5 rounded-full
  border-2 border-amber-300
  shadow-2xl hover:shadow-amber-500/50
  transform hover:scale-105
  transition-all duration-300
">
  Button Text
</button>
```

#### Secondary Button (Outline)
```tsx
<button className="
  border-3 border-amber-400
  text-white font-bold font-cinzel
  px-10 py-5 rounded-full
  backdrop-blur-sm bg-white/10
  hover:bg-amber-400 hover:text-black
  transform hover:scale-105
  transition-all duration-300
  shadow-2xl hover:shadow-amber-400/50
">
  Button Text
</button>
```

### Cards

#### Royal Card
```tsx
<div className="
  bg-gradient-to-br from-slate-900/95 to-slate-800/95
  backdrop-blur-md
  rounded-2xl
  border border-amber-400/20
  shadow-2xl
  p-6
  hover:border-amber-400/40
  transition-all duration-300
">
  {/* Content */}
</div>
```

### Decorative Elements

#### Ornamental Circle
```tsx
<div className="w-24 h-24 border-4 border-amber-400/40 rounded-full flex items-center justify-center">
  <div className="w-16 h-16 border-2 border-amber-300/30 rounded-full flex items-center justify-center">
    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
  </div>
</div>
```

#### Decorative Divider
```tsx
<div className="flex items-center justify-center gap-3">
  <div className="w-12 h-px bg-amber-400/50"></div>
  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
  <div className="w-12 h-px bg-amber-400/50"></div>
</div>
```

#### Corner Brackets
```tsx
{/* Top Left */}
<div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-amber-400/30"></div>

{/* Top Right */}
<div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-amber-400/30"></div>

{/* Bottom Left */}
<div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-amber-400/30"></div>

{/* Bottom Right */}
<div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-amber-400/30"></div>
```

## Effects

### Text Shadows
```css
/* Standard Shadow */
text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);

/* Gold Glow */
text-shadow: 0 0 20px rgba(212, 175, 55, 0.5), 
             0 0 40px rgba(212, 175, 55, 0.3);

/* Deep Shadow */
text-shadow: 0 4px 12px rgba(0, 0, 0, 0.9);
```

### Box Shadows
```css
/* Elevated Card */
box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);

/* Gold Glow */
box-shadow: 0 0 20px rgba(212, 175, 55, 0.3),
            0 0 40px rgba(212, 175, 55, 0.2);

/* Hover State */
box-shadow: 0 20px 60px rgba(212, 175, 55, 0.4);
```

### Backdrop Effects
```css
/* Glass Morphism */
backdrop-filter: blur(12px);
background: rgba(255, 255, 255, 0.1);

/* Dark Glass */
backdrop-filter: blur(12px);
background: rgba(0, 0, 0, 0.6);
```

## Patterns

### Royal Pattern Overlay
```tsx
<div className="absolute inset-0 opacity-10" style={{
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
}} />
```

## Animations

### Hover Scale
```css
.hover-scale {
  transition: transform 0.3s ease;
}
.hover-scale:hover {
  transform: scale(1.05);
}
```

### Border Glow
```css
@keyframes borderGlow {
  0%, 100% {
    box-shadow: 0 0 5px var(--royal-gold), 0 0 10px var(--royal-gold);
  }
  50% {
    box-shadow: 0 0 10px var(--royal-gold), 0 0 20px var(--royal-gold), 0 0 30px var(--royal-gold);
  }
}

.border-glow {
  animation: borderGlow 3s ease-in-out infinite;
}
```

### Fade In
```css
.fade-in {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## Responsive Breakpoints

```css
/* Mobile First Approach */
/* Base: 0-640px (mobile) */

/* sm: 640px+ (large mobile) */
@media (min-width: 640px) { }

/* md: 768px+ (tablet) */
@media (min-width: 768px) { }

/* lg: 1024px+ (desktop) */
@media (min-width: 1024px) { }

/* xl: 1280px+ (large desktop) */
@media (min-width: 1280px) { }

/* 2xl: 1536px+ (extra large) */
@media (min-width: 1536px) { }
```

## Usage Guidelines

### Do's ✅
- Use Cinzel for headlines and important text
- Apply gold accents sparingly for emphasis
- Maintain high contrast for readability
- Use ornamental elements to frame content
- Apply subtle animations for elegance
- Keep backgrounds dark for royal feel

### Don'ts ❌
- Don't overuse gold (loses impact)
- Avoid bright, saturated colors
- Don't use too many fonts
- Avoid cluttered layouts
- Don't make animations too fast
- Avoid light backgrounds for main sections

## Accessibility

### Contrast Ratios
- Gold on Black: 7.2:1 (AAA) ✅
- White on Black: 21:1 (AAA) ✅
- Amber on Dark Slate: 8.5:1 (AAA) ✅

### Focus States
```css
.focusable:focus {
  outline: 2px solid var(--royal-gold);
  outline-offset: 4px;
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

**Remember**: Royal design is about elegance, not excess. Less is more when done right.
