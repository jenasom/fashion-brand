# ADR 001: Unified Multi-Capability Platform Architecture

## Status
Accepted

## Context
A modern fashion entrepreneur manages three complementary business models:
1. Selling physical luxury clothing (e-commerce catalog, inventory, variants, orders).
2. Teaching fashion skills via an academy (courses, lessons, video lectures, certificates).
3. Private 1-on-1 and small group mentoring (scheduling, availability, session booking).

Previous industry solutions frequently stitch separate platforms together (e.g., Shopify for commerce, Teachable/Kajabi for academy, Calendly for bookings), resulting in fractured user experiences, fragmented customer databases, and siloed analytics.

## Decision
We architected a single, unified database schema and API layer where:
1. A single user identity can hold multiple roles (`CUSTOMER`, `STUDENT`, `INSTRUCTOR`, `ADMIN`).
2. A single cart/checkout engine and payment provider handles physical garments, educational course enrollments, and mentorship hours.
3. Administrative operations reside in a single command center with cross-domain analytics (Total Revenue, Course Enrollments, Mentorship Hours, Low-Stock Alerts).

## Consequences
- **Positive**: Seamless user experience (a student can buy fabric or tailored garments with their saved profile and payment method; an instructor can inspect both course enrollments and mentoring bookings in one place).
- **Positive**: Atomic inventory and booking reservation guarantees eliminate overselling and double-booking.
- **Positive**: Modular service boundaries (`CommerceService`, `AcademyService`, `TutoringService`) ensure high cohesion and loose coupling.
