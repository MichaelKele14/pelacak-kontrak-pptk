---
name: web-design-guidelines
description: >-
  Review and implement UI code complying with modern Web Interface Guidelines, WCAG accessibility, visual hierarchy, form UX, responsive typography, and layout stability. Use when building UI components, reviewing web interfaces, auditing UX, or styling web pages.
metadata:
  author: vercel-labs
  version: "1.2.0"
---

# Web Interface Guidelines & UI/UX Standards

This skill provides an exhaustive, production-grade checklist and operational rules for building and auditing modern web interfaces. It combines Vercel's official Web Interface Guidelines with modern web standards (WCAG 2.2 AA/AAA, Core Web Vitals).

---

## 1. Accessibility (A11y) & Semantic Structure

- **Semantic Elements First**: Always use semantic HTML (`<button>`, `<a>`, `<label>`, `<nav>`, `<main>`, `<header>`, `<footer>`, `<dialog>`, `<table>`) before resorting to `<div>` or ARIA attributes.
- **Button vs Anchor**:
  - Use `<button>` for actions that trigger state changes, modals, or API calls.
  - Use `<a>` / `<Link>` for navigation that changes URL. Never `<div onClick>`.
- **Icon-Only Controls**: Every icon-only button must have an explicit `aria-label` or visually hidden `<span className="sr-only">`.
- **Decorative Media**: Decorative icons and background svgs must have `aria-hidden="true"`.
- **Images**: All `<img>` tags must have an `alt` attribute describing the content, or `alt=""` if purely decorative.
- **Form Association**: Every form input must have a programmatic `<label>` via `htmlFor="id"` or by nesting `<input>` inside `<label>`.
- **Dynamic & Async Updates**: Use `aria-live="polite"` on toast containers, search result counts, and dynamic status updates.
- **Heading Hierarchy**: Exactly one `<h1>` per page. Keep headings strictly nested (`h1` -> `h2` -> `h3`). Add `scroll-margin-top` to anchored headings.
- **Skip Links**: Include a visually-hidden skip link (`<a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>`) at the top of the page.

---

## 2. Focus States & Keyboard Navigation

- **Visible Focus Rings**: Never use `outline: none` or Tailwind `outline-none` without providing a prominent replacement like `focus-visible:ring-2 focus-visible:ring-offset-2`.
- **`:focus-visible` vs `:focus`**: Always use `:focus-visible` so mouse clicks don't show distraction rings while keyboard `Tab` navigation retains high contrast.
- **Compound Controls**: Use `:focus-within` on search bars or card containers containing multiple sub-actions.
- **Tab Trapping & Overlays**: Modals and drawer menus must trap focus inside while open and return focus to the trigger upon closing (`Escape` key support).
- **Sticky Element Clearance**: Sticky headers and fixed footers must never obscure the currently focused interactive element.

---

## 3. Form Usability & Micro-UX

- **Never Block Paste**: Never intercept `onPaste` with `preventDefault()` (e.g., OTP codes, credit cards, password fields). Users must be allowed to use password managers.
- **Input Types & Modes**:
  - Use semantic `type` attributes: `email`, `tel`, `url`, `number`, `password`.
  - Use `inputmode="numeric"` with `pattern="[0-9]*"` for PINs and OTP inputs.
- **Autocomplete Attributes**:
  - Always provide standard `autocomplete` tokens (`username`, `current-password`, `new-password`, `one-time-code`, `name`, `email`, `address-line1`).
  - Use `autocomplete="off"` for non-auth custom fields to prevent password manager popups.
- **Spellcheck Management**: Add `spellCheck={false}` to username, code, and email inputs.
- **Buttons & Loading State**:
  - Keep submit buttons enabled until the network request starts.
  - Show inline spinners or loading indicator during submission without collapsing dimensions.
- **Inline Validation**:
  - Display validation errors directly adjacent to the offending input.
  - On submit failure, auto-focus the first invalid field.
- **Placeholders**: Placeholders should show an example format, ending with ellipsis (`name@company.com…`), never substitute for a `<label>`.

---

## 4. Typography & Spacing Consistency

- **Glyphs**:
  - Use real ellipsis `…` (`&hellip;`), never three periods `...`.
  - Use proper curly quotes `“` `”` (`&ldquo;` `&rdquo;`) instead of straight quotes in editorial text.
  - Use non-breaking spaces `&nbsp;` before units (`10&nbsp;MB`, `⌘&nbsp;K`).
- **Tabular Numbers**: Apply `font-variant-numeric: tabular-nums` (Tailwind `tabular-nums`) to financial figures, timers, counters, and table columns.
- **Widow Prevention**: Apply `text-wrap: balance` on headlines and `text-wrap: pretty` on body paragraphs to eliminate orphan words.
- **Spacing Scale**: Stick to a consistent 4px / 8px grid (Tailwind `p-2`, `p-4`, `gap-6`). Avoid arbitrary pixel values (`p-[17px]`) unless strictly justified.

---

## 5. Layout Stability & Core Web Vitals (CWV)

- **Cumulative Layout Shift (CLS)**:
  - All `<img>` and `<video>` tags must include explicit `width` and `height` attributes or aspect-ratio containers (`aspect-video`, `aspect-square`).
  - Reserve space for asynchronous content (ads, skeleton loaders, charts) with min-heights.
- **Image Loading Strategy**:
  - Above-the-fold critical images: Add `priority` or `fetchpriority="high"`.
  - Below-the-fold images: Always set `loading="lazy"`.
- **Large Lists**: Virtualize lists with >50 items using `@tanstack/react-virtual` or CSS `content-visibility: auto`.
- **Text Truncation**: Flex child elements containing truncated text must declare `min-w-0` to allow `truncate` / `line-clamp-*` to function properly.

---

## 6. Animation & Motion Design

- **Reduced Motion Support**:
  - Wrap animations with `@media (prefers-reduced-motion: reduce)` or Tailwind `motion-reduce:animate-none` / `motion-reduce:transition-none`.
- **Hardware Acceleration**:
  - Animate only `transform` and `opacity` to keep animations on the compositor thread (60/120 FPS).
  - Never animate `width`, `height`, `margin`, or `top/left` properties as they trigger expensive layout reflows.
- **Transition Specificity**: Avoid `transition: all`. Explicitly enumerate transitioned properties: `transition-[transform,opacity] duration-200 ease-out`.
- **Interruptible Animations**: Ensure animations don't trap state or prevent users from interacting with the UI mid-transition.
