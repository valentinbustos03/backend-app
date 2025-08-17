export interface CreateDishDto {
  cod: string;
  name: string;
  description?: string;
  picture?: string; //usar Cloudinary
  price: number;
  calification: number;
  tag: string;
  ingredients: string[]; 
  chef: string;
}

export interface DishIdDto {
  id: string;
}
export type UpdateDishDto = Partial<CreateDishDto>;
