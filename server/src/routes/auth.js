import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { validate } from '../middlewares/validate.js';
import { loginSchema, registerSchema } from '../validators.js';
import { generateTokens } from '../utils/tokens.js';
import { requireAuth } from '../middlewares/auth.js';
import { prisma } from '../db/prisma.js';
import {
  clearSessionCookies,
  ensureCsrfCookie,
  setSessionCookies,
  COOKIE_NAMES,
} from '../utils/cookies.js';
import { config } from '../config.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createRateLimiter } from '../utils/rateLimit.js';

export const authRouter = Router();

const authLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  keyPrefix: 'auth',
});

const buildAuthPayload = (user, business, tokens) => ({
  user: { id: user.id, email: user.email, role: user.role, ownerName: user.ownerName },
  business,
  tokens,
});

authRouter.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const { email, password, businessName, ownerName, phone, businessType } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = nanoid();
    const businessId = nanoid();

    const [user, business] = await prisma.$transaction([
      prisma.user.create({
        data: {
          id: userId,
          email,
          passwordHash,
          role: 'owner',
          ownerName,
        },
      }),
      prisma.business.create({
        data: {
          id: businessId,
          ownerId: userId,
          name: businessName,
          phone,
          type: businessType,
        },
      }),
    ]);

    const tokens = generateTokens(userId);
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId,
      },
    });

    setSessionCookies(res, tokens);
    ensureCsrfCookie(req, res);

    return res.status(201).json({
      data: buildAuthPayload(user, business, tokens),
    });
  })
);

authRouter.post(
  '/login',
  authLimiter,
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const tokens = generateTokens(user.id);
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
      },
    });
    const business = await prisma.business.findUnique({ where: { ownerId: user.id } });
    setSessionCookies(res, tokens);
    ensureCsrfCookie(req, res);
    return res.json({
      data: buildAuthPayload(user, business, tokens),
    });
  })
);

authRouter.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    const refreshToken = (req.body || {})?.refreshToken || req.cookies?.[COOKIE_NAMES.refresh];
    if (!refreshToken) {
      return res
        .status(401)
        .json({ code: 'REFRESH_TOKEN_MISSING', message: 'Missing refresh token' });
    }
    try {
      const payload = JSON.parse(
        Buffer.from(refreshToken.split('.')[1], 'base64').toString('utf8')
      );
      // Validate structure before verify to avoid unhandled errors.
      if (!payload?.sub) {
        return res.status(401).json({ message: 'Invalid token' });
      }
    } catch {
      return res.status(401).json({ message: 'Invalid token' });
    }

    try {
      const jwt = await import('jsonwebtoken');
      const decoded = jwt.default.verify(refreshToken, config.jwtSecret);
      const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
      if (!stored || stored.revoked || stored.userId !== decoded.sub) {
        return res.status(401).json({ message: 'Invalid or reused refresh token' });
      }
      await prisma.refreshToken.update({
        where: { token: refreshToken },
        data: { revoked: true },
      });
      const tokens = generateTokens(decoded.sub);
      await prisma.refreshToken.create({
        data: { token: tokens.refreshToken, userId: decoded.sub },
      });
      const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
      const business = await prisma.business.findUnique({ where: { ownerId: decoded.sub } });
      setSessionCookies(res, tokens);
      ensureCsrfCookie(req, res);
      return res.json({
        data: buildAuthPayload(user, business, tokens),
      });
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
  })
);

authRouter.post(
  '/logout',
  asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.[COOKIE_NAMES.refresh] || (req.body || {})?.refreshToken;
    if (refreshToken) {
      await prisma.refreshToken.updateMany({
        where: { token: refreshToken },
        data: { revoked: true },
      });
    }
    clearSessionCookies(res);
    return res.status(204).send();
  })
);

authRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const business = await prisma.business.findUnique({ where: { ownerId: req.user.id } });
    ensureCsrfCookie(req, res);
    return res.json({
      data: {
        user: {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role,
          ownerName: req.user.ownerName,
        },
        business,
      },
    });
  })
);
