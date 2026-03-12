'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current || !backgroundRef.current || !contentRef.current) return;

    // Parallax effect for background
    gsap.to(backgroundRef.current, {
      yPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    // Fade out content on scroll
    gsap.to(contentRef.current, {
      opacity: 0,
      y: -100,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // Animate scroll indicator
    if (scrollIndicatorRef.current) {
      gsap.to(scrollIndicatorRef.current, {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });
    }

    // Initial animations
    const tl = gsap.timeline();
    tl.from('.hero-headline', {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    })
    .from('.hero-subheadline', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    }, '-=0.8')
    .from('.hero-cta', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    }, '-=0.6');

  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* Background with Parallax */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 w-full h-[120%] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3)), url('/images/heritage/Hero1.jpg')`
        }}
      />

      {/* Content */}
      <div 
        ref={contentRef}
        className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto"
      >
        {/* Main Headline */}
        <h1 className="hero-headline font-cinzel text-5xl md:text-7xl lg:text-8xl font-medium mb-6 tracking-wider leading-tight">
          The Ultimate
          <br />
          <span className="text-amber-400">Heritage</span>
          <br />
          Experience
        </h1>

        {/* Subheadline */}
        <p className="hero-subheadline text-lg md:text-xl lg:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
          Discover the timeless beauty of Sri Lanka's over 2,500-years legacy through 
          <br className="hidden md:block" />
          curated heritage experiences that connect you to ancient wisdom
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button className="hero-cta bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-8 py-4 rounded-full font-semibold text-lg hover:from-amber-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            View Aba Packages
          </button>
          
          <button className="hero-cta border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105">
            Your Journey Planner
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white flex flex-col items-center cursor-pointer"
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center mb-2">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
        <span className="text-sm font-light tracking-widest">SCROLL</span>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-1 h-20 bg-amber-400 opacity-60 hidden lg:block"></div>
      <div className="absolute bottom-1/4 right-10 w-1 h-20 bg-amber-400 opacity-60 hidden lg:block"></div>
    </section>
  );
}