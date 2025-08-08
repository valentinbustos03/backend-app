import { Request, Response } from 'express';
import {
  IngredientSchema,
  IngredientIdSchema,
  CreateIngredientInput,
  UpdateIngredientInput,
} from './ingredient.schema.js';
import { IngredientService } from './ingredient.service.js';
import { orm } from '../shared/db/orm.js';

const ingredientService = new IngredientService(orm.em);

async function add(req: Request, res: Response) {
  const ingredientBody = await IngredientSchema.safeParseAsync(req.body);
  if (!ingredientBody.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: ingredientBody.error });
  }
  try {
    const ingredientInput: CreateIngredientInput = ingredientBody.data;
    const ingredient = await ingredientService.createIngredient(
      ingredientInput
    );
    return res
      .status(201)
      .json({ message: 'Ingredient created', data: ingredient });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: 'Error creating ingredient', error: error.message });
  }
}

async function findAll(req: Request, res: Response) {
  try {
    const ingredientList = await ingredientService.findAllIngredients();
    const msg =
      (ingredientList?.length ?? 0) === 0
        ? 'No ingredients found'
        : 'Ingredients found';
    return res.status(200).json({ message: msg, data: ingredientList });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  const idInput = await IngredientIdSchema.safeParseAsync(req.body.id);
  if (!idInput.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: idInput.error });
  }
  try {
    const ingredient = await ingredientService.findIngredientById(idInput.data);
    const msg =
      ingredient === null ? 'No ingredient found' : 'Ingredient found';
    return res.status(200).json({ message: msg, data: ingredient });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function update(req: Request, res: Response) {
  const idInput = await IngredientIdSchema.safeParseAsync(req.body.id);
  if (!idInput.success) {
    return res.status(400).json({
      message: 'Validation error',
      error: idInput.error,
    });
  }

  const ingredientBody = await IngredientSchema.safeParseAsync(req.body);
  if (!ingredientBody.success) {
    return res.status(400).json({
      message: 'Validation error',
      error: ingredientBody.error,
    });
  }

  try {
    const ingredientInput: UpdateIngredientInput = ingredientBody.data;
    const ingredient = await ingredientService.updateIngredient(
      idInput.data,
      ingredientInput
    );
    return res.status(200).json({
      message: 'Ingredient updated successfully',
      data: ingredient,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function remove(req: Request, res: Response) {
  const idInput = await IngredientIdSchema.safeParseAsync(req.body.id);
  if (!idInput.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: idInput.error });
  }
  try {
    await ingredientService.deleteIngredient(idInput.data);
    return res.status(200).json({
      message: 'Ingredient deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export { add, findAll, findOne, update, remove };
