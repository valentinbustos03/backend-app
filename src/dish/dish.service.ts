import { EntityManager, Loaded } from '@mikro-orm/core';
import { Dish } from './dish.entity.js';
import { CreateDishDto, DishIdDto, UpdateDishDto } from './dish.dto.js';
import { Ingredient } from '../ingredient/ingredient.entity.js';

export class DishService {
  private readonly em: EntityManager;

  constructor(em: EntityManager) {
    this.em = em;
  }

  async createDish(data: CreateDishDto): Promise<Dish> {
    const newDish = this.em.create(Dish, data);
    await this.em.persistAndFlush(newDish);
    return newDish;
  }

  async findAllDishes(): Promise<Dish[] | null> {
    const dishList = this.em.findAll(Dish);
    return dishList;
  }

  async findDishById(id: DishIdDto): Promise<Dish | null> {
    const dish = this.em.findOne(Dish, id);
    return dish;
  }

  // async updateDish(id: DishIdDto, data: UpdateDishDto): Promise<Dish | null> {
  //   const updatedDish = await this.em.findOne(Dish, id);
  //   if (updatedDish) {
  //     this.em.assign(updatedDish, data);
  //     await this.em.flush();
  //     return updatedDish;
  //   } else {
  //     return null;
  //   }
  // }
  
  async updateDish(
    id: DishIdDto,
    data: UpdateDishDto
  ): Promise<Loaded<Dish> | null> {
    const updatedDish = await this.em.findOne(Dish, id, {
      populate: ['ingredients'],
    });
  
    if (!updatedDish) {
      return null;
    }
  
    if (data.ingredients !== undefined) {
      const newIngredientsIds = data.ingredients;
  
      const ingredients = await this.em.find(Ingredient, { id: { $in: newIngredientsIds } });
  
      updatedDish.ingredients.set(ingredients);
  
      delete data.ingredients;
    }
  
    // Asignamos el resto de las propiedades del DTO
    this.em.assign(updatedDish, data);
  
    // Guardamos todos los cambios
    await this.em.flush();
  
    return updatedDish;
  }

  async deleteDish(id: DishIdDto) : Promise<boolean> {
    const deletedDish = await this.em.findOne(Dish, id);
    if (deletedDish) {
      await this.em.removeAndFlush(deletedDish);
      return true;
    }
    return false;
  }
}
