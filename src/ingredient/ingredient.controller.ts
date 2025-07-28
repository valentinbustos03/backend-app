import { Request, Response } from 'express';
import { IngredientSchema, IngredientIdSchema } from './ingredient.schema.js';
import { IngredientService } from './ingredient.service.js';
import { orm } from '../shared/db/orm.js';

const ingredientService = new IngredientService(orm.em);

async function add(req: Request, res: Response) {
  const ingredientInput = await IngredientSchema.safeParseAsync(req.body);
  if (!ingredientInput.success) {
    res
    .status(400)
    .json({ message: 'Validation error', error: ingredientInput.error });
  }
  try {
    const ingredient = await ingredientService.createIngredient(
      ingredientInput.data
    );
    res
      .status(201)
      .json({ message: 'Ingredient created', data: ingredient });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Error creating ingredient', error: error.message });
  }
}

async function findAll(req: Request, res: Response) {
  try {
    const ingredientList = await ingredientService.findAllIngredients();
    res
      .status(200)
      .json({ message: 'Found all ingredients', data: ingredientList });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  const idInput = await IngredientIdSchema.safeParseAsync(req.body.id);
  if (!idInput.success) {
    //validacion de que el id ES UN SNOWFLAKE ID
    res.status(400).json({ message: 'Validation error', error: idInput.error }); //FALLA VALIDACION
  }
  try {
    const ingredient = await ingredientService.findIngredientById(
      idInput.data
    );
      //validacion de que el id EXISTE EN LA BD
      res
        .status(200)
        .json({ message: 'Ingredient found', data: ingredient }); //EXISTE
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message }); //SERVER ERROR
  }
}

async function update(req: Request, res: Response) {
  const idInput = await IngredientIdSchema.safeParseAsync(req.body.id);
  const ingredientInput = await IngredientSchema.safeParseAsync(req.body);
  if (!idInput.success && !ingredientInput.success) {
        res
          .status(400)
          .json({
      message: 'Validation error',
      error1: idInput.error,
      error2: ingredientInput.error,
    });
  }
  try {
    const ingredient = await ingredientService.updateIngredient(
      idInput.data,
      ingredientInput.data
    );
      res
        .status(200)
        .json({
        message: 'Ingredient updated successfully',
        data: ingredient,
      });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message });
  }
}

async function remove(req: Request, res: Response) {
  const idInput = await IngredientIdSchema.safeParseAsync(req.body.id);
  if (!idInput.success) {
    res.status(400).json({ message: 'Validation error', error: idInput.error });
  }
    try {
      const ingredient = await ingredientService.deleteIngredient(idInput.data);
      res
        .status(200)
        .json({
        message: 'Ingredient deleted successfully',
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
}

export {add, findAll, findOne, update, remove};