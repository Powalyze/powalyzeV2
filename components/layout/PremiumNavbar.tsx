"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, Sun, Moon } from 'lucide-react';

export default function PremiumNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // Check system preference
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      
      setScrolled(scrollTop > 20);
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  // Magnetic button effect
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ctaRef.current) return;
    
    const rect = ctaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    ctaRef.current.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  };

  const handleMouseLeave = () => {
    if (ctaRef.current) {
      ctaRef.current.style.transform = 'translate(0, 0)';
    }
  };

  return (
    <>
      <style jsx global>{`
        :root {
          --nav-text: #FFFFFF;
          --nav-bg: rgba(255, 255, 255, 0.1);
          --gold: #C9A227;
          --blue: #60A5FA;
        }

        .dark {
          --nav-text: #F5F5F5;
          --nav-bg: rgba(10, 10, 10, 0.6);
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .nav-animate {
          animation: slideDown 0.6s ease-out;
        }
      `}</style>

      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 nav-animate ${
          scrolled 
            ? 'backdrop-blur-xl shadow-lg' 
            : 'bg-transparent'
        }`}
        style={{
          backgroundColor: scrolled ? 'var(--nav-bg)' : 'transparent'
        }}
      >
        {/* Progress Bar */}
        <div 
          className="absolute top-0 left-0 h-[3px] bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />

        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo avec SVG */}
            <Link href="/" className="flex items-center gap-3 text-2xl font-bold" style={{ color: '#FFFFFF' }}>
              <svg width="32" height="32" viewBox="0 0 100 100" fill="none" className="flex-shrink-0">
                <circle cx="50" cy="50" r="48" stroke="#C9A227" strokeWidth="4"/>
                <path d="M30 55 L50 25 L70 55 L50 75 Z" fill="#C9A227"/>
              </svg>
              <span>Powalyze</span>
            </Link>

            {/* Desktop Links */}
            <ul className="hidden md:flex items-center gap-8">
              <li>
                <Link 
                  href="/cockpit" 
                  className="font-medium transition-colors hover:scale-105 transform duration-200"
                  style={{ color: '#FFFFFF' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--blue)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--nav-text)'}
                >
                  Cockpit
                </Link>
              </li>
              <li>
                <Link 
                  href="/intelligence" 
                  className="font-medium transition-colors hover:scale-105 transform duration-200"
                  style={{ color: 'var(--nav-text)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--blue)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--nav-text)'}
                >
                  IA Narrative
                </Link>
              </li>
              <li>
                <Link 
                  href="/services" 
                  className="font-medium transition-colors hover:scale-105 transform duration-200"
                  style={{ color: '#FFFFFF' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#60A5FA'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#FFFFFF'}
                >
                  Services
                </Link>
              </li>
              <li>
                <Link 
                  href="/tarifs" 
                  className="font-medium transition-colors hover:scale-105 transform duration-200"
                  style={{ color: '#FFFFFF' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#60A5FA'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#FFFFFF'}
                >
                  Tarifs
                </Link>
              </li>
            </ul>

            {/* Actions Desktop */}
            <div className="hidden md:flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-lg transition-all hover:scale-110 hover:rotate-12 duration-300"
                style={{ 
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  color: '#FFFFFF'
                }}
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* CTA with Magnetic Effect */}
              <Link
                ref={ctaRef}
                href="/login"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/50"
                style={{ willChange: 'transform' }}
              >
                Accéder au Cockpit
              </Link>
            </div>

            {/* Burger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg transition-colors"
              style={{ color: 'var(--nav-text)' }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden mt-[72px] transition-all duration-300"
          style={{ 
            backgroundColor: 'var(--nav-bg)',
            backdropFilter: 'blur(20px)'
          }}
        >
          <div className="flex flex-col p-6 gap-6">
            <Link 
              href="/cockpit" 
              className="text-lg font-medium transition-colors py-2"
              style={{ color: 'var(--nav-text)' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Cockpit
            </Link>
            <Link 
              href="/intelligence" 
              className="text-lg font-medium transition-colors py-2"
              style={{ color: 'var(--nav-text)' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              IA Narrative
            </Link>
            <Link 
              href="/services" 
              className="text-lg font-medium transition-colors py-2"
              style={{ color: 'var(--nav-text)' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              href="/tarifs" 
              className="text-lg font-medium transition-colors py-2"
              style={{ color: 'var(--nav-text)' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Tarifs
            </Link>

            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={toggleTheme}
                className="p-3 rounded-lg transition-all flex items-center gap-2"
                style={{ 
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  color: 'var(--nav-text)'
                }}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span className="text-sm font-medium">
                  {darkMode ? 'Mode Clair' : 'Mode Sombre'}
                </span>
              </button>
            </div>

            <Link
              href="/login"
              className="mt-4 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-lg text-center hover:opacity-90 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Accéder au Cockpit
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
