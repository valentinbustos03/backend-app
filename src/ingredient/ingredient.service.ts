import { EntityManager } from '@mikro-orm/core';
import { Ingredient } from './ingredient.entity.js';
import {
  CreateIngredientDto,
  IngredientIdDto,
  UpdateIngredientDto,
} from './ingredient.dto.js';

export class IngredientService {
  private readonly em: EntityManager;

  constructor(em: EntityManager) {
    this.em = em;
  }

  async createIngredient(data: CreateIngredientDto): Promise<Ingredient> {
    const newIngredient = this.em.create(Ingredient, data);
    await this.em.persistAndFlush(newIngredient);
    return newIngredient;
  }

  async findAllIngredients(): Promise<Ingredient[] | null> {
    const ingredientList = this.em.findAll(Ingredient);
    return ingredientList;
  }

  async findIngredientById(id: IngredientIdDto): Promise<Ingredient | null> {
    const ingredient = this.em.findOne(Ingredient, id);
    return ingredient;
  }
  async updateIngredient(
    id: IngredientIdDto,
    data: UpdateIngredientDto
  ): Promise<Ingredient | null> {
    const updatedIngredient = await this.em.findOne(Ingredient, id);
    if (updatedIngredient) {
      this.em.assign(updatedIngredient, data);
      await this.em.flush();
      return updatedIngredient;
    } else {
      return null;
    }
  }
  
  async deleteIngredient(id: IngredientIdDto) {
    const ingredient = await this.em.findOne(Ingredient, id);
    if (ingredient) {
      await this.em.removeAndFlush(ingredient);
    }
  }
}
