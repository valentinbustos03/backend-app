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
    res
      .status(400)
      .json({ message: 'Validation error', error: supplierInput.error });
  }
  try {
    const supplier = await supplierService.createSupplier(supplierInput.data);
    res
      .status(201)
      .json({ message: 'Supplier created', data: supplier });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Error creating supplier', error: error.message });
  }
}

async function findAll(req: Request, res: Response) {
  try {
    const supplierList = await supplierService.findAllSupplier();
    res
      .status(200)
      .json({ message: 'Found all suppliers', data: supplierList });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

async function findOneById(req: Request, res: Response) {
  const idInput = await SupplierIdSchema.safeParseAsync(req.body.id);
  if (!idInput.success) {
    //validacion de que el id ES UN SNOWFLAKE ID
    res.status(400).json({ message: 'Validation error', error: idInput.error }); //FALLA VALIDACION
  }
  try {
    const supplier = await supplierService.findSupplierById(idInput.data);
      //validacion de que el id EXISTE EN LA BD
      res
        .status(200)
        .json({ message: 'Supplier found', data: supplier }); //EXISTE
  } catch (error: any) {
    res.status(500).json({ error: error.message }); //SERVER ERROR
  }
}

async function findOneByTaxId(req: Request, res: Response) {
  const taxIdInput = await SupplierTaxIdSchema.safeParseAsync(req.body.taxId);
  if (!taxIdInput.success) {
    //validacion de que el id ES UN SNOWFLAKE ID
    res
      .status(400)
      .json({ message: 'Validation error', error: taxIdInput.error }); //FALLA VALIDACION
  }
    try {
      const supplier = await supplierService.findSupplierByTaxId(
        taxIdInput.data.taxId
      );
        //validacion de que el id EXISTE EN LA BD
      res
        .status(200)
        .json({ message: 'Supplier found', data: supplier }); //EXISTE
    } catch (error: any) {
      res.status(500).json({ error: error.message }); //SERVER ERROR
    }
}

async function update(req: Request, res: Response) {
  const idInput = await SupplierIdSchema.safeParseAsync(req.body.id);
  const supplierInput = await SupplierSchema.safeParseAsync(req.body);
  if (!idInput.success && !supplierInput.success) {
      res
        .status(400)
        .json({
    message: 'Validation error',
    error1: idInput.error,
    error2: supplierInput.error,
    });
  }
  try {
    const supplier = await supplierService.updateSupplier(
      idInput.data,
      supplierInput.data
    );
    res
      .status(200)
      .json({
      message: 'Supplier updated successfully',
      data: supplier,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message });
  }
}

async function remove(req: Request, res: Response) {
  const idInput = await SupplierIdSchema.safeParseAsync(req.body.id);
  if (!idInput.success) {
    res
      .status(400)
      .json({ message: 'Validation error', error: idInput.error });
  }
  try {
    await supplierService.deleteSupplier(idInput.data);
    res
    .status(200)
    .json({
      message: 'Supplier deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export { findAll, findOneById, findOneByTaxId, add, update, remove };
