import {
  dataResponse,
  jsonBody,
  messageResponse,
  PathsObject,
  ref,
  refResponse,
  registerRequest,
} from '../shared/openapi/openapi.builder.js';
import {
  ChangePasswordSchema,
  LoginSchema,
  RegisterSchema,
  UpdateMeSchema,
} from './auth.schema.js';

registerRequest('LoginInput', LoginSchema);
registerRequest('RegisterInput', RegisterSchema);
registerRequest('UpdateMeInput', UpdateMeSchema);
registerRequest('ChangePasswordInput', ChangePasswordSchema);

const unauthorized = messageResponse(
  'Falta la sesion, o el token es invalido o vencido'
);

export const authPaths: PathsObject = {
  '/auth/login': {
    post: {
      tags: ['auth'],
      operationId: 'login',
      summary: 'Inicia sesion',
      description:
        'Devuelve el usuario con su `accessRole` y setea la cookie httpOnly `token`. El 401 es deliberadamente generico: no distingue un email inexistente de una contrasena incorrecta, para no confirmar que direcciones estan registradas.',
      security: [],
      requestBody: jsonBody('LoginInput', 'Credenciales'),
      responses: {
        200: dataResponse('Sesion iniciada', ref('Session')),
        400: refResponse('ValidationError'),
        401: messageResponse('Email o contrasena incorrectos'),
        403: messageResponse(
          'El usuario no esta asociado a un cliente ni a un empleado'
        ),
      },
    },
  },
  '/auth/register': {
    post: {
      tags: ['auth'],
      operationId: 'register',
      summary: 'Registra un cliente nuevo',
      description:
        'Crea el Client y el User vinculado en un solo flush, y deja la sesion iniciada. **Solo crea clientes**: el `role` se fuerza a `user`, asi que lo que venga en el body se ignora. Los empleados se dan de alta desde `/user/add`, que es admin.',
      security: [],
      requestBody: jsonBody('RegisterInput', 'Datos del cliente nuevo'),
      responses: {
        201: dataResponse('Usuario registrado y sesion iniciada', ref('Session')),
        400: refResponse('ValidationError'),
        409: messageResponse('El email o el DNI ya estan en uso'),
      },
    },
  },
  '/auth/logout': {
    post: {
      tags: ['auth'],
      operationId: 'logout',
      summary: 'Cierra la sesion',
      description:
        'Borra la cookie. No hay lista negra de tokens: un token ya emitido sigue siendo valido hasta que expire.',
      security: [],
      responses: {
        200: messageResponse('Sesion cerrada'),
      },
    },
  },
  '/auth/me': {
    get: {
      tags: ['auth'],
      operationId: 'getMe',
      summary: 'Devuelve la sesion actual',
      responses: {
        200: dataResponse('Sesion encontrada', ref('Session')),
        401: unauthorized,
      },
    },
    put: {
      tags: ['auth'],
      operationId: 'updateMe',
      summary: 'Edita el perfil propio',
      description:
        'Opera **siempre** sobre el usuario del token e ignora cualquier id, asi que no hay forma de apuntar a otro usuario. El body esta recortado a proposito: `role`, `client`, `employee` y `email` no se pueden tocar. Si `role` fuera editable, un cliente se ascenderia a administrador sobre su propio registro.',
      requestBody: jsonBody('UpdateMeInput', 'Campos editables del perfil'),
      responses: {
        200: dataResponse('Perfil actualizado', ref('Session')),
        400: refResponse('ValidationError'),
        401: unauthorized,
      },
    },
  },
  '/auth/password': {
    put: {
      tags: ['auth'],
      operationId: 'changePassword',
      summary: 'Cambia la contrasena propia',
      description: 'Exige la contrasena actual.',
      requestBody: jsonBody('ChangePasswordInput', 'Contrasena actual y nueva'),
      responses: {
        200: messageResponse('Contrasena actualizada'),
        400: refResponse('ValidationError'),
        401: messageResponse('La contrasena actual no es correcta'),
      },
    },
  },
};
