export interface CreateTableDto{
  cod: string;
  capacity: number;
  description?: string;
  occupied: boolean;
}

export interface TableIdDto{
  id: string
}

export type UpdateTableDto = Partial<CreateTableDto>;