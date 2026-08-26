import { Request, Response } from 'express';
import { orm } from '../shared/db/orm.js';
import { currentUserId } from './auth.middleware.js';
import { AuthService } from './auth.service.js';
import { SessionDto } from './auth.dto.js';
import {
  DniAlreadyUsedError,
  EmailAlreadyUsedError,
  InvalidCredentialsError,
  InvalidCurrentPasswordError,
  NoAccessRoleError,
} from './auth.error.js';
import {
  ChangePasswordSchema,
  LoginSchema,
  RegisterSchema,
  UpdateMeSchema,
} from './auth.schema.js';
import { TOKEN_COOKIE, TOKEN_MAX_AGE_MS } from './auth.token.js';

const authService = new AuthService(orm.em);

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: false,
  path: '/',
};

function handleError(error: any, res: Response, fallback: string) {
  if (error instanceof InvalidCredentialsError) {
    return res.status(401).json({ message: error.message });
  }
  if (error instanceof InvalidCurrentPasswordError) {
    return res.status(401).json({ message: error.message });
  }
  if (error instanceof NoAccessRoleError) {
    return res
      .status(403)
      .json({ message: error.message, data: { userId: error.userId } });
  }
  if (error instanceof EmailAlreadyUsedError) {
    return res
      .status(409)
      .json({ message: error.message, data: { email: error.email } });
  }
  if (error instanceof DniAlreadyUsedError) {
    return res
      .status(409)
      .json({ message: error.message, data: { dni: error.dni } });
  }
  return res.status(500).json({ message: fallback, error: error.message });
}

function sessionBody(session: SessionDto) {
  return { ...session.user.toJSON(), accessRole: session.accessRole };
}

async function login(req: Request, res: Response) {
  const body = await LoginSchema.safeParseAsync(req.body);
  if (!body.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: body.error });
  }
  try {
    const session = await authService.login(body.data);
    res.cookie(TOKEN_COOKIE, session.token, {
      ...COOKIE_OPTIONS,
      maxAge: TOKEN_MAX_AGE_MS,
    });
    return res
      .status(200)
      .json({ message: 'Login successful', data: sessionBody(session) });
  } catch (error: any) {
    return handleError(error, res, 'Error logging in');
  }
}

async function register(req: Request, res: Response) {
  const body = await RegisterSchema.safeParseAsync(req.body);
  if (!body.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: body.error });
  }
  try {
    const session = await authService.register(body.data);
    res.cookie(TOKEN_COOKIE, session.token, {
      ...COOKIE_OPTIONS,
      maxAge: TOKEN_MAX_AGE_MS,
    });
    return res
      .status(201)
      .json({ message: 'User registered', data: sessionBody(session) });
  } catch (error: any) {
    return handleError(error, res, 'Error registering user');
  }
}

async function logout(_req: Request, res: Response) {
  res.clearCookie(TOKEN_COOKIE, COOKIE_OPTIONS);
  return res.status(200).json({ message: 'Logout successful', data: null });
}

async function me(req: Request, res: Response) {
  try {
    const result = await authService.getMe(currentUserId(req));
    return res.status(200).json({
      message: 'Session found',
      data: { ...result.user.toJSON(), accessRole: result.accessRole },
    });
  } catch (error: any) {
    return handleError(error, res, 'Error reading session');
  }
}

async function updateMe(req: Request, res: Response) {
  const body = await UpdateMeSchema.safeParseAsync(req.body);
  if (!body.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: body.error });
  }
  try {
    const result = await authService.updateMe(currentUserId(req), body.data);
    return res.status(200).json({
      message: 'Profile updated',
      data: { ...result.user.toJSON(), accessRole: result.accessRole },
    });
  } catch (error: any) {
    return handleError(error, res, 'Error updating profile');
  }
}

async function changePassword(req: Request, res: Response) {
  const body = await ChangePasswordSchema.safeParseAsync(req.body);
  if (!body.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: body.error });
  }
  try {
    await authService.changePassword(currentUserId(req), body.data);
    return res
      .status(200)
      .json({ message: 'Password updated', data: null });
  } catch (error: any) {
    return handleError(error, res, 'Error updating password');
  }
}

export { login, register, logout, me, updateMe, changePassword };
