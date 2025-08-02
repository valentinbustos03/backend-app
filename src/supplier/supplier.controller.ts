import { Request, Response, NextFunction } from 'express';
import { SupplierService } from '../supplier/supplier.service.js';
import { orm } from '../shared/db/orm.js';
import {
  SupplierIdSchema,
  SupplierSchema,
  SupplierTaxIdSchema,
} from './supplier.schema.js';

const supplierService = new SupplierService(orm.em);

async function add(req: Request, res: Response) {
  const supplierInput = await SupplierSchema.safeParseAsync(req.body);
  if (!supplierInput.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: supplierInput.error });
  }
  try {
    const supplier = await supplierService.createSupplier(supplierInput.data);
    return res
      .status(201)
      .json({ message: 'Supplier created', data: supplier });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: 'Error creating supplier', error: error.message });
  }
}

async function findAll(req: Request, res: Response) {
  try {
    const supplierList = await supplierService.findAllSupplier();
    const msg =
      (supplierList?.length ?? 0) === 0
        ? 'No suppliers found'
        : 'Suppliers found';
    return res.status(200).json({ message: msg, data: supplierList });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function findOneById(req: Request, res: Response) {
  const idInput = await SupplierIdSchema.safeParseAsync(req.body.id);
  if (!idInput.success) {
    return res.status(400).json({ message: 'Validation error', error: idInput.error }); 
  }
  try {
    const supplier = await supplierService.findSupplierById(idInput.data);
    const msg = supplier === null ? 'No supplier found' : 'Supplier found';
    return res.status(200).json({ message: msg, data: supplier }); 
  } catch (error: any) {
    return res.status(500).json({ error: error.message }); 
  }
}

async function findOneByTaxId(req: Request, res: Response) {
  const taxIdInput = await SupplierTaxIdSchema.safeParseAsync(req.body.taxId);
  if (!taxIdInput.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: taxIdInput.error });
  }
  try {
    const supplier = await supplierService.findSupplierByTaxId(
      taxIdInput.data.taxId
    );
    const msg = supplier === null ? 'No supplier found' : 'Supplier found';
    return res.status(200).json({ message: msg, data: supplier }); 
  } catch (error: any) {
    return res.status(500).json({ error: error.message });  
  }
}

async function update(req: Request, res: Response) {
  const idInput = await SupplierIdSchema.safeParseAsync(req.body.id);
  if (!idInput.success) {
    return res.status(400).json({
      message: 'Validation error',
      error: idInput.error,
    });
  }
  
  const supplierInput = await SupplierSchema.safeParseAsync(req.body);
  if (!supplierInput.success) {
    return res.status(400).json({
      message: 'Validation error',
      error: supplierInput.error,
    });
  }

  try {
    const supplier = await supplierService.updateSupplier(
      idInput.data,
      supplierInput.data
    );
    return res.status(200).json({
      message: 'Supplier updated successfully',
      data: supplier,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function remove(req: Request, res: Response) {
  const idInput = await SupplierIdSchema.safeParseAsync(req.body.id);
  if (!idInput.success) {
    return res.status(400).json({ message: 'Validation error', error: idInput.error });
  }
  try {
    await supplierService.deleteSupplier(idInput.data);
    return res.status(200).json({
      message: 'Supplier deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export { findAll, findOneById, findOneByTaxId, add, update, remove };
