# AGENTS.md - Guide for Future AI and Human Engineers

Welcome to **ATELIER & ACADÉMIE**, the unified high-end Fashion Commerce, Fashion Design Academy, and Bespoke Mentorship Platform.

## 1. System Overview & Core Philosophy
The platform integrates three operational wings of a modern fashion empire into a cohesive single architectural entity:
1. **Fashion Commerce (Brand & Atelier)**: Ready-to-wear collections, couture pieces, inventory variants, SKU management, shopping cart, transactional orders, and Paystack/card payment flows.
2. **Fashion Academy**: Comprehensive curriculum (Pattern Drafting, Couture Draping, Tailoring, Fashion Illustration), modular video/text lessons, assignment submissions, enrollment access guards, progress tracking, and verifiable certificates.
3. **Tutoring & Mentorship**: 1-on-1 private studio and video consultations with master couturiers, real-time availability calendars, slot reservation concurrency locks to prevent double-booking, and session management.

## 2. Shared Subsystems
- **Single Identity & RBAC**: Users hold accounts with composite roles (`CUSTOMER`, `STUDENT`, `INSTRUCTOR`, `ADMIN`). A student can buy couture garments; an instructor can book classes; an admin has omniscient control.
- **Transactional Ledger & Payment Abstraction**: Unified `PaymentProvider` abstraction supporting Paystack with server-side signature verification, idempotency locks, and transaction records for orders, course enrollments, and mentorship bookings.
- **Inventory Engine**: Atomic reservation and quantity protection preventing overselling.
- **Media Abstraction**: Centralized asset manager with provider abstraction (Local/Object Store/CDN) and validation for images, syllabus PDFs, and video streams.
- **Notifications Engine**: Unified notification pipeline dispatching order receipts, course access grants, class schedule reminders, and certificate issuance.

## 3. Technology Stack & Directory Rules
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4 + Motion animations.
- **Backend / API**: Express 4 server (`server.ts`) mounting Vite middleware in development and serving typed `/api/*` endpoints.
- **Validation**: Zod for both client and server schemas.
- **Testing**: Vitest for unit & integration testing of core business rules (pricing, inventory reservations, booking conflict resolution, and course completion).

## 4. Key Rules for Future Agents
1. **Never mark an order/booking/enrollment as paid based on client assertions**: All transactions must be verified via the server-side payment provider abstraction.
2. **Zero-pill design discipline**: Clean typographic separators and luxury editorial typography over generic badges.
3. **Strict transactional boundaries**: Always reserve stock atomically during checkout and verify tutor availability at the instant of booking creation.
4. **Keep documentation in sync**: Update `docs/` whenever introducing new models or ADRs.
