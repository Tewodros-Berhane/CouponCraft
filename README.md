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

## Environment Variables
Client (`.env`)
- `VITE_API_URL`: API base URL for the client (default `/api`).
- `VITE_PROXY_TARGET`: Dev proxy target for the API (default `http://localhost:8080`).

Server (`server/.env`)
- `PORT`: API port (default `8080`).
- `CLIENT_ORIGIN`: Allowed client origin for CORS.
- `JWT_SECRET`: Secret used to sign JWTs.
- `JWT_EXPIRES_IN`: Access token lifetime (example `1h`).
- `JWT_REFRESH_EXPIRES_IN`: Refresh token lifetime (example `7d`).
- `DATABASE_URL`: Prisma connection string.
- `JSON_BODY_LIMIT`: Max JSON payload size (example `1mb`).
- `UPLOAD_BODY_LIMIT`: Max upload payload size (example `5mb`).
- `COOKIE_SECURE`: Set `true` in production HTTPS deployments.
- `COOKIE_SAMESITE`: Cookie same-site policy (example `lax`).

## Development
- `npm run dev` (runs client and server together)
- Client: `http://localhost:4028`
- API: `http://localhost:8080`

## Scripts
- `npm run lint`
- `npm run format`
- `npm test`
- `npm run test:server`

## Deployment
1. Build the client bundle with `npm run build` (honors `VITE_API_URL`).
2. Run database migrations with `npx prisma migrate deploy --schema server/prisma/schema.prisma`.
3. Start the API with `npm --prefix server start`.
4. Serve the client `build/` output with your static host or reverse proxy.

Optional API container:
- `docker build -t couponcraft-api -f server/Dockerfile .`
- `docker run -p 8080:8080 --env-file server/.env couponcraft-api`

## Project Structure
- `src/` - Vite client
- `server/` - Express API + Prisma
