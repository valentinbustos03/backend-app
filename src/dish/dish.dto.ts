import { Ingredient } from '../ingredient/ingredient.entity.js';

export interface CreateDishDto {
  cod: string;
  name: string;
  description?: string;
  picture?: string; //usar Cloudinary
  price: number;
  calification: number;
  ingredients: string[]; 
  //chef: Partial<Chef>;
}

export interface DishIdDto {
  id: string;
}
export type UpdateDishDto = Partial<CreateDishDto>;
