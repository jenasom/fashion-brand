# Role dashboards and local demo access

The visual identity uses African fashion photography, warm cream, near-black, muted gold, bold sans-serif typography, and responsive editorial image grids. The original six user-supplied garment photographs live in public/assets/garments. Inspiration images guide layout and art direction; they are not used as brand assets.

## Routes

- /#/login: password-checked demo sign-in; selecting a role fills the form.
- /#/dashboard: opens the highest-priority role for the active user.
- /#/dashboard/customer: own orders, saved products, and collection links.
- /#/dashboard/student: enrollments, course progress, booked classes, mentoring, and certificates.
- /#/dashboard/instructor: assigned courses, enrollment counts, teaching sessions, mentoring, and class completion.
- /#/dashboard/admin: overview and the existing catalog, inventory, orders, academy, and audit management tools.
- /#/student and /#/admin are aliases for the corresponding dashboard.

Composite accounts can switch among their own roles using the workspace sidebar. Instructor records are resolved through Instructor.userId, not an instructor ID supplied by the client. The new dashboard endpoint enforces session role membership, and related personal-data reads enforce ownership. Admin API routes require the admin role.

## Demo credentials

All four public demo accounts use password `AtelierDemo26!`.

| Role | Email |
| --- | --- |
| Customer | customer@atelierofficial.com |
| Student | student@atelierofficial.com |
| Instructor | folashade@atelierofficial.com |
| Admin | admin@atelierofficial.com |

Passwords are checked server-side against a scrypt hash. Demo session tokens contain a random nonce, expire after eight hours, and are signed so independent Vercel function instances can validate them. They are held in browser sessionStorage and cleared on logout. Server-side revocation is process-local; cross-instance revocation requires a shared session store. Invalid or missing credentials never fall back to admin. Passwordless persona switching and public self-assignment of roles are disabled.

This remains a demonstration: users and business data are in memory and reset on server restart. Signed demo sessions survive cold starts. Set SESSION_SECRET for deployment-specific signatures; otherwise the public demo credential supplies demo-only signing material, limited to seeded demo accounts. This fallback must not be used for private accounts. Existing payment/enrollment flows and public course content are not a production identity or entitlement system. Production deployment requires persistent identity, private credentials, and an end-to-end authorization review of all commerce and academy endpoints.

## Validation

Run `node node_modules/vite/bin/vite.js build`, `node node_modules/typescript/bin/tsc --noEmit`, and `node node_modules/vitest/vitest.mjs run`. Direct Node entrypoints avoid Windows npm shim issues caused by the ampersand in this workspace path.

## Vercel deployment

Vite builds the frontend into dist. api/index.ts exports the shared Express API from server/app.ts; vercel.json routes /api/* to that function. server.ts uses the same API for local development and standalone hosting. The API function does not start a listener or import Vite. Framework preset: Vite. Build: npm run build. Output: dist.

Regression checks in tests/vercel-api.test.ts exercise the deployed handler for all four role logins and dashboard loads. tests/demo-sessions.test.ts verifies cross-instance validation, tamper rejection, and expiry.
