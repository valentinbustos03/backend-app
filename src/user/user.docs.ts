import {
  arrayOf,
  dataResponse,
  idPathParam,
  jsonBody,
  messageResponse,
  nullableRef,
  PathsObject,
  ref,
  refResponse,
  registerRequest,
} from '../shared/openapi/openapi.builder.js';
import { UserSchema } from './user.schema.js';

registerRequest('UserInput', UserSchema);

const idParam = idPathParam('id', 'ID del usuario');

export const userPaths: PathsObject = {
  '/user/add': {
    post: {
      tags: ['user'],
      operationId: 'addUser',
      summary: 'Da de alta un usuario',
      description:
        'La contrasena se guarda hasheada con bcrypt y nunca vuelve en la respuesta. Se puede vincular el usuario a un cliente o a un empleado ya existente.',
      requestBody: jsonBody('UserInput', 'Datos del usuario'),
      responses: {
        201: dataResponse('Usuario creado', ref('User')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
  },
  '/user/findAll': {
    get: {
      tags: ['user'],
      operationId: 'findAllUsers',
      summary: 'Lista todos los usuarios',
      responses: {
        200: dataResponse('Listado de usuarios', arrayOf('User')),
        500: refResponse('ServerError'),
      },
    },
  },
  '/user/id/{id}': {
    get: {
      tags: ['user'],
      operationId: 'findUserById',
      summary: 'Busca un usuario por ID',
      description:
        'Con un ID inexistente responde 200 con data en null (ver Convenciones).',
      parameters: [idParam],
      responses: {
        200: dataResponse('Usuario encontrado', nullableRef('User')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
  },
  '/user/{id}': {
    put: {
      tags: ['user'],
      operationId: 'updateUser',
      summary: 'Actualiza un usuario',
      description:
        'Reemplaza el usuario completo: exige todos los campos, incluida la contrasena, que se vuelve a hashear.',
      parameters: [idParam],
      requestBody: jsonBody('UserInput', 'Datos del usuario'),
      responses: {
        200: dataResponse('Usuario actualizado', nullableRef('User')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
    delete: {
      tags: ['user'],
      operationId: 'removeUser',
      summary: 'Elimina un usuario',
      parameters: [idParam],
      responses: {
        200: messageResponse('Usuario eliminado'),
        400: refResponse('ValidationError'),
        404: refResponse('NotFound'),
        500: refResponse('ServerError'),
      },
    },
  },
};
