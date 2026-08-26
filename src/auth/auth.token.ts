import { jwtVerify, SignJWT } from 'jose';
import { AccessRole } from '../shared/enum/access.roleEnum.js';
import { EmployeeRole } from '../shared/enum/employee.roleEnum.js';

const EXPIRATION = '8h';
const ALGORITHM = 'HS256';

export const TOKEN_COOKIE = 'token';
export const TOKEN_MAX_AGE_MS = 8 * 60 * 60 * 1000;

export interface TokenPayload {
  sub: string;
  accessRole: AccessRole;
  employeeRole?: EmployeeRole;
}

function secret(): Uint8Array {
  const value = process.env.JWT_SECRET;
  if (!value) {
    throw new Error('Falta configurar JWT_SECRET');
  }
  return new TextEncoder().encode(value);
}

export async function signToken(payload: TokenPayload): Promise<string> {
  const jwt = new SignJWT({
    accessRole: payload.accessRole,
    employeeRole: payload.employeeRole,
  })
    .setProtectedHeader({ alg: ALGORITHM })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(EXPIRATION);

  return jwt.sign(secret());
}

export async function verifyToken(
  token: string
): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret(), {
      algorithms: [ALGORITHM],
    });

    if (!payload.sub || typeof payload.accessRole !== 'string') {
      return null;
    }

    return {
      sub: payload.sub,
      accessRole: payload.accessRole as AccessRole,
      employeeRole: payload.employeeRole as EmployeeRole | undefined,
    };
  } catch {
    return null;
  }
}
