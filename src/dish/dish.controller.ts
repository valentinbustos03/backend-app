import { Request, Response } from "express";
import { DishSchema, DishIdSchema } from "./dish.schema.js";
import { DishService } from "./dish.service.js";
import { orm } from "../shared/db/orm.js";
import { IngredientIdSchema } from "../ingredient/ingredient.schema.js";

const dishService = new DishService(orm.em);

async function add(req: Request, res: Response) {
  const ingredientInput = await DishSchema.safeParseAsync(req.body);
  if (ingredientInput.success) {
    try {
      const ingredient = await dishService.createDish(
        ingredientInput.data
      );
      res.status(201).json({ message: 'Ingredient created', data: ingredient });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: 'Error creating ingredient', error: error.message });
    }
  } else {
    res
      .status(400)
      .json({ message: 'Validation error', error: ingredientInput.error });
  }
}

async function findAll(req: Request, res: Response) {
  const ingredientList = await dishService.findAllDishes();
  try {
    if (ingredientList) {
      res
        .status(200)
        .json({ message: 'Found all ingredients', data: ingredientList });
    } else {
      res.status(404).json({ message: 'Ingredients not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  const idInput = await IngredientIdSchema.safeParseAsync(req.body.id);
  if (idInput.success) {
    //validacion de que el id ES UN SNOWFLAKE ID
    try {
      const ingredient = await dishService.findDishById(
        idInput.data
      );
      if (ingredient) {
        //validacion de que el id EXISTE EN LA BD
        res.status(200).json({ message: 'Ingredient found', data: ingredient }); //EXISTE
      } else {
        res
          .status(404)
          .json({ message: 'Ingredient not found', data: ingredient }); //NO EXISTE
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message }); //SERVER ERROR
    }
  } else {
    res.status(400).json({ message: 'Validation error', error: idInput.error }); //FALLA VALIDACION
  }
}

async function update(req: Request, res: Response) {
  const idInput = await IngredientIdSchema.safeParseAsync(req.body.id);
  const ingredientInput = await DishSchema.safeParseAsync(req.body);
  if (idInput.success && ingredientInput.success) {
    try {
      const ingredient = await dishService.updateDish(
        idInput.data,
        ingredientInput.data
      );
      if (ingredient) {
        res.status(200).json({
          message: 'Ingredient updated successfully',
          data: ingredient,
        });
      } else {
        res
          .status(404)
          .json({ message: 'Ingredient not found', data: ingredient });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json({
      message: 'Validation error',
      error1: idInput.error,
      error2: ingredientInput.error,
    });
  }
}

async function remove(req: Request, res: Response) {
  const idInput = await IngredientIdSchema.safeParseAsync(req.body.id);
  if (idInput.success) {
    try {
      const ingredient = await dishService.deleteDish(idInput.data);
      res.status(200).json({
        message: 'Ingredient deleted successfully',
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json({ message: 'Validation error', error: idInput.error });
  }
}

export {add, findAll, findOne, update, remove};