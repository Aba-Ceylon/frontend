import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const fadeInUp = (element: string | Element, options = {}) => {
  return gsap.from(element, {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    ...options
  });
};

export const parallaxScroll = (element: string | Element, yPercent: number, options = {}) => {
  return gsap.to(element, {
    yPercent,
    ease: 'none',
    scrollTrigger: {
      scrub: 1.5,
      ...options
    }
  });
};

export const staggerFadeIn = (elements: string | Element[], options = {}) => {
  return gsap.from(elements, {
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
    ...options
  });
};

export const scaleIn = (element: string | Element, options = {}) => {
  return gsap.from(element, {
    scale: 0,
    opacity: 0,
    duration: 0.8,
    ease: 'back.out(1.7)',
    ...options
  });
};

export const slideInFromLeft = (element: string | Element, options = {}) => {
  return gsap.from(element, {
    x: -100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    ...options
  });
};

export const slideInFromRight = (element: string | Element, options = {}) => {
  return gsap.from(element, {
    x: 100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    ...options
  });
};

export const createScrollTrigger = (trigger: string | Element, animation: gsap.core.Tween, options = {}) => {
  return ScrollTrigger.create({
    trigger,
    animation,
    start: 'top 80%',
    end: 'bottom 20%',
    ...options
  });
};