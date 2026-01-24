import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const resolveDatabaseUrl = () =>
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL ||
  process.env.NEON_DATABASE_URL ||
  '';

const databaseUrl = resolveDatabaseUrl();
if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is not set. Provide DATABASE_URL or POSTGRES_PRISMA_URL/POSTGRES_URL in your environment.'
  );
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: databaseUrl,
  },
});
