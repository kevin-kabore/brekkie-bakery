"use client";

import { useState, useEffect } from "react";
import { NAV_LINKS } from "@/lib/constants";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleLinkClick() {
    setMenuOpen(false);
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-cream/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#" className="font-display text-navy text-2xl">
          BREKKIE
        </a>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-navy/70 hover:text-navy transition-colors duration-200 font-body text-sm uppercase tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <a
          href="#order"
          className="hidden md:inline-block rounded-full font-semibold transition-colors duration-200 bg-coral text-cream hover:bg-coral/90 px-6 py-3 text-sm"
        >
          ORDER NOW
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-navy p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {menuOpen ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        } bg-cream/95 backdrop-blur-sm`}
      >
        <div className="px-6 pb-6 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className="text-navy/70 hover:text-navy transition-colors duration-200 font-body text-sm uppercase tracking-wide py-2"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#order"
            onClick={handleLinkClick}
            className="rounded-full font-semibold transition-colors duration-200 bg-coral text-cream hover:bg-coral/90 px-6 py-3 text-sm text-center"
          >
            ORDER NOW
          </a>
        </div>
      </div>
    </nav>
  );
}
