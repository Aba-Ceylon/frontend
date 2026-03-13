# GSAP Animation Quick Reference

## Import
```typescript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fadeInUp, parallaxScroll, staggerFadeIn } from '@/lib/animations/gsapAnimations';

// Register plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
```

## Basic Usage in Components

### 1. Setup with Context (Recommended)
```typescript
useEffect(() => {
  const ctx = gsap.context(() => {
    // Your animations here
    gsap.from('.element', { y: 100, opacity: 0 });
  });

  return () => ctx.revert(); // Cleanup
}, []);
```

### 2. Parallax Background
```typescript
gsap.to(backgroundRef.current, {
  yPercent: 30,
  ease: 'none',
  scrollTrigger: {
    trigger: sectionRef.current,
    start: 'top top',
    end: 'bottom top',
    scrub: 1.5
  }
});
```

### 3. Fade Out on Scroll
```typescript
gsap.to(contentRef.current, {
  opacity: 0,
  y: -150,
  scrollTrigger: {
    trigger: sectionRef.current,
    start: 'top top',
    end: 'bottom top',
    scrub: 1
  }
});
```

### 4. Entrance Animations
```typescript
const tl = gsap.timeline();
tl.from('.headline', { y: 100, opacity: 0, duration: 1.2 })
  .from('.subheadline', { y: 50, opacity: 0, duration: 1 }, '-=0.8')
  .from('.button', { y: 30, opacity: 0, stagger: 0.2 }, '-=0.6');
```

## ScrollTrigger Options

### Common Configurations
```typescript
scrollTrigger: {
  trigger: element,           // Element to watch
  start: 'top 80%',          // When to start (trigger position viewport position)
  end: 'bottom 20%',         // When to end
  scrub: true,               // Smooth scrubbing (or number for lag)
  pin: true,                 // Pin element during scroll
  markers: true,             // Debug markers (remove in production)
  toggleActions: 'play none none reverse'
}
```

### Start/End Positions
- `'top top'` - Element top hits viewport top
- `'top center'` - Element top hits viewport center
- `'top bottom'` - Element top hits viewport bottom
- `'center center'` - Element center hits viewport center
- `'bottom top'` - Element bottom hits viewport top

## Easing Functions

```typescript
ease: 'none'              // Linear
ease: 'power1.out'        // Gentle
ease: 'power2.out'        // Medium
ease: 'power3.out'        // Strong (recommended)
ease: 'power4.out'        // Very strong
ease: 'back.out(1.7)'     // Overshoot effect
ease: 'elastic.out(1, 0.3)' // Bounce effect
```

## Common Patterns

### Fade In on Scroll
```typescript
gsap.from('.element', {
  opacity: 0,
  y: 50,
  scrollTrigger: {
    trigger: '.element',
    start: 'top 80%',
    end: 'top 50%',
    scrub: 1
  }
});
```

### Stagger Animation
```typescript
gsap.from('.items', {
  y: 50,
  opacity: 0,
  stagger: 0.2,
  duration: 1,
  ease: 'power3.out'
});
```

### Infinite Loop
```typescript
gsap.to('.element', {
  y: 10,
  duration: 1.5,
  repeat: -1,
  yoyo: true,
  ease: 'power2.inOut'
});
```

### Scale on Hover (CSS Alternative)
```css
.element {
  transition: transform 0.3s ease;
}
.element:hover {
  transform: scale(1.05);
}
```

## Performance Tips

1. **Use `will-change`** for animated elements:
   ```css
   .animated { will-change: transform, opacity; }
   ```

2. **Prefer transforms** over position properties:
   - ✅ `x`, `y`, `scale`, `rotation`
   - ❌ `left`, `top`, `width`, `height`

3. **Use `scrub`** for scroll-linked animations (smoother)

4. **Cleanup** with `ctx.revert()` in useEffect return

5. **Batch animations** in single timeline when possible

## Debugging

```typescript
// Add markers to see trigger points
scrollTrigger: {
  markers: true,
  id: 'my-trigger'
}

// Refresh after dynamic content
ScrollTrigger.refresh();

// Kill specific triggers
ScrollTrigger.getById('my-trigger')?.kill();

// Kill all triggers
ScrollTrigger.getAll().forEach(t => t.kill());
```

## Royal Theme Animations

### Gold Glow Effect
```typescript
gsap.to('.element', {
  textShadow: '0 0 20px rgba(212, 175, 55, 0.8)',
  duration: 2,
  repeat: -1,
  yoyo: true
});
```

### Ornament Entrance
```typescript
gsap.from('.ornament', {
  scale: 0,
  rotation: 180,
  opacity: 0,
  duration: 1.5,
  ease: 'back.out(1.7)'
});
```

### Parallax Layers (Multiple Speeds)
```typescript
gsap.to('.layer-1', { yPercent: 20, scrollTrigger: { scrub: 1 } });
gsap.to('.layer-2', { yPercent: 40, scrollTrigger: { scrub: 1.5 } });
gsap.to('.layer-3', { yPercent: 60, scrollTrigger: { scrub: 2 } });
```

---

**Pro Tip**: Always test animations on different devices and screen sizes!
