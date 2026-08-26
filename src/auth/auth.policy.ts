import { AccessRole } from '../shared/enum/access.roleEnum.js';

export type Access = 'public' | 'authenticated' | AccessRole[];

export interface PolicyRule {
  methods: string[] | '*';
  pattern: RegExp;
  access: Access;
}

const ALL_ROLES: AccessRole[] = [
  AccessRole.ADMIN,
  AccessRole.EMPLEADO,
  AccessRole.CLIENTE,
];

const STAFF: AccessRole[] = [AccessRole.ADMIN, AccessRole.EMPLEADO];

const ADMIN: AccessRole[] = [AccessRole.ADMIN];

export const DEFAULT_ACCESS: Access = ADMIN;

export const POLICY: PolicyRule[] = [
  { methods: ['POST'], pattern: /^\/auth\/(login|register|logout)$/, access: 'public' },
  { methods: ['POST'], pattern: /^\/payment\/webhook$/, access: 'public' },
  { methods: '*', pattern: /^\/api-docs(\.json)?(\/.*)?$/, access: 'public' },

  { methods: ['GET', 'PUT'], pattern: /^\/auth\/me$/, access: 'authenticated' },
  { methods: ['PUT'], pattern: /^\/auth\/password$/, access: 'authenticated' },
  { methods: ['GET'], pattern: /^\/order\/mine$/, access: 'authenticated' },

  { methods: ['GET'], pattern: /^\/employee\/waiters$/, access: ALL_ROLES },
  { methods: ['GET'], pattern: /^\/dish(\/.*)?$/, access: ALL_ROLES },
  { methods: ['GET'], pattern: /^\/promotion(\/.*)?$/, access: ALL_ROLES },
  { methods: ['POST'], pattern: /^\/order\/add$/, access: ALL_ROLES },

  { methods: '*', pattern: /^\/dish(\/.*)?$/, access: ADMIN },
  { methods: '*', pattern: /^\/promotion(\/.*)?$/, access: ADMIN },
  { methods: '*', pattern: /^\/report(\/.*)?$/, access: ADMIN },
  { methods: '*', pattern: /^\/client(\/.*)?$/, access: ADMIN },
  { methods: '*', pattern: /^\/user(\/.*)?$/, access: ADMIN },

  { methods: '*', pattern: /^\/order(\/.*)?$/, access: STAFF },
  { methods: '*', pattern: /^\/table(\/.*)?$/, access: STAFF },
  { methods: '*', pattern: /^\/reservation(\/.*)?$/, access: STAFF },
  { methods: '*', pattern: /^\/supplier(\/.*)?$/, access: STAFF },
  { methods: '*', pattern: /^\/ingredient(\/.*)?$/, access: STAFF },
  { methods: '*', pattern: /^\/employee(\/.*)?$/, access: STAFF },
  { methods: '*', pattern: /^\/payment(\/.*)?$/, access: STAFF },
];

export function resolveAccess(method: string, path: string): Access {
  const normalized = path.length > 1 ? path.replace(/\/+$/, '') : path;

  for (const rule of POLICY) {
    const methodMatches =
      rule.methods === '*' || rule.methods.includes(method.toUpperCase());
    if (methodMatches && rule.pattern.test(normalized)) {
      return rule.access;
    }
  }

  return DEFAULT_ACCESS;
}
