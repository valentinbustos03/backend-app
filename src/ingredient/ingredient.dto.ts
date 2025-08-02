import { Dish } from "../dish/dish.entity.js";
import { Supplier } from "../supplier/supplier.entity.js";

export interface CreateIngredientDto {
  cod: string;
  name: string;
  description?: string;
  stock: number;
  uniteOfMeasure: string;
  origin: string;
  stockLimit: number;
  suppliers: Partial<Supplier>[];
}

export interface IngredientIdDto {
  id: string;
}

export type UpdateIngredientDto = Partial<CreateIngredientDto>;
