# Blog Brand Update Design

**Date:** 2026-02-26
**Scope:** Brand alignment — colors, fonts, navbar, footer, TOC, article styling
**Not in scope:** Sanity schema, content pipeline, card layout/grid/animations, dark mode toggle logic

## Files to Modify

| File | Change type |
|------|------------|
| `tailwind.config.js` | Add Diabol color tokens + font families |
| `app/(website)/layout.tsx` | Swap font imports (Inter + JetBrains Mono), update body class |
| `styles/tailwind.css` | Add base layer styles for light/dark backgrounds |
| `components/navbar.js` | Full rewrite — pill-shaped sticky nav |
| `components/footer.js` | Full rewrite — oxford bg, two-column links |
| `components/postlist.js` | Color-only — category labels, title, excerpt |
| `components/ui/label.js` | Color-only — orange mono categories, orange pills |
| `components/tableOfContents.js` | Redesign — white card, orange active state, mono header |
| `app/(website)/post/sidebar/[slug]/sidebar.js` | TL;DR box blue → orange, category styling |
| `lib/sanity/plugins/portabletext.js` | Inline code styling |

## 1. Design Tokens

### Colors (add to tailwind.config.js extend.colors)
```
westar:        '#DCDBD3'   // warm neutral — light mode background
oxford:        '#0A2843'   // deep navy — footer, dark nav
orange:        '#FF4F30'   // Portland Orange — brand accent
orange-dark:   '#E64528'   // hover state
near-black:    '#111111'   // primary text
```

Keep existing: `brand` palette, `dark.background`, `gray: colors.neutral`, `shadow-lifted`

### Fonts (replace fontFamily in tailwind.config.js)
```
display: ['var(--font-inter)', ...sans]
mono: ['var(--font-jetbrains)', ...mono]
```

Remove: `sans` (Roboto), `serif` (Poppins), `stock`

### Layout font imports (layout.tsx)
- Remove: Poppins, Roboto
- Add: Inter (400,600,700,800,900), JetBrains_Mono (400,500,700)
- CSS vars: --font-inter, --font-jetbrains
- Body: `font-display text-near-black antialiased dark:bg-dark-background dark:text-gray-400`

### Base styles (tailwind.css)
```css
@layer base {
  body { @apply bg-westar; }
  .dark body { @apply bg-dark-background; }
}
```

## 2. Navbar

Full rewrite of `components/navbar.js`.

- Position: `fixed top-6 left-1/2 -translate-x-1/2 z-50`
- Size: `max-w-5xl w-[calc(100%-2rem)]`
- Shape: `rounded-full px-6 py-3`
- Default: `bg-westar border border-near-black/10`
- Dark: `dark:bg-oxford dark:border-white/10`
- Scrolled: `bg-westar/80 backdrop-blur-md` / `dark:bg-oxford/80`
- Content: Logo | Nav links (hidden on mobile) | Book a Call + ThemeSwitch
- Nav links: Voice Agents, AI Content, AI Avatars (→ diabolai.com), Blog (→ /)
- CTA: `bg-near-black text-white rounded-full px-5 py-2 text-sm font-display font-semibold hover:bg-orange transition-colors`
- Body needs `pt-24` offset since nav is fixed

## 3. Footer

Full rewrite of `components/footer.js`.

- Background: `bg-oxford`
- Layout: `grid md:grid-cols-4 gap-8` inside `max-w-screen-xl mx-auto px-8 py-16`
- Left col: Logo (white), tagline, LinkedIn + X icons
- Right 3 cols: Services, Company, Blog link groups
- Group headers: `font-mono text-[10px] uppercase tracking-[0.18em] text-white/40`
- Links: `text-white/70 text-sm font-display hover:text-orange transition-colors`
- Bottom: `border-t border-white/10 pt-8 mt-8`, copyright `text-white/40 text-xs`
- Hardcode social links (not from Sanity settings)

## 4. Post Cards (color-only)

In `components/ui/label.js`:
- Default label: `font-mono text-[10px] uppercase tracking-[0.18em] text-orange` (+ dark: same)
- Pill label: `bg-orange/10 text-orange` (+ dark variant)

In `components/postlist.js`:
- Title: `text-near-black dark:text-gray-100` (minimal change)
- Excerpt: `text-near-black/60 dark:text-white`
- No changes to animation classes

## 5. Table of Contents

Redesign `components/tableOfContents.js`.

- Container: `bg-white dark:bg-dark-background border border-near-black/10 dark:border-white/10 rounded-2xl p-6`
- Header: `font-mono text-[10px] uppercase tracking-[0.18em] text-near-black/40 dark:text-white/40` — "IN THIS ARTICLE"
- H2: `text-sm font-display text-near-black/70 dark:text-white/70 hover:text-near-black`
- H3: same + `pl-4 text-near-black/50 dark:text-white/50`
- Active: `text-orange font-semibold border-l-2 border-orange pl-3`
- IntersectionObserver already exists — keep as-is

## 6. Article Page

In `sidebar.js` (the article component):
- TL;DR: `border-l-4 border-orange bg-orange/5` (was border-blue-500)
- TL;DR heading: keep as-is
- Category tags: same orange mono style from label.js

In `portabletext.js`:
- Inline code: `font-mono bg-near-black/5 text-orange px-1.5 py-0.5 rounded`

## Preserved (DO NOT TOUCH)

- Post card `hover:-translate-y-1 hover:shadow-lifted` animation
- Card grid layout, image aspect ratios
- `shadow-lifted` boxShadow definition
- Dark/light toggle logic (ThemeSwitch component)
- Sanity schema, content pipeline, publish API
- GetNavbar routing logic (navbar vs navbaralt)

## Verification

1. `npm run dev` — check homepage, article page, mobile viewport
2. Verify post card lift animation works
3. Verify dark/light toggle works in both navbar and content
4. Verify all nav links to diabolai.com open correctly
5. `npm run build` — no TypeScript/build errors
