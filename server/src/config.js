import dotenv from 'dotenv';

dotenv.config();

export const sanitizeOrigin = (origin) => {
  if (!origin) return '';
  return String(origin).trim().replace(/\/+$/, '');
};

export const parseOriginList = (value) => {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((entry) => sanitizeOrigin(entry))
    .filter(Boolean);
};

export const buildConfig = (env = {}) => {
  const envName = env.NODE_ENV || 'development';
  const clientOrigin = sanitizeOrigin(env.CLIENT_ORIGIN || 'http://localhost:5173');
  const corsOrigins = parseOriginList(env.CLIENT_ORIGIN || clientOrigin);
  const uploadsEnabled =
    typeof env.UPLOADS_ENABLED === 'string'
      ? env.UPLOADS_ENABLED === 'true'
      : envName !== 'production';

  return {
    port: env.PORT || 4000,
    env: envName,
    jwtSecret: env.JWT_SECRET || 'dev-secret-change-me',
    jwtExpiresIn: env.JWT_EXPIRES_IN || '1h',
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN || '7d',
    clientOrigin: clientOrigin || 'http://localhost:5173',
    corsOrigins: corsOrigins.length ? corsOrigins : [clientOrigin].filter(Boolean),
    jsonLimit: env.JSON_BODY_LIMIT || '1mb',
    uploadLimit: env.UPLOAD_BODY_LIMIT || '5mb',
    uploadsEnabled,
    databaseUrl: env.DATABASE_URL,
    cookieSecure:
      typeof env.COOKIE_SECURE === 'string'
        ? env.COOKIE_SECURE === 'true'
        : envName === 'production',
    cookieSameSite: (env.COOKIE_SAMESITE || 'lax').toLowerCase(),
  };
};

export const config = buildConfig(process.env);
