import { Request, Response } from 'express';
import { DishSchema, DishIdSchema } from './dish.schema.js';
import { DishService } from './dish.service.js';
import { orm } from '../shared/db/orm.js';

const dishService = new DishService(orm.em);

async function add(req: Request, res: Response) {
  const dishInput = await DishSchema.safeParseAsync(req.body);
  if (!dishInput.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: dishInput.error });
  }
  try {
    const dish = await dishService.createDish(dishInput.data);
    return res
      .status(201)
      .json({ message: 'Dish created', data: dish });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: 'Error creating dish', error: error.message });
  }
}

async function findAll(req: Request, res: Response) {
  try {
    const dishList = await dishService.findAllDishes();
    const msg =
      (dishList?.length ?? 0) === 0
        ? 'No dishs found'
        : 'Dishs found';
    return res.status(200).json({ message: msg, data: dishList });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  const idInput = await DishIdSchema.safeParseAsync(req.body.id);
  if (!idInput.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: idInput.error });
  }

  try {
    const dish = await dishService.findDishById(idInput.data);
    const msg =
      dish === null ? 'No dish found' : 'Dish found';
    return res.status(200).json({ message: msg, data: dish });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function update(req: Request, res: Response) {
  const idInput = await DishIdSchema.safeParseAsync(req.body.id);
  if (!idInput.success) {
    return res.status(400).json({
      message: 'Validation error',
      error: idInput.error,
    });
  }

  const dishInput = await DishSchema.safeParseAsync(req.body);
  if (!dishInput.success) {
    return res.status(400).json({
      message: 'Validation error',
      error: dishInput.error,
    });
  }

  try {
    const dish = await dishService.updateDish(
      idInput.data,
      dishInput.data
    );
    return res.status(200).json({
      message: 'Dish updated successfully',
      data: dish,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function remove(req: Request, res: Response) {
  const idInput = await DishIdSchema.safeParseAsync(req.body.id);
  if (!idInput.success) {
    return res.status(400).json({ message: 'Validation error', error: idInput.error });
  }
  try {
    await dishService.deleteDish(idInput.data);
    return res.status(200).json({
      message: 'Dish deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export { add, findAll, findOne, update, remove };
