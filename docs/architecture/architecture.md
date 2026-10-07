# Architecture Specification

## 1. System Topology
The application is structured as a full-stack TypeScript system running on Node.js / Vite / Express.

```
┌────────────────────────────────────────────────────────┐
│                   Vite + React SPA                     │
│  - Luxury Storefront (/shop, /collections, /cart)     │
│  - Academy Portal (/courses, /student/lessons)        │
│  - Mentorship Scheduling (/tutoring, /book)           │
│  - Unified Admin & Instructor Backoffice (/admin)     │
└───────────────────────────┬────────────────────────────┘
                            │ REST / JSON
┌───────────────────────────▼────────────────────────────┐
│                  Express Server API                    │
│  - /api/auth (Session, Roles, Tokens)                 │
│  - /api/products, /api/cart, /api/orders              │
│  - /api/academy (Courses, Lessons, Progress)          │
│  - /api/tutoring (Instructors, Slots, Bookings)       │
│  - /api/payments (Paystack Abstraction, Webhooks)     │
│  - /api/admin (Audits, Metrics, Catalog Management)   │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│              Data Access Layer & Engine                │
│  - In-Memory & Persistent JSON/File Store Engine       │
│  - Concurrency Lock for Booking & Inventory Checks    │
│  - Audit Logger & Event Dispatcher                    │
└────────────────────────────────────────────────────────┘
```

## 2. Directory Layout
- `src/`
  - `components/` Reusable UI primitives (Button, Modal, Gallery, BookingCalendar, etc.)
  - `pages/` Page views for Storefront, Academy, Mentorship, Dashboard, Admin
  - `services/` Client-side API client and state stores
  - `types/` Shared TypeScript data contracts
- `server/`
  - `routes/` Express route controllers
  - `services/` Domain business logic (PaymentProvider, InventoryService, BookingService, CourseService)
  - `db/` Storage repository, relational schema entities, and seed data
  - `middleware/` Auth, RBAC, error handling, input validation
- `docs/` Product & architecture specifications
