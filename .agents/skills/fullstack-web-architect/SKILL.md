---
name: fullstack-web-architect
description: >-
  Industry-standard best practices for full-stack web engineering. Use when architecting web applications, designing REST/tRPC APIs, modeling database schemas, implementing authentication/authorization, enforcing OWASP web security, and setting up automated testing suites.
metadata:
  author: antigravity-expert
  version: "1.0.0"
---

# Full-Stack Web Architecture & Engineering Standards

This skill codifies modern full-stack web engineering patterns, focusing on robust TypeScript design, type-safe API contracts, database resilience, and defense-in-depth web security.

---

## 1. Type-Safe API Boundaries & Validation

- **Runtime Boundary Validation**: Never trust external input. Validate all incoming API request payloads, query params, cookies, and environment variables at runtime using **Zod** or **Valibot**.
  ```typescript
  import { z } from 'zod';

  export const CreateUserSchema = z.object({
    email: z.string().email().toLowerCase().trim(),
    name: z.string().min(2).max(100).trim(),
    role: z.enum(['admin', 'member']).default('member'),
  });
  export type CreateUserInput = z.infer<typeof CreateUserSchema>;
  ```
- **Error Formatting**: Standardize API error payloads with machine-readable error codes and safe human-readable messages:
  ```json
  {
    "success": false,
    "error": {
      "code": "VALIDATION_FAILED",
      "message": "Invalid input provided",
      "details": [{ "field": "email", "issue": "Invalid email address" }]
    }
  }
  ```
- **Idempotency**: Use idempotency keys (`Idempotency-Key` header) for critical non-idempotent operations (payment processing, order creation) to protect against accidental retries and network race conditions.

---

## 2. Database Design & Query Performance

- **Relational Integrity**:
  - Enforce constraints at the database engine level (Foreign Keys with `ON DELETE CASCADE / SET NULL`, `CHECK`, and `UNIQUE` constraints).
  - Explicitly define indexes for columns used frequently in `WHERE`, `ORDER BY`, and `JOIN` clauses.
- **Connection Management & Pooling**:
  - In serverless / edge environments, always connect through a connection pooler (e.g. PgBouncer, Supabase Pooler, Neon Serverless Driver, Prisma Accelerate) to avoid exhausting PostgreSQL max connections.
- **Transactions & ACID**: Wrap multi-step related mutations inside an explicit database transaction (`prisma.$transaction`, `db.transaction()`) to guarantee all-or-nothing execution.
- **Pagination**: Prefer cursor-based (keyset) pagination (`WHERE id > cursor LIMIT 20`) over offset-based pagination (`OFFSET 10000`) for high-scale feeds and tables to avoid performance degradation.

---

## 3. Web Security & OWASP Top 10 Mitigation

- **Cross-Site Scripting (XSS)**:
  - Never use `dangerouslySetInnerHTML` without rigorous HTML sanitization (`DOMPurify`).
  - Rely on React/Next.js native string escaping.
- **Authentication & Sessions**:
  - Store session tokens in `HttpOnly`, `Secure`, `SameSite=Lax` (or `Strict`) cookies. Never store sensitive tokens in `localStorage`.
  - Hash passwords using **Argon2id** or **bcrypt** with appropriate cost factors.
- **Cross-Site Request Forgery (CSRF)**:
  - Enforce SameSite cookie policies.
  - Require CSRF tokens or custom headers (`X-Requested-With`) for mutating state endpoints.
- **Content Security Policy (CSP) & Headers**:
  - Configure robust HTTP security headers:
    - `Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-...'`
    - `X-Content-Type-Options: nosniff`
    - `X-Frame-Options: DENY`
    - `Referrer-Policy: strict-origin-when-cross-origin`
- **Rate Limiting**: Apply token bucket or sliding-window rate limiting (via Upstash Redis or memory store) on sensitive routes (login, registration, OTP verification, password reset, public APIs).

---

## 4. Modern Architecture & State Organization

- **Separation of Concerns**:
  - **Presentation Layer**: React Components, UI primitives, page views.
  - **Application / Service Layer**: Business logic, orchestrating external APIs, transaction management.
  - **Data Access Layer**: Database queries, ORM repositories, data mappers.
- **State Management Taxonomy**:
  - **Server State**: Managed via TanStack Query, SWR, or RSC cache. Never duplicate server state in Redux/Zustand unless offline mutations are required.
  - **URL State**: Use search params (`?page=2&filter=active`) for state that should survive page reload or be shareable via link.
  - **Client Transient State**: Use React local state (`useState`) or lightweight stores (Zustand) for UI toggles, modals, and local form inputs.

---

## 5. Automated Testing & Verification Strategy

- **Unit & Logic Tests**: Use **Vitest** for unit testing pure utility functions, validation schemas, and domain business logic.
- **Component & Integration Tests**: Use **Testing Library** to test components from the user's perspective (finding elements by role and text, not implementation details).
- **End-to-End (E2E) Tests**: Use **Playwright** for critical user journeys (Authentication flow, checkout process, core feature loop). Run headless in CI/CD before deployment.
