# User Flows

## Flow 1: E-Commerce Garment Purchase
1. Customer visits `/shop` or `/collections/autumn-capsule`.
2. Inspects product detail page (e.g. `Structured Wool Trench Coat`).
3. Selects color (e.g. Camel) and size (e.g. Medium).
4. System checks real-time available stock (`inventory - reserved > 0`).
5. Adds item to cart -> Cart updates with subtotal and estimated shipping.
6. Proceeds to checkout -> Inputs shipping address and contact details.
7. Payment is initialized via `PaymentProvider` (Paystack adapter).
8. Customer completes payment -> Server verifies reference and transitions order to `PAID`.
9. Inventory count permanently decremented; customer redirected to order confirmation with tracking timeline.

## Flow 2: Academy Course Enrollment & Certificate Issuance
1. Student browses `/courses` and selects `Architectural Pattern Drafting`.
2. Reviews syllabus modules and preview lessons.
3. Clicks "Enroll Now" -> Redirected to checkout/payment.
4. Server creates `Enrollment` record upon verified payment.
5. Student enters `/student/courses/:id` -> accesses lessons sequentially.
6. Completes lessons -> progress indicator advances.
7. Upon completing 100% of lessons, a unique `Certificate` is minted with verifiable ID `/certificates/:id`.

## Flow 3: Private Mentorship Booking
1. Student navigates to `/tutoring` -> selects instructor `Madame Vivienne Vance (Master Couturière)`.
2. Browses calendar slots -> selects date & time slot.
3. System verifies slot is not already reserved.
4. Completes booking & payment.
5. Booking is confirmed, calendar invite/meeting link generated, session appears in both student and instructor dashboards.
