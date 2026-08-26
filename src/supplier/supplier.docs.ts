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
import { SupplierSchema } from './supplier.schema.js';

registerRequest('SupplierInput', SupplierSchema);

const idParam = idPathParam('id', 'ID del proveedor');

export const supplierPaths: PathsObject = {
  '/supplier/add': {
    post: {
      tags: ['supplier'],
      operationId: 'addSupplier',
      summary: 'Da de alta un proveedor',
      requestBody: jsonBody('SupplierInput', 'Datos del proveedor'),
      responses: {
        201: dataResponse('Proveedor creado', ref('Supplier')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
  },
  '/supplier/findAll': {
    get: {
      tags: ['supplier'],
      operationId: 'findAllSuppliers',
      summary: 'Lista todos los proveedores',
      responses: {
        200: dataResponse('Listado de proveedores', arrayOf('Supplier')),
        500: refResponse('ServerError'),
      },
    },
  },
  '/supplier/id/{id}': {
    get: {
      tags: ['supplier'],
      operationId: 'findSupplierById',
      summary: 'Busca un proveedor por ID',
      description:
        'Con un ID inexistente responde 200 con data en null (ver Convenciones).',
      parameters: [idParam],
      responses: {
        200: dataResponse('Proveedor encontrado', nullableRef('Supplier')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
  },
  '/supplier/taxId/{taxId}': {
    get: {
      tags: ['supplier'],
      operationId: 'findSupplierByTaxId',
      summary: 'Busca un proveedor por CUIT/CUIL',
      description:
        'Con un ID inexistente responde 200 con data en null (ver Convenciones).',
      parameters: [
        pathParam('taxId', 'CUIT/CUIL con formato NN-NNNNNNNN-N', {
          type: 'string',
          pattern: '^\\d{2}-\\d{8}-\\d{1}$',
        }),
      ],
      responses: {
        200: dataResponse('Proveedor encontrado', nullableRef('Supplier')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
  },
  '/supplier/{id}': {
    put: {
      tags: ['supplier'],
      operationId: 'updateSupplier',
      summary: 'Actualiza un proveedor',
      description: 'Reemplaza el proveedor completo: exige todos los campos.',
      parameters: [idParam],
      requestBody: jsonBody('SupplierInput', 'Datos del proveedor'),
      responses: {
        200: dataResponse('Proveedor actualizado', nullableRef('Supplier')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
    delete: {
      tags: ['supplier'],
      operationId: 'removeSupplier',
      summary: 'Elimina un proveedor',
      parameters: [idParam],
      responses: {
        200: messageResponse('Proveedor eliminado'),
        400: refResponse('ValidationError'),
        404: refResponse('NotFound'),
        500: refResponse('ServerError'),
      },
    },
  },
};
