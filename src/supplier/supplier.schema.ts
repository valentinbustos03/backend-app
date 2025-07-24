import z from 'zod';

const SnowflakeId = z.string().min(1).regex(/^\d+$/, 'ID inválido');

export const SupplierSchema = z.object({
  companyName: z.string().min(1),
  taxId: z.string().regex(/^\d{11}$/),
  mail: z.email(),
  phoneNumber: z.string().min(8),
  typeIngredient: z.string().min(1),
  fullName: z.string().min(1),
  bussinessName: z.string().min(1),
  ingredients: z.array(SnowflakeId),
}) 

export const SupplierIdSchema = z.object({
  id: SnowflakeId,
});

export const SupplierTaxIdSchema = z.object({
  taxId: z.string().regex(/^\d{11}$/),
});