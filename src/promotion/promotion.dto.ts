export interface CreatePromotionDto {
  cod: string;
  name: string;
  description?: string;
  discountPercentage: number;
  dateFrom: Date;
  dateTo: Date;
  active: boolean;
  dishes: string[];
}

export interface PromotionIdDto {
  id: string;
}

export type UpdatePromotionDto = CreatePromotionDto;

export interface PromotionFilterDto {
  current?: boolean;
}
