# CouponCraft

Create, share, and track digital coupons in minutes.

CouponCraft is a simple coupon platform built for small businesses that want to drive traffic and measure results without complicated tooling. Build polished offers, share them with a link or QR code, and see what actually converts.

## What it does

- Build coupons with a guided, step by step creator.
- Share with a single link or a print ready QR code.
- Track clicks, redemptions, and conversion rate.
- Set validity windows and usage limits.
- Add branding with your business name, colors, and logo.

## How it works

1. Set up your business profile.
2. Create a coupon and preview the design.
3. Publish and share via link or QR code.
4. Watch performance on your dashboard.
5. Redeem in store or online with confidence.

## Who it is for

- Local retailers, restaurants, salons, gyms, and service providers.
- Teams that want quick campaigns and clear ROI.
- Owners who want a clean, professional coupon experience.

## Why it matters

CouponCraft reduces friction between "I have a promotion" and "customers actually use it." It keeps the workflow focused, the sharing options simple, and the analytics useful at a glance.

## Install and run

### Prerequisites

- Node.js 18+
- npm
- Postgres (or another database compatible with the Prisma schema)

### Local setup

1. Install dependencies:
   - `npm install`
   - `npm --prefix server install`
2. Create environment files:
   - Copy `.env.example` to `.env`
   - Copy `server/.env.example` to `server/.env`
   - Update `DATABASE_URL` and `CLIENT_ORIGIN`
3. Generate Prisma client:
   - `cd server && npx prisma generate`
4. Run migrations:
   - `cd server && npx prisma migrate dev`
5. Start the app:
   - `npm run dev`

Client: `http://localhost:4028`  
API: `http://localhost:8080`

### Useful scripts

- `npm run dev` - start client + server
- `npm run lint` - lint the repo
- `npm run format` - format the repo
- `npm test` - client tests
- `npm run test:server` - server tests

### Production

1. Build the client: `npm run build`
2. Run migrations: `cd server && npx prisma migrate deploy`
3. Start the API: `npm --prefix server start`
4. Serve the client `build/` output with your static host or reverse proxy.

### Vercel deployment

#### API (server)

1. Create a Vercel project with root directory set to `server`.
2. Build command: `npm run vercel-build`.
3. Environment variables (minimum):
   - `DATABASE_URL`
   - Or, when using Vercel Postgres, ensure `POSTGRES_PRISMA_URL` (or `POSTGRES_URL`) is present
   - `JWT_SECRET`
   - `CLIENT_ORIGIN` (your frontend URL)
   - `COOKIE_SECURE=true`
   - `COOKIE_SAMESITE=none`
   - `UPLOADS_ENABLED=false`
4. Deploy and verify: `https://<api-domain>/api/health/healthz`.

#### Client (frontend)

1. Create a second Vercel project with root directory set to `.`.
2. Build command: `npm run build`.
3. Output directory: `build`.
4. Environment variables:
   - `VITE_API_URL=https://<api-domain>/api`
5. Deploy and test sign-in + share flow.

#### Uploads in production

Uploads currently store assets on local disk. For Vercel, switch to a persistent object store (Vercel Blob, S3, or Cloudinary) before enabling logo uploads in production.

## Support

Need help? Reach out at support@couponcraft.app.
