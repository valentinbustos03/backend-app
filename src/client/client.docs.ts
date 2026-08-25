import {
  arrayOf,
  dataResponse,
  idPathParam,
  jsonBody,
  messageResponse,
  nullableRef,
  pathParam,
  PathsObject,
  ref,
  refResponse,
  registerRequest,
} from '../shared/openapi/openapi.builder.js';
import { ClientSchema } from './client.schema.js';

registerRequest('ClientInput', ClientSchema);

const idParam = idPathParam('id', 'ID del cliente');

export const clientPaths: PathsObject = {
  '/client/add': {
    post: {
      tags: ['client'],
      operationId: 'addClient',
      summary: 'Da de alta un cliente',
      requestBody: jsonBody('ClientInput', 'Datos del cliente'),
      responses: {
        201: dataResponse('Cliente creado', ref('Client')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
  },
  '/client/findAll': {
    get: {
      tags: ['client'],
      operationId: 'findAllClients',
      summary: 'Lista todos los clientes',
      responses: {
        200: dataResponse('Listado de clientes', arrayOf('Client')),
        500: refResponse('ServerError'),
      },
    },
  },
  '/client/id/{id}': {
    get: {
      tags: ['client'],
      operationId: 'findClientById',
      summary: 'Busca un cliente por ID',
      description:
        'Con un ID inexistente responde 200 con data en null (ver Convenciones).',
      parameters: [idParam],
      responses: {
        200: dataResponse('Cliente encontrado', nullableRef('Client')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
  },
  '/client/dni/{dni}': {
    get: {
      tags: ['client'],
      operationId: 'findClientByDni',
      summary: 'Busca un cliente por DNI',
      description:
        'Con un ID inexistente responde 200 con data en null (ver Convenciones).',
      parameters: [
        pathParam('dni', 'DNI del cliente', {
          type: 'string',
          pattern: '^\\d+$',
        }),
      ],
      responses: {
        200: dataResponse('Cliente encontrado', nullableRef('Client')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
  },
  '/client/{id}': {
    put: {
      tags: ['client'],
      operationId: 'updateClient',
      summary: 'Actualiza un cliente',
      description: 'Reemplaza el cliente completo: exige todos los campos.',
      parameters: [idParam],
      requestBody: jsonBody('ClientInput', 'Datos del cliente'),
      responses: {
        200: dataResponse('Cliente actualizado', nullableRef('Client')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
    delete: {
      tags: ['client'],
      operationId: 'removeClient',
      summary: 'Elimina un cliente',
      description:
        'Elimina en cascada el historial de pedidos asociado al cliente.',
      parameters: [idParam],
      responses: {
        200: messageResponse('Cliente eliminado'),
        400: refResponse('ValidationError'),
        404: refResponse('NotFound'),
        500: refResponse('ServerError'),
      },
    },
  },
};
