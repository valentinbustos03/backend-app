export interface CreateTableDto{
  cod: string;
  capacity: number;
  description?: string;
  occupied: boolean;
  sector: string;
  waiter: string;
}

export interface TableIdDto{
  id: string
}

export type UpdateTableDto = Partial<CreateTableDto>;