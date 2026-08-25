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
import { DishSchema } from './dish.schema.js';

registerRequest('DishInput', DishSchema);

const idParam = idPathParam('id', 'ID del plato');

export const dishPaths: PathsObject = {
  '/dish/add': {
    post: {
      tags: ['dish'],
      operationId: 'addDish',
      summary: 'Da de alta un plato',
      description:
        'ingredients define la receta: cada entrada referencia un ingrediente y la cantidad que consume. chef referencia al empleado de tipo chef responsable del plato.',
      requestBody: jsonBody('DishInput', 'Datos del plato'),
      responses: {
        201: dataResponse('Plato creado', ref('Dish')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
  },
  '/dish/findAll': {
    get: {
      tags: ['dish'],
      operationId: 'findAllDishes',
      summary: 'Lista todos los platos',
      responses: {
        200: dataResponse('Listado de platos', arrayOf('Dish')),
        500: refResponse('ServerError'),
      },
    },
  },
  '/dish/id/{id}': {
    get: {
      tags: ['dish'],
      operationId: 'findDishById',
      summary: 'Busca un plato por ID',
      description:
        'Con un ID inexistente responde 200 con data en null (ver Convenciones).',
      parameters: [idParam],
      responses: {
        200: dataResponse('Plato encontrado', nullableRef('Dish')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
  },
  '/dish/{id}': {
    put: {
      tags: ['dish'],
      operationId: 'updateDish',
      summary: 'Actualiza un plato',
      description:
        'Reemplaza el plato completo: exige todos los campos. La lista ingredients reemplaza la receta anterior.',
      parameters: [idParam],
      requestBody: jsonBody('DishInput', 'Datos del plato'),
      responses: {
        200: dataResponse('Plato actualizado', nullableRef('Dish')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
    delete: {
      tags: ['dish'],
      operationId: 'removeDish',
      summary: 'Elimina un plato',
      parameters: [idParam],
      responses: {
        200: messageResponse('Plato eliminado'),
        400: refResponse('ValidationError'),
        404: refResponse('NotFound'),
        500: refResponse('ServerError'),
      },
    },
  },
};
