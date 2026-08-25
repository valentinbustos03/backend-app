import { EntityManager, Loaded } from '@mikro-orm/core';
import { Dish } from './dish.entity.js';
import { DishIngredient } from './dishIngredient.entity.js';
import { CreateDishDto, DishIdDto, UpdateDishDto } from './dish.dto.js';
import { Ingredient } from '../ingredient/ingredient.entity.js';
import { Chef } from '../employee/type/chef.entity.js';

export class DishService {
  private readonly em: EntityManager;

  constructor(em: EntityManager) {
    this.em = em;
  }

  async createDish(data: CreateDishDto): Promise<Dish> {
    const newDish = new Dish();
    newDish.cod = data.cod;
    newDish.name = data.name;
    newDish.description = data.description;
    newDish.picture = data.picture;
    newDish.price = data.price;
    newDish.calification = data.calification;
    newDish.tag = data.tag;
    newDish.chef = this.em.getReference(Chef, data.chef);

    for (const item of data.ingredients) {
      const dishIngredient = new DishIngredient();
      dishIngredient.ingredient = this.em.getReference(
        Ingredient,
        item.ingredient
      );
      dishIngredient.dish = newDish;
      dishIngredient.quantity = item.quantity;
      newDish.ingredients.add(dishIngredient);
    }

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
      const wantedQuantities = new Map(
        data.ingredients.map((item) => [item.ingredient, item.quantity])
      );

      for (const current of updatedDish.ingredients.getItems()) {
        const quantity = wantedQuantities.get(current.ingredient.id);
        if (quantity === undefined) {
          updatedDish.ingredients.remove(current);
        } else {
          current.quantity = quantity;
          wantedQuantities.delete(current.ingredient.id);
        }
      }

      for (const [ingredientId, quantity] of wantedQuantities) {
        const dishIngredient = new DishIngredient();
        dishIngredient.ingredient = this.em.getReference(
          Ingredient,
          ingredientId
        );
        dishIngredient.dish = updatedDish;
        dishIngredient.quantity = quantity;
        updatedDish.ingredients.add(dishIngredient);
      }

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
