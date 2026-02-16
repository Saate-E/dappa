# LumenStudio - Photography Studio Website

A responsive photography studio platform built with the latest Next.js App Router and Tailwind CSS.

## Features
- Public website pages:
  - Home (`/`)
  - About Us (`/about-us`)
  - Gallery (`/gallery`)
  - Contact (`/contact`)
  - Book Service (`/book-service`)
- Header with logo, nav links, and Book Service CTA.
- Sliding hero sections on Home and About Us.
- Service cards with booking shortcut buttons.
- Video showcase sections.
- Contact form and address/social sections.
- Rich gallery cards with metadata and download/view actions.
- Booking flow with backend validation requiring at least 50% payment.
- Separate admin platform (`/admin`) for:
  - Viewing bookings
  - Adding/updating/deleting gallery records

## Backend Architecture
See `BACKEND_ARCHITECTURE.md` for architecture details.

## Environment Variable
Create `.env.local`:

```bash
ADMIN_SECRET=your-secure-admin-key
```

Default fallback key in development is `studio-admin-123`.

## Run Locally
```bash
npm install
npm run dev
```

Open `http://localhost:3000` for the website and `http://localhost:3000/admin` for admin.
