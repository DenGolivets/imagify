"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ShoppingBag,
  Sparkles,
  MessageCircle,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SwingingLogo } from "./SwingingLogo";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Studio", href: "/studio", icon: ShoppingBag },
  { name: "Generate", href: "/generate", icon: Sparkles },
  { name: "Advisor", href: "/advisor", icon: MessageCircle },
  { name: "Pricing", href: "/pricing", icon: BarChart3 },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";

      // Focus the menu container or first element when opened
      const focusableElements = menuRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusableElements && focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      } else {
        menuRef.current?.focus();
      }

      const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsMobileMenuOpen(false);
        }
        if (e.key === "Tab") {
          if (!menuRef.current) return;
          const focusable = menuRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
          if (focusable.length === 0) return;
          const first = focusable[0] as HTMLElement;
          const last = focusable[focusable.length - 1] as HTMLElement;

          if (e.shiftKey) {
            if (document.activeElement === first) {
              last.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === last) {
              first.focus();
              e.preventDefault();
            }
          }
        }
      };

      window.addEventListener("keydown", handleKeydown);
      return () => window.removeEventListener("keydown", handleKeydown);
    } else {
      document.body.style.overflow = "unset";
      // Restore focus to the button when closing
      menuButtonRef.current?.focus();
    }
  }, [isMobileMenuOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-white/5 py-3 h-16"
          : "bg-transparent border-transparent py-5 h-20",
        isMobileMenuOpen && "bg-background border-white/5", // Force solid background when menu is open
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-full">
        {/* Logo */}
        <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
          <SwingingLogo showIcon={!isMobileMenuOpen} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-violet-400",
                pathname === link.href ? "text-violet-400" : "text-white/70",
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth/Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Example Auth State (assuming logged out for now) */}
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/5"
          >
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild variant="primary" size="sm">
            <Link href="/register">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-4">
          <Button
            ref={menuButtonRef}
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:bg-white/5"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "fixed inset-x-0 bottom-0 z-40 bg-background md:hidden overflow-y-auto pb-10",
              isScrolled ? "top-16" : "top-20",
            )}
            ref={menuRef}
            tabIndex={-1}
          >
            <nav className="flex flex-col p-8 gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "text-2xl font-display flex items-center gap-4 transition-colors",
                    pathname === link.href
                      ? "text-violet-400"
                      : "text-white/90",
                  )}
                >
                  <link.icon className="size-6 text-violet-500" />
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-white/10 my-4" />
              <Button asChild variant="primary" className="w-full text-lg h-14">
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full text-lg h-14 border-white/10"
              >
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  Log in
                </Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
