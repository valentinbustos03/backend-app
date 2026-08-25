import {
  arrayOf,
  dataResponse,
  idPathParam,
  jsonBody,
  messageResponse,
  nullableRef,
  pathParam,
  PathsObject,
  queryParam,
  ref,
  refResponse,
  registerRequest,
} from '../shared/openapi/openapi.builder.js';
import { EmployeeSchema } from './employee.schema.js';
import { EmployeeRole } from '../shared/enum/employee.roleEnum.js';

registerRequest('EmployeeInput', EmployeeSchema);

const idParam = idPathParam('id', 'ID del empleado');

export const employeePaths: PathsObject = {
  '/employee/add': {
    post: {
      tags: ['employee'],
      operationId: 'addEmployee',
      summary: 'Da de alta un empleado',
      description:
        'El campo role define el tipo: chef exige hierarchy y tag, waiter exige calification y sector.',
      requestBody: jsonBody('EmployeeInput', 'Datos del empleado'),
      responses: {
        201: dataResponse('Empleado creado', ref('Employee')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
  },
  '/employee/findAll': {
    get: {
      tags: ['employee'],
      operationId: 'findAllEmployees',
      summary: 'Lista los empleados, con filtros opcionales',
      parameters: [
        queryParam('shift', 'Turno exacto', { type: 'string', minLength: 1 }),
        queryParam('role', 'Tipo de empleado', {
          type: 'string',
          enum: Object.values(EmployeeRole),
        }),
        queryParam(
          'minCalification',
          'Calificacion minima; solo aplica a waiter',
          { type: 'number', minimum: 0 }
        ),
      ],
      responses: {
        200: dataResponse('Listado de empleados', arrayOf('Employee')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
  },
  '/employee/id/{id}': {
    get: {
      tags: ['employee'],
      operationId: 'findEmployeeById',
      summary: 'Busca un empleado por ID',
      description:
        'Con un ID inexistente responde 200 con data en null (ver Convenciones).',
      parameters: [idParam],
      responses: {
        200: dataResponse('Empleado encontrado', nullableRef('Employee')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
  },
  '/employee/taxId/{taxId}': {
    get: {
      tags: ['employee'],
      operationId: 'findEmployeeByTaxId',
      summary: 'Busca un empleado por CUIT/CUIL',
      description:
        'Con un ID inexistente responde 200 con data en null (ver Convenciones).',
      parameters: [
        pathParam('taxId', 'CUIT/CUIL del empleado', {
          type: 'string',
          minLength: 1,
        }),
      ],
      responses: {
        200: dataResponse('Empleado encontrado', nullableRef('Employee')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
  },
  '/employee/{id}': {
    put: {
      tags: ['employee'],
      operationId: 'updateEmployee',
      summary: 'Actualiza un empleado',
      description:
        'Reemplaza el empleado completo: exige todos los campos. El role enviado tiene que coincidir con el tipo con el que se dio de alta.',
      parameters: [idParam],
      requestBody: jsonBody('EmployeeInput', 'Datos del empleado'),
      responses: {
        200: dataResponse('Empleado actualizado', nullableRef('Employee')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
    delete: {
      tags: ['employee'],
      operationId: 'removeEmployee',
      summary: 'Elimina un empleado',
      parameters: [idParam],
      responses: {
        200: messageResponse('Empleado eliminado'),
        400: refResponse('ValidationError'),
        404: refResponse('NotFound'),
        500: refResponse('ServerError'),
      },
    },
  },
};
