export interface CreateIngredientDto {
  cod: string;
  name: string;
  description?: string;
  stock: number;
  uniteOfMeasure: string;
  origin: string;
  stockLimit: number;
  suppliers: string[];
}

export interface IngredientIdDto {
  id: string;
}

export type UpdateIngredientDto = Partial<CreateIngredientDto>;
