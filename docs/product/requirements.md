# Product Requirements Document (PRD)

## 1. Functional Requirements

### 1.1 Storefront & Commerce
- **Catalog Browsing**: Filter by Category (Outerwear, Tailoring, Dresses, Accessories), Collections (Autumn/Winter Capsule, Atelier Archive), Price, and Stock Availability.
- **Product Detail**: Multi-image galleries, video embeds, fabric composition, care guide, size guide, SKU, variant matrix (Color x Size), dynamic inventory counters.
- **Cart Management**: Guest & Authenticated persistence, stock reservation pre-checks, dynamic total calculation server-side.
- **Checkout & Payment**: Address collection, Paystack/card payment intent generation, server-side transaction verification, idempotency handling.
- **Order Tracking**: Detailed timeline (`PENDING` -> `PAYMENT_PENDING` -> `PAID` -> `PROCESSING` -> `SHIPPED` -> `DELIVERED`).

### 1.2 Fashion Academy
- **Curriculum Structure**: Courses -> Modules -> Lessons (video, text, resource attachments, assignments).
- **Gated Access**: Server-enforced enrollment verification before serving paid lesson content.
- **Progress Tracking**: Real-time completion checkboxes, percentage progress, resume-lesson pointers.
- **Class Schedules**: In-person atelier workshops & online live masterclasses with fixed seat capacity and meeting links.
- **Certificates**: Dynamic verifiable certificates with unique verification IDs, student name, instructor signature, and issue date.

### 1.3 Private Tutoring & Mentorship
- **Instructor Profiles**: Bio, specialty (e.g. Corsetry, Haute Couture Draping, Sustainable Dyeing), hourly rates.
- **Availability Calendar**: Configurable slot buffers, blocked dates, duration controls (45min, 60min, 90min).
- **Anti-Double-Booking**: Concurrency-safe slot lock during booking initiation and finalization.

### 1.4 Administration & Analytics
- **Unified Dashboard**: Metrics for Gross Merchandise Value (GMV), course enrollments, active mentorship hours, and inventory alerts.
- **Catalog Management**: CRUD operations for products, variants, courses, modules, lessons, and classes.
- **Fulfillment & Auditing**: Status changes logged to immutable `audit_logs` table.

## 2. Non-Functional Requirements
- **Security**: Server-side RBAC, sanitized inputs with Zod, protected routes.
- **Performance**: Sub-200ms API response time, zero layout shift (CLS < 0.1).
- **Accessibility**: WCAG AA contrast ratio compliance, keyboard navigation for booking calendar.
