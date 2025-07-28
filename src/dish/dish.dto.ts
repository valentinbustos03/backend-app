export interface CreateDishDto {
  cod: string;
  name: string;
  description?: string;
  picture?: string; //usar Cloudinary
  price: number;
  calification: number;
  ingredients: string[]; // Array de IDs de ingredientes
}

export interface DishIdDto {
  id: string;
}
export type UpdateDishDto = Partial<CreateDishDto>;