# Authentication & Authorization Architecture

## 1. Identity & RBAC
Every user in the system is assigned one or more capabilities / roles:
- `CUSTOMER`: Can place orders, manage addresses, review products, manage wishlist.
- `STUDENT`: Can enroll in courses, attend classes, submit assignments, book mentorship, earn certificates.
- `INSTRUCTOR`: Can host classes, configure tutoring availability, review student work, view attendee lists.
- `ADMIN`: Global administration, inventory management, price changes, refund approvals, analytics.

## 2. Authentication Flow
- Session tokens signed server-side using secure SHA-256 JWT tokens.
- Stored in browser `localStorage` or `HttpOnly` cookie with automatic token refresh.
- Central authorization middleware on the Express server inspects `req.user` and enforces required roles.
- Frontend navigational state dynamically shows appropriate shortcuts (e.g., "Student Studio", "Instructor Desk", "Atelier Admin") without hardcoded UI locks.
