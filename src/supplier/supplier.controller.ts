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
  if (supplierInput.success) {
    try {
      const supplier = await supplierService.createSupplier(supplierInput.data);
      res.status(201).json({ message: 'Supplier created', data: supplier });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: 'Error creating supplier', error: error.message });
    }
  } else {
    res
      .status(400)
      .json({ message: 'Validation error', error: supplierInput.error });
  }
}

async function findAll(req: Request, res: Response) {
  const supplierList = await supplierService.findAllSupplier();
  try {
    if (supplierList) {
      res
        .status(200)
        .json({ message: 'Found all suppliers', data: supplierList });
    } else {
      res.status(404).json({ message: 'Suppliers not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

async function findOneById(req: Request, res: Response) {
  const idInput = await SupplierIdSchema.safeParseAsync(req.body.id);
  if (idInput.success) {
    //validacion de que el id ES UN SNOWFLAKE ID
    try {
      const supplier = await supplierService.findSupplierById(idInput.data);
      if (supplier) {
        //validacion de que el id EXISTE EN LA BD
        res.status(200).json({ message: 'Supplier found', data: supplier }); //EXISTE
      } else {
        res.status(404).json({ message: 'Supplier not found', data: supplier }); //NO EXISTE
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message }); //SERVER ERROR
    }
  } else {
    res.status(400).json({ message: 'Validation error', error: idInput.error }); //FALLA VALIDACION
  }
}

async function findOneByTaxId(req: Request, res: Response) {
  const taxIdInput = await SupplierTaxIdSchema.safeParseAsync(req.body.taxId);
  if (taxIdInput.success) {
    //validacion de que el id ES UN SNOWFLAKE ID
    try {
      const supplier = await supplierService.findSupplierByTaxId(
        taxIdInput.data.taxId
      );
      if (supplier) {
        //validacion de que el id EXISTE EN LA BD
        res.status(200).json({ message: 'Supplier found', data: supplier }); //EXISTE
      } else {
        res.status(404).json({ message: 'Supplier not found', data: supplier }); //NO EXISTE
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message }); //SERVER ERROR
    }
  } else {
    res
      .status(400)
      .json({ message: 'Validation error', error: taxIdInput.error }); //FALLA VALIDACION
  }
}

async function update(req: Request, res: Response) {
  const idInput = await SupplierIdSchema.safeParseAsync(req.body.id);
  const supplierInput = await SupplierSchema.safeParseAsync(req.body);
  if (idInput.success && supplierInput.success) {
    try {
      const supplier = await supplierService.updateSupplier(
        idInput.data,
        supplierInput.data
      );
      if (supplier) {
        res.status(200).json({
          message: 'Supplier updated successfully',
          data: supplier,
        });
      } else {
        res.status(404).json({ message: 'Supplier not found', data: supplier });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json({
      message: 'Validation error',
      error1: idInput.error,
      error2: supplierInput.error,
    });
  }
}

async function remove(req: Request, res: Response) {
  const idInput = await SupplierIdSchema.safeParseAsync(req.body.id);
  if (idInput.success) {
    try {
      await supplierService.deleteSupplier(idInput.data);
      res.status(200).json({
        message: 'Supplier deleted successfully',
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json({ message: 'Validation error', error: idInput.error });
  }
}

export { findAll, findOneById, findOneByTaxId, add, update, remove };
