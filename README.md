# CouponCraft

## Prerequisites
- Node.js 18+
- npm
- Postgres (or another database compatible with the Prisma schema)

## Setup
1. Install dependencies:
   - `npm install`
   - `npm --prefix server install`
2. Create environment files:
   - Copy `.env.example` to `.env`
   - Copy `server/.env.example` to `server/.env`
   - Update `DATABASE_URL` and `CLIENT_ORIGIN` as needed
3. Set up the database:
   - `npx prisma migrate dev --schema server/prisma/schema.prisma`
   - or `npx prisma db push --schema server/prisma/schema.prisma`

## Development
- `npm run dev` (runs client and server together)
- Client: `http://localhost:4028`
- API: `http://localhost:8080`

## Scripts
- `npm run lint`
- `npm run format`
- `npm test`
- `npm run test:server`

## Project Structure
- `src/` - Vite client
- `server/` - Express API + Prisma
