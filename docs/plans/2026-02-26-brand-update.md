# Blog Brand Update Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Align the blog's visual identity with the Diabol AI brand — new color palette, fonts, pill-shaped navbar, oxford footer, and updated component styling.

**Architecture:** Pure CSS/Tailwind token swap + component rewrites. No schema, pipeline, or logic changes. Dark mode support via existing `class` strategy. All changes are visual-layer only.

**Tech Stack:** Next.js 16, Tailwind CSS, next/font/google, React 19

**Design doc:** `docs/plans/2026-02-26-brand-update-design.md`

---

## Preserved (DO NOT TOUCH)

- Post card `hover:-translate-y-1 hover:shadow-lifted` animation
- Card grid layout, image aspect ratios
- `shadow-lifted` boxShadow definition
- Dark/light toggle logic (ThemeSwitch component)
- Sanity schema, content pipeline, publish API
- GetNavbar routing logic (navbar vs navbaralt)

---

### Task 1: Add design tokens to Tailwind config

**Files:**
- Modify: `tailwind.config.js`

**Step 1: Add Diabol color tokens**

In `tailwind.config.js`, add these colors inside `extend.colors` (after the existing `gray` entry):

```js
westar: '#DCDBD3',
oxford: '#0A2843',
orange: {
  DEFAULT: '#FF4F30',
  dark: '#E64528',
},
'near-black': '#111111',
```

Keep existing: `brand`, `dark`, `gray`.

**Step 2: Replace font families**

Replace the entire `fontFamily` block:

```js
fontFamily: {
  display: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
  mono: ['var(--font-jetbrains)', ...defaultTheme.fontFamily.mono],
},
```

This removes `sans` (Roboto), `serif` (Poppins), `stock`.

**Step 3: Verify config is valid**

Run: `npx tailwindcss --help`
Expected: No syntax errors. (Full build verification comes later.)

**Step 4: Commit**

```bash
git add tailwind.config.js
git commit -m "feat: add Diabol brand color tokens and font families"
```

---

### Task 2: Swap font imports in layout

**Files:**
- Modify: `app/(website)/layout.tsx`

**Step 1: Replace font imports**

Replace:
```tsx
import { Poppins, Roboto } from "next/font/google";
```
With:
```tsx
import { Inter, JetBrains_Mono } from "next/font/google";
```

**Step 2: Replace font declarations**

Replace the `poppins` and `roboto` const declarations with:

```tsx
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "600", "700", "800", "900"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "700"],
});
```

**Step 3: Update html className**

Replace:
```tsx
className={cx(poppins.variable, roboto.variable)}
```
With:
```tsx
className={cx(inter.variable, jetbrains.variable)}
```

**Step 4: Update body className**

Replace:
```tsx
<body className="text-gray-800 antialiased dark:bg-dark-background dark:text-gray-400">
```
With:
```tsx
<body className="font-display text-near-black antialiased bg-westar dark:bg-dark-background dark:text-gray-400">
```

Note: `bg-westar` is added here directly on body (no need for `@layer base` since this is the only layout). The `pt-24` offset for fixed nav will be added to the `<main>` element instead.

**Step 5: Add padding offset for fixed navbar**

Replace:
```tsx
<main>{children}</main>
```
With:
```tsx
<main className="pt-24">{children}</main>
```

**Step 6: Commit**

```bash
git add app/(website)/layout.tsx
git commit -m "feat: swap to Inter + JetBrains Mono fonts, update body styling"
```

---

### Task 3: Add base layer styles

**Files:**
- Modify: `styles/tailwind.css`

**Step 1: Add dark mode body override**

Add after the `@tailwind utilities;` line:

```css
@layer base {
  .dark body {
    @apply bg-dark-background;
  }
}
```

The light mode `bg-westar` is set on the body element in layout.tsx. This base layer ensures dark mode override works correctly even when Tailwind purges.

**Step 2: Commit**

```bash
git add styles/tailwind.css
git commit -m "feat: add dark mode base layer styles"
```

---

### Task 4: Rewrite the navbar

**Files:**
- Modify: `components/navbar.js`

**Step 1: Full rewrite**

Replace the entire file content with:

```jsx
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
```

Key changes:
- `fixed` instead of `sticky`, pill-shaped (`rounded-full`), centered with `left-1/2 -translate-x-1/2`
- `bg-westar` / `dark:bg-oxford` with scroll-based blur
- No longer uses `Container` component
- Added nav links (Voice Agents, AI Content, AI Avatars, Blog)
- Added "Book a Call" CTA button
- Mobile hamburger menu for links

**Step 2: Verify no import errors**

Run: `npx next lint components/navbar.js`
Expected: No errors.

**Step 3: Commit**

```bash
git add components/navbar.js
git commit -m "feat: rewrite navbar as pill-shaped fixed nav with brand colors"
```

---

### Task 5: Rewrite the footer

**Files:**
- Modify: `components/footer.js`

**Step 1: Full rewrite**

Replace the entire file content with:

```jsx
import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  Services: [
    { label: "Voice Agents", href: "https://www.diabolai.com/voice-agents" },
    { label: "AI Content", href: "https://www.diabolai.com/ai-content" },
    { label: "AI Avatars", href: "https://www.diabolai.com/ai-avatars" },
  ],
  Company: [
    { label: "About", href: "https://www.diabolai.com/about" },
    { label: "Contact", href: "https://www.diabolai.com/contact" },
    { label: "Book a Call", href: "https://www.diabolai.com/book-a-call" },
  ],
  Blog: [
    { label: "All Posts", href: "/" },
    { label: "AI Voice Agents", href: "/category/ai-voice-agents" },
    { label: "AI for Business", href: "/category/ai-for-business" },
  ],
};

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/diabolai",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/diabolai",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-oxford">
      <div className="max-w-screen-xl mx-auto px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand column */}
          <div>
            <Link href="https://www.diabolai.com">
              <Image
                src="/img/diabol-logo-white.png"
                width={130}
                height={26}
                alt="Diabol AI"
              />
            </Link>
            <p className="mt-4 text-sm text-white/60 font-display">
              AI solutions for businesses that want to move fast.
            </p>
            <div className="flex items-center space-x-4 mt-6">
              {socialLinks.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-orange transition-colors"
                  aria-label={social.label}>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40 mb-4">
                {group}
              </h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      {...(!link.href.startsWith("/") && {
                        target: "_blank",
                        rel: "noopener noreferrer",
                      })}
                      className="text-white/70 text-sm font-display hover:text-orange transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 mt-8">
          <p className="text-white/40 text-xs">
            &copy; {new Date().getFullYear()} Diabol AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

Key changes:
- `bg-oxford` deep navy background
- 4-column grid: brand + 3 link groups
- Hardcoded social links (LinkedIn + X) — no longer reads from `props.social`
- Mono uppercase group headers
- Footer no longer uses `Container` component
- No longer accepts `props` (copyright, social from settings)

**Step 2: Update layout.tsx footer call**

In `app/(website)/layout.tsx`, the footer is called as `<Footer {...settings} />`. Since the new footer doesn't use props, change to:

```tsx
<Footer />
```

**Step 3: Commit**

```bash
git add components/footer.js app/(website)/layout.tsx
git commit -m "feat: rewrite footer with oxford navy bg and link columns"
```

---

### Task 6: Update post card colors

**Files:**
- Modify: `components/ui/label.js`
- Modify: `components/postlist.js`

**Step 1: Update label.js — pill variant**

In `components/ui/label.js`, replace the pill className:

```
"inline-flex items-center justify-center font-bold px-2 h-6 text-sm bg-blue-50 text-blue-500 rounded-full shrink-0 dark:bg-gray-800 dark:text-gray-300"
```

With:

```
"inline-flex items-center justify-center font-bold px-2 h-6 text-sm bg-orange/10 text-orange rounded-full shrink-0 dark:bg-orange/10 dark:text-orange"
```

**Step 2: Update label.js — default variant**

Replace the default span className base:

```
"inline-block text-xs font-medium tracking-wider uppercase text-gray-500 dark:text-gray-400"
```

With:

```
"inline-block font-mono text-[10px] tracking-[0.18em] uppercase text-orange dark:text-orange"
```

**Step 3: Update postlist.js — title color**

In `components/postlist.js`, replace the h2 className:

```
"mt-2 text-xl font-normal leading-snug tracking-wider text-gray-800 dark:text-gray-100"
```

With:

```
"mt-2 text-xl font-normal leading-snug tracking-wider text-near-black dark:text-gray-100"
```

**Step 4: Update postlist.js — excerpt color**

Replace the excerpt paragraph className:

```
"mt-2 text-sm text-gray-600 dark:text-white"
```

With:

```
"mt-2 text-sm text-near-black/60 dark:text-white"
```

**Step 5: Commit**

```bash
git add components/ui/label.js components/postlist.js
git commit -m "feat: update post card labels and text to orange brand colors"
```

---

### Task 7: Redesign Table of Contents

**Files:**
- Modify: `components/tableOfContents.js`

**Step 1: Full styling update**

Replace the return statement (from `<nav` to the closing `</nav>`) with:

```jsx
<nav className="bg-white dark:bg-dark-background border border-near-black/10 dark:border-white/10 rounded-2xl p-6">
  <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-near-black/40 dark:text-white/40 mb-4">
    In This Article
  </h3>
  <ul className="space-y-2 text-sm">
    {headings.map(heading => (
      <li
        key={heading.id}
        className={heading.level === 3 ? "pl-4" : ""}
      >
        <a
          href={`#${heading.id}`}
          className={`block py-1 transition-colors ${
            activeId === heading.id
              ? "text-orange font-semibold border-l-2 border-orange pl-3"
              : heading.level === 3
                ? "text-near-black/50 dark:text-white/50 hover:text-near-black dark:hover:text-white"
                : "text-near-black/70 dark:text-white/70 hover:text-near-black dark:hover:text-white"
          }`}
          onClick={e => {
            e.preventDefault();
            const element = document.getElementById(heading.id);
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
              setActiveId(heading.id);
            }
          }}
        >
          {heading.text}
        </a>
      </li>
    ))}
  </ul>
</nav>
```

Key changes:
- White card with rounded-2xl and subtle border
- "IN THIS ARTICLE" mono header (was "On this page")
- Orange active state with left border (was blue)
- H2: `text-near-black/70`, H3: `text-near-black/50` + `pl-4`

**Step 2: Commit**

```bash
git add components/tableOfContents.js
git commit -m "feat: redesign TOC with white card and orange active state"
```

---

### Task 8: Update article page colors

**Files:**
- Modify: `app/(website)/post/sidebar/[slug]/sidebar.js`

**Step 1: Update TL;DR box**

Replace:
```jsx
<div className="prose prose-lg mx-auto mb-8 border-l-4 border-blue-500 pl-4 dark:prose-invert">
```

With:
```jsx
<div className="prose prose-lg mx-auto mb-8 border-l-4 border-orange bg-orange/5 pl-4 dark:prose-invert">
```

**Step 2: Update "View all posts" button**

Replace:
```jsx
className="bg-brand-secondary/20 rounded-full px-5 py-2 text-sm text-blue-600 dark:text-blue-500 "
```

With:
```jsx
className="bg-orange/10 rounded-full px-5 py-2 text-sm text-orange font-display font-semibold hover:bg-orange/20 transition-colors"
```

**Step 3: Commit**

```bash
git add app/(website)/post/sidebar/[slug]/sidebar.js
git commit -m "feat: update TL;DR and view-all button to orange brand colors"
```

---

### Task 9: Update inline code styling

**Files:**
- Modify: `lib/sanity/plugins/portabletext.js`

**Step 1: Add `code` mark to the components object**

In the `marks` object inside `components`, add a `code` entry. Add it after the `highlight` mark:

```js
code: props => (
  <code className="font-mono bg-near-black/5 text-orange px-1.5 py-0.5 rounded text-[0.9em]">
    {props.children}
  </code>
),
```

**Step 2: Commit**

```bash
git add lib/sanity/plugins/portabletext.js
git commit -m "feat: style inline code with orange brand color"
```

---

### Task 10: Build verification

**Step 1: Run dev server and visually verify**

Run: `pnpm dev`

Check:
- Homepage loads with westar background, Inter font
- Post cards have orange category labels, near-black text
- Card hover lift + shadow-lifted animation still works
- Navbar is pill-shaped, centered, has all 4 links + Book a Call
- Navbar blurs on scroll
- Footer shows oxford navy with link columns
- Dark mode toggle works in both navbar and content

**Step 2: Check an article page**

Navigate to any post (e.g., `/post/sidebar/[any-slug]`).

Check:
- TL;DR has orange left border + light orange bg
- Table of Contents has white card, "IN THIS ARTICLE" header
- TOC active heading shows orange with left border
- Sources section renders correctly
- Inline code (if present) shows orange with light bg
- "View all posts" button is orange-styled

**Step 3: Check mobile viewport**

Resize to mobile width:
- Navbar shows hamburger, links hidden
- Hamburger opens dropdown with all nav links + Book a Call
- Footer stacks to single column

**Step 4: Run production build**

Run: `pnpm build`
Expected: Build succeeds with no TypeScript or compilation errors.

**Step 5: Final commit (if any fixups needed)**

Only if build reveals issues that need fixing. Otherwise, no commit needed.

---

## Summary of all commits

| # | Message | Files |
|---|---------|-------|
| 1 | `feat: add Diabol brand color tokens and font families` | `tailwind.config.js` |
| 2 | `feat: swap to Inter + JetBrains Mono fonts, update body styling` | `app/(website)/layout.tsx` |
| 3 | `feat: add dark mode base layer styles` | `styles/tailwind.css` |
| 4 | `feat: rewrite navbar as pill-shaped fixed nav with brand colors` | `components/navbar.js` |
| 5 | `feat: rewrite footer with oxford navy bg and link columns` | `components/footer.js`, `app/(website)/layout.tsx` |
| 6 | `feat: update post card labels and text to orange brand colors` | `components/ui/label.js`, `components/postlist.js` |
| 7 | `feat: redesign TOC with white card and orange active state` | `components/tableOfContents.js` |
| 8 | `feat: update TL;DR and view-all button to orange brand colors` | `app/(website)/post/sidebar/[slug]/sidebar.js` |
| 9 | `feat: style inline code with orange brand color` | `lib/sanity/plugins/portabletext.js` |
