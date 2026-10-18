---
name: vercel-react-best-practices
description: >-
  Official React and Next.js performance and architecture optimization guidelines from Vercel Engineering. Use when writing React components, Next.js App Router pages, Server Actions, data fetching, optimizing bundle sizes, or eliminating waterfalls.
metadata:
  author: vercel
  version: "1.0.0"
---

# Vercel React & Next.js Best Practices

This skill outlines 70 high-impact performance rules categorized by priority, codified by Vercel Engineering for high-scale React and Next.js applications.

---

## Priority 1: Eliminating Waterfalls (CRITICAL)

- **`async-parallel`**: Execute independent promises concurrently using `Promise.all([fetchA(), fetchB()])` instead of sequential `await`.
- **`async-defer-await`**: Delay `await` calls until the exact conditional branch or component where data is required.
- **`async-cheap-condition-before-await`**: Check synchronous in-memory flags, feature gates, or cache hits before triggering expensive async network calls.
- **`async-suspense-boundaries`**: Wrap slow data-fetching components inside `<Suspense fallback={<Skeleton />}>` to enable incremental streaming server-side rendering (SSR).
- **`async-api-routes`**: Kick off database queries and background operations early in handler functions before resolving headers and responses.

---

## Priority 2: Bundle Size Optimization (CRITICAL)

- **`bundle-barrel-imports`**: Avoid importing from index/barrel files (e.g. `import { Button } from '@/components'`). Import directly from leaf modules (`import { Button } from '@/components/button'`) to prevent pulling unused modules into the bundle.
- **`bundle-dynamic-imports`**: Use `next/dynamic` or `React.lazy()` for heavy client-side components (rich text editors, charting libraries, 3D canvases, interactive modals).
- **`bundle-defer-third-party`**: Defer analytics, tracking scripts, and customer support widgets until after first hydration using `next/script` with `strategy="lazyOnload"`.
- **`bundle-preload`**: Trigger component or route prefetching when the user hovers or focuses on interactive links for near-instant transitions.

---

## Priority 3: Server-Side Performance & RSC (HIGH)

- **`server-auth-actions`**: Always verify session authentication and authorization inside Server Actions. Treat Server Actions with the same security rigor as public API endpoints.
- **`server-cache-react`**: Use `React.cache()` for per-request function memoization and deduplicating identical database queries within a single render pass.
- **`server-dedup-props`**: Never pass massive, redundant database objects to Client Components across the RSC boundary. Only serialize the exact fields needed by the client.
- **`server-hoist-static-io`**: Hoist static config, file reads, and constants to module scope so they are executed once on initialization rather than per-request.

---

## Priority 4: Client-Side Data Fetching (MEDIUM-HIGH)

- **`client-swr-tanstack`**: Use established data-fetching libraries (TanStack Query / SWR) for client-side state caching, deduplication, retry policies, and window focus refetching.
- **`client-optimistic-updates`**: Implement `useOptimistic` or mutation rollback handlers so user interactions reflect immediately without waiting for round-trip network delays.
- **`client-event-listeners`**: Always remove event listeners (`removeEventListener`), abort controllers (`AbortController.abort()`), and timer intervals in `useEffect` cleanup return functions.

---

## Priority 5: Re-render & DOM Optimization (MEDIUM)

- **`rerender-primitive-props`**: Prefer primitive props over complex object literals when possible to avoid breaking `React.memo` reference equality.
- **`rerender-state-colocation`**: Keep state as close to where it is used as possible. Lift state up only when siblings strictly require shared synchronization.
- **`rerender-composition-over-context`**: Pass components as `children` or render props to skip unnecessary re-renders of heavy subtrees when parent state updates.
- **`rendering-virtualization`**: Never render thousands of DOM nodes simultaneously. Virtualize window views for large tables, feeds, and select dropdowns.
- **`rendering-layout-reads`**: Avoid interleaved DOM reads (`getBoundingClientRect`, `offsetHeight`) and writes (`style.width`) in render loops to prevent browser layout thrashing.
