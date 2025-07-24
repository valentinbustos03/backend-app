import { EntityManager } from '@mikro-orm/core';
import { Dish } from './dish.entity.js';
import { CreateDishDto, DishIdDto, UpdateDishDto } from './dish.dto.js';

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

  async updateDish(id: DishIdDto, data: UpdateDishDto): Promise<Dish | null> {
    const updatedDish = await this.em.findOne(Dish, id);
    if (updatedDish) {
      this.em.assign(updatedDish, data);
      await this.em.flush();
      return updatedDish;
    } else {
      return null;
    }
  }

  async deleteDish(id: DishIdDto){
    const deletedDish = await this.em.findOne(Dish, id);
    if (deletedDish) {
      await this.em.removeAndFlush(deletedDish);
    }
  }
}
