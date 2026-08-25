import {
  arrayOf,
  dataResponse,
  idPathParam,
  jsonBody,
  messageResponse,
  nullableRef,
  PathsObject,
  queryParam,
  ref,
  refResponse,
  registerRequest,
} from '../shared/openapi/openapi.builder.js';
import { IngredientSchema } from './ingredient.schema.js';

registerRequest('IngredientInput', IngredientSchema);

const idParam = idPathParam('id', 'ID del ingrediente');

const includeDetails = queryParam(
  'includeDetails',
  'Con true incluye la lista de proveedores del ingrediente',
  { type: 'string', enum: ['true', 'false'] }
);

export const ingredientPaths: PathsObject = {
  '/ingredient/add': {
    post: {
      tags: ['ingredient'],
      operationId: 'addIngredient',
      summary: 'Da de alta un ingrediente',
      requestBody: jsonBody('IngredientInput', 'Datos del ingrediente'),
      responses: {
        201: dataResponse('Ingrediente creado', ref('Ingredient')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
  },
  '/ingredient/findAll': {
    get: {
      tags: ['ingredient'],
      operationId: 'findAllIngredients',
      summary: 'Lista todos los ingredientes',
      parameters: [includeDetails],
      responses: {
        200: dataResponse('Listado de ingredientes', arrayOf('Ingredient')),
        500: refResponse('ServerError'),
      },
    },
  },
  '/ingredient/lowStock': {
    get: {
      tags: ['ingredient'],
      operationId: 'findLowStockIngredients',
      summary: 'Lista los ingredientes que tocaron el limite de stock',
      description:
        'Devuelve los ingredientes con stock menor o igual a stockLimit, siempre con los proveedores poblados.',
      responses: {
        200: dataResponse(
          'Listado de ingredientes a reponer',
          arrayOf('Ingredient')
        ),
        500: refResponse('ServerError'),
      },
    },
  },
  '/ingredient/id/{id}': {
    get: {
      tags: ['ingredient'],
      operationId: 'findIngredientById',
      summary: 'Busca un ingrediente por ID',
      description:
        'Con un ID inexistente responde 200 con data en null (ver Convenciones).',
      parameters: [idParam, includeDetails],
      responses: {
        200: dataResponse('Ingrediente encontrado', nullableRef('Ingredient')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
  },
  '/ingredient/{id}': {
    put: {
      tags: ['ingredient'],
      operationId: 'updateIngredient',
      summary: 'Actualiza un ingrediente',
      description:
        'Reemplaza el ingrediente completo: exige todos los campos. La lista suppliers sincroniza la relacion con proveedores.',
      parameters: [idParam],
      requestBody: jsonBody('IngredientInput', 'Datos del ingrediente'),
      responses: {
        200: dataResponse(
          'Ingrediente actualizado',
          nullableRef('Ingredient')
        ),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
    delete: {
      tags: ['ingredient'],
      operationId: 'removeIngredient',
      summary: 'Elimina un ingrediente',
      parameters: [idParam],
      responses: {
        200: messageResponse('Ingrediente eliminado'),
        400: refResponse('ValidationError'),
        404: refResponse('NotFound'),
        500: refResponse('ServerError'),
      },
    },
  },
};
