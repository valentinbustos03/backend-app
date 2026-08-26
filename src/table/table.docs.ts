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
import { TableSchema } from './table.schema.js';

registerRequest('TableInput', TableSchema);

const idParam = idPathParam('id', 'ID de la mesa');

export const tablePaths: PathsObject = {
  '/table/add': {
    post: {
      tags: ['table'],
      operationId: 'addTable',
      summary: 'Da de alta una mesa',
      requestBody: jsonBody('TableInput', 'Datos de la mesa'),
      responses: {
        201: dataResponse('Mesa creada', ref('Table')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
  },
  '/table/findAll': {
    get: {
      tags: ['table'],
      operationId: 'findAllTables',
      summary: 'Lista todas las mesas',
      responses: {
        200: dataResponse('Listado de mesas', arrayOf('Table')),
        500: refResponse('ServerError'),
      },
    },
  },
  '/table/id/{id}': {
    get: {
      tags: ['table'],
      operationId: 'findTableById',
      summary: 'Busca una mesa por ID',
      description:
        'Con un ID inexistente responde 200 con data en null (ver Convenciones).',
      parameters: [idParam],
      responses: {
        200: dataResponse('Mesa encontrada', nullableRef('Table')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
  },
  '/table/cod/{cod}': {
    get: {
      tags: ['table'],
      operationId: 'findTableByCod',
      summary: 'Busca una mesa por codigo',
      description:
        'Con un ID inexistente responde 200 con data en null (ver Convenciones).',
      parameters: [
        pathParam('cod', 'Codigo de la mesa', { type: 'string', minLength: 1 }),
      ],
      responses: {
        200: dataResponse('Mesa encontrada', nullableRef('Table')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
  },
  '/table/{id}': {
    put: {
      tags: ['table'],
      operationId: 'updateTable',
      summary: 'Actualiza una mesa',
      description: 'Reemplaza la mesa completa: exige todos los campos.',
      parameters: [idParam],
      requestBody: jsonBody('TableInput', 'Datos de la mesa'),
      responses: {
        200: dataResponse('Mesa actualizada', nullableRef('Table')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
    delete: {
      tags: ['table'],
      operationId: 'removeTable',
      summary: 'Elimina una mesa',
      parameters: [idParam],
      responses: {
        200: messageResponse('Mesa eliminada'),
        400: refResponse('ValidationError'),
        404: refResponse('NotFound'),
        500: refResponse('ServerError'),
      },
    },
  },
};
