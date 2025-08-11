import { EntityManager, Loaded } from '@mikro-orm/core';
import { Ingredient } from './ingredient.entity.js';
import {
  CreateIngredientDto,
  IngredientIdDto,
  UpdateIngredientDto,
} from './ingredient.dto.js';
import { Supplier } from '../supplier/supplier.entity.js';

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

  // async updateIngredient(
  //   id: IngredientIdDto,
  //   data: UpdateIngredientDto
  // ): Promise<Ingredient | null> {
  //   const updatedIngredient = await this.em.findOne(Ingredient, id);
  //   if (updatedIngredient) {
  //     this.em.assign(updatedIngredient, data);
  //     await this.em.flush();
  //     return updatedIngredient;
  //   } else {
  //     return null;
  //   }
  // }
  
  async updateIngredient(
  id: IngredientIdDto,
  data: UpdateIngredientDto
): Promise<Loaded<Ingredient> | null> {
  // Buscamos el ingrediente existente y cargamos la colección de proveedores
  const updatedIngredient = await this.em.findOne(Ingredient, id, {
    populate: ['suppliers'],
  });

  if (!updatedIngredient) {
    return null;
  }

  // Verificamos si se envió el campo 'suppliers'
  if (data.suppliers !== undefined) {
    const newSupplierIds = data.suppliers;

    // Buscamos todos los objetos Supplier que coincidan con los IDs
    const suppliers = await this.em.find(Supplier, { id: { $in: newSupplierIds } });

    // Sincronizamos la colección de proveedores con los nuevos datos
    // MikroORM se encarga de las operaciones en la tabla pivote
    updatedIngredient.suppliers.set(suppliers);

    // Eliminamos la propiedad suppliers de `data` para que `em.assign`
    // no intente manejarla como una propiedad simple.
    delete data.suppliers;
  }

  // Asignamos el resto de las propiedades del DTO
  this.em.assign(updatedIngredient, data);

  // Guardamos todos los cambios
  await this.em.flush();

  return updatedIngredient;
}

  async deleteIngredient(id: IngredientIdDto) : Promise<boolean> {
    const deletedIngredient = await this.em.findOne(Ingredient, id);
    if (deletedIngredient) {
      await this.em.removeAndFlush(deletedIngredient);
      return true;
    }
    return false;
  }
}
