export interface createSupplierDto {
  companyName: string;
  taxId: string; 
  mail: string;
  phoneNumber: string; 
  typeIngredient: string;
  fullName: string;
  bussinessName: string;
}

export interface SupplierIdDto{
  id: string;
}

export type UpdateSupplierDto = Partial<createSupplierDto>