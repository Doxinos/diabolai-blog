"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeSwitch from "./themeSwitch";
import { cx } from "@/utils/all";

const navLinks = [
  { label: "Voice Agents", href: "https://www.diabolai.com/voice-agents" },
  { label: "AI Content", href: "https://www.diabolai.com/ai-content" },
  { label: "AI Avatars", href: "https://www.diabolai.com/ai-avatars" },
  { label: "Blog", href: "/" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cx(
        "fixed top-6 left-1/2 -translate-x-1/2 z-50",
        "max-w-5xl w-[calc(100%-2rem)]",
        "rounded-full px-6 py-3",
        "border transition-all duration-300",
        scrolled
          ? "bg-westar/80 backdrop-blur-md border-near-black/10 dark:bg-oxford/80 dark:border-white/10"
          : "bg-westar border-near-black/10 dark:bg-oxford dark:border-white/10"
      )}>
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="https://www.diabolai.com" className="shrink-0">
          <Image
            src="/img/diabol-logo-black.png"
            width={130}
            height={26}
            alt="Diabol AI"
            priority
            className="dark:hidden"
          />
          <Image
            src="/img/diabol-logo-white.png"
            width={130}
            height={26}
            alt="Diabol AI"
            priority
            className="hidden dark:block"
          />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map(link => (
            <Link
              key={link.label}
              href={link.href}
              {...(!link.href.startsWith("/") && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
              className="text-sm font-display font-medium text-near-black/70 hover:text-near-black dark:text-white/70 dark:hover:text-white transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side: CTA + theme toggle */}
        <div className="flex items-center space-x-3">
          <a
            href="https://www.diabolai.com/book-a-call"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex bg-near-black text-white rounded-full px-5 py-2 text-sm font-display font-semibold hover:bg-orange transition-colors">
            Book a Call
          </a>
          <ThemeSwitch />

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1 text-near-black dark:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden mt-4 pb-2 flex flex-col space-y-3">
          {navLinks.map(link => (
            <Link
              key={link.label}
              href={link.href}
              {...(!link.href.startsWith("/") && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-display font-medium text-near-black/70 dark:text-white/70 hover:text-near-black dark:hover:text-white transition-colors">
              {link.label}
            </Link>
          ))}
          <a
            href="https://www.diabolai.com/book-a-call"
            target="_blank"
            rel="noopener noreferrer"
            className="sm:hidden inline-flex justify-center bg-near-black text-white rounded-full px-5 py-2 text-sm font-display font-semibold hover:bg-orange transition-colors">
            Book a Call
          </a>
        </div>
      )}
    </nav>
  );
}
