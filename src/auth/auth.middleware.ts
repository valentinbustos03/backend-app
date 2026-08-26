import { NextFunction, Request, Response } from 'express';
import { AccessRole } from '../shared/enum/access.roleEnum.js';
import { resolveAccess } from './auth.policy.js';
import { TOKEN_COOKIE, TokenPayload, verifyToken } from './auth.token.js';

declare global {
  namespace Express {
    interface Request {
      auth?: TokenPayload;
    }
  }
}

function extractToken(req: Request): string | null {
  const fromCookie = req.cookies?.[TOKEN_COOKIE];
  if (typeof fromCookie === 'string' && fromCookie.length > 0) {
    return fromCookie;
  }

  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    return header.slice('Bearer '.length).trim();
  }

  return null;
}

export async function authGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const access = resolveAccess(req.method, req.path);

  const token = extractToken(req);
  if (token) {
    const payload = await verifyToken(token);
    if (payload) {
      req.auth = payload;
    }
  }

  if (access === 'public') {
    return next();
  }

  if (!req.auth) {
    return res.status(401).json({ message: 'Se requiere iniciar sesion' });
  }

  if (access === 'authenticated') {
    return next();
  }

  if (!access.includes(req.auth.accessRole)) {
    return res.status(403).json({
      message: 'No tenes permiso para acceder a este recurso',
      data: { required: access, actual: req.auth.accessRole },
    });
  }

  return next();
}

export function currentUserId(req: Request): string {
  return req.auth!.sub;
}

export function currentAccessRole(req: Request): AccessRole {
  return req.auth!.accessRole;
}
