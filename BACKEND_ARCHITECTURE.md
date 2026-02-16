# Backend Architecture

## Stack
- Next.js App Router API routes (`app/api/...`)
- Node.js runtime for file system operations
- JSON-based persistence in `data/bookings.json` and `data/gallery.json`

## Core Modules
- `lib/data-store.ts`
  - Reads/writes booking and gallery records.
  - Acts as a lightweight repository layer.
- `lib/services.ts`
  - Defines services, categories, and pricing.
  - Used for booking validation and UI rendering.
- `lib/admin-auth.ts`
  - Validates admin requests via `x-admin-key` header.
  - Compares against `ADMIN_SECRET` environment variable.

## API Endpoints
- `POST /api/bookings`
  - Public endpoint for clients.
  - Validates required fields and enforces minimum 50% payment.
  - Saves booking with status: `pending-balance` or `confirmed`.
- `GET /api/bookings`
  - Admin only.
  - Returns all bookings for dashboard visibility.

- `GET /api/gallery`
  - Public endpoint used by gallery pages.
- `POST /api/gallery`
  - Admin only.
  - Adds new gallery item.
- `PATCH /api/gallery/:id`
  - Admin only.
  - Updates existing gallery item.
- `DELETE /api/gallery/:id`
  - Admin only.
  - Removes gallery item.

## Data Flow
1. Client submits booking form from `/book-service`.
2. API checks selected service and payment threshold.
3. Booking is stored in `data/bookings.json`.
4. Admin logs into `/admin`, loads bookings, and manages gallery entries.
5. Public gallery UI reads live data from `data/gallery.json`.

## Security Notes
- Admin paths rely on an API key pattern (`x-admin-key`) for operational control.
- Recommended for production:
  - Replace file storage with PostgreSQL or MongoDB.
  - Add authenticated session-based admin login.
  - Add request rate limiting and structured audit logging.
