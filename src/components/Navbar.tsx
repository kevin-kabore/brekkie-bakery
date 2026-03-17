"use client";

import { useState, useEffect } from "react";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { useCart } from "@/context/CartContext";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalQuantity } = useCart();

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
        scrolled
          ? "bg-cream/80 backdrop-blur-lg shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-18">
        {/* Brand logo */}
        <a href="#" className="flex flex-col leading-none">
          <span className="font-display text-espresso text-2xl tracking-tight">
            Brekkie
          </span>
          <span className="font-accent text-crust text-sm -mt-1">
            bakery
          </span>
        </a>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-body text-sm uppercase tracking-wider text-espresso/60 hover:text-espresso transition-all duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop icons */}
        <div className="hidden md:flex items-center gap-4">
          {/* Search icon */}
          <a
            href="#products"
            className="text-espresso/60 hover:text-espresso transition-all duration-300 p-2"
            aria-label="Search products"
          >
            <Search className="w-5 h-5" />
          </a>

          {/* Shopping bag with badge */}
          <a
            href="#order"
            className="relative text-espresso/60 hover:text-espresso transition-all duration-300 p-2"
            aria-label="Shopping bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalQuantity > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-crust text-cream text-[10px] font-bold h-[18px] min-w-[18px] px-1 rounded-full flex items-center justify-center animate-bounce">
                {totalQuantity}
              </span>
            )}
          </a>
        </div>

        {/* Mobile icons */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile cart */}
          <a
            href="#order"
            onClick={handleLinkClick}
            className="relative text-espresso/60 hover:text-espresso transition-all duration-300 p-2"
            aria-label="Shopping bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalQuantity > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-crust text-cream text-[10px] font-bold h-[18px] min-w-[18px] px-1 rounded-full flex items-center justify-center animate-bounce">
                {totalQuantity}
              </span>
            )}
          </a>

          {/* Hamburger / X toggle */}
          <button
            className="text-espresso p-2 transition-all duration-300"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0"
        } bg-cream/80 backdrop-blur-lg`}
      >
        <div className="max-w-6xl mx-auto px-6 pb-8 pt-2 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className="font-body text-sm uppercase tracking-wider text-espresso/60 hover:text-espresso transition-all duration-300 py-3 border-b border-espresso/5 last:border-b-0"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#products"
            onClick={handleLinkClick}
            className="flex items-center gap-2 font-body text-sm uppercase tracking-wider text-espresso/60 hover:text-espresso transition-all duration-300 py-3"
          >
            <Search className="w-4 h-4" />
            Search Products
          </a>
        </div>
      </div>
    </nav>
  );
}
