import { Router } from 'express';
import {
  add,
  findAll,
  findOne,
  update,
  remove,
} from './ingredient.controller.js';

export const ingredientRouter = Router();

ingredientRouter.post('/add', add);
ingredientRouter.get('/findAll', findAll);
ingredientRouter.get('/findOne/:id', findOne);
ingredientRouter.put('/update/:id', update);
ingredientRouter.delete('/remove/:id', remove);

/**
 * @swagger
 * tags:
 * name: Ingredient
 * description: API for managing ingredients in the restaurant system.
 */

/**
 * @swagger
 * /add:
 *   post:
 *     summary: Crea un nuevo ingrediente
 *     tags: [Ingredient]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
*              type: object
*              required:
*                - cod
*                - name
*                - description
*                - stock
*                - unitOfMeasure
*                - origin
*                - stockLimit
*                - suppliers
*              properties:
*                cod:
*                  type: string
*                name:
*                  type: string
*                description:
*                  type: string
*                stock:
*                  type: integer
*                uniteOfMeasure:
*                  type: string
*                origin:
*                  type: string
*                stockLimit:
*                  type: integer
*                suppliers:
*                  type: array
*                  items:
*                    type: string
*                    example: "123456789012345678"
*     responses:
*       201:
*         description: Ingrediente creado correctamente
*       400:
*         description: Datos inválidos
*/
