export interface createSupplierDto {
  companyName: string;
  taxId: string; //yo lo pondria como number
  mail: string;
  phoneNumber: string; //yo lo pondria como number
  typeIngredient: string;
  fullName: string;
  bussinessName: string;
}

export interface SupplierIdDto{
  id: string;
}

export type UpdateSupplierDto = Partial<createSupplierDto>