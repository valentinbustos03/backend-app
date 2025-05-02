import { Request, Response, NextFunction } from 'express';
import { SupplierService } from '../services/supplier.service.js';
import { orm } from '../shared/db/orm.js';

const supplierService = new SupplierService(orm.em);

//API Sanitize
function sanitizeSupplierInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    id: req.body.id,
    companyName: req.body.companyName,
    taxId: req.body.taxId,
    mail: req.body.mail,
    phoneNumber: req.body.phoneNumber,
    typeIngredient: req.body.typeIngredient,
    name: req.body.name,
    bussinessName: req.body.bussinessName,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  next();
}
/*
  CONTROLADOR: Contiene la lógica de negocio para manejar las peticiones 
  a las rutas de las mesas. Interactúa con la base de datos 
  a través del ORM MikroORM y envía las respuestas HTTP al cliente.

  hace el laburo de depaul
*/

//CRUD
async function add(req: Request, res: Response) {
  try {
    const input = req.body.sanitizedInput;
    const supplierInput = await supplierService.createSupplier(input);
    res.status(201).json({ message: 'Supplier created', data: supplierInput });
  } catch (erro: any) {
    res.status(500).json({ message: 'Supplier can not be created' });
  }
}

async function findAll(req: Request, res: Response) {
  try {
    const supplierList = await supplierService.findAllSupplier();
    if (!supplierList) {
      res.status(404).json({ message: 'Supplier not found' });
    }
    res.status(200).json({ message: 'Found all suppliers', data: supplierList });
  } catch (error: any) {
    res.status(500).json({ message: 'not found' });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const supplier = await supplierService.findSupplierById(parseInt(id)); //OJO id viene como string de req.params.id
    if (!supplier) {
      res.status(404).json({ message: 'Supplier not found' });
    }
    res.status(200).json({ message: 'found supplier', data: supplier });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const supplier = await supplierService.updateSupplier(parseInt(id), req.body.sanitizedInput);
    if (!supplier) {
      res.status(404).send({ message: 'Supplier not found' });
    }
    res
      .status(200)
      .send({ message: 'Supplier updated successfully', data: supplier });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const supplier = await supplierService.deleteSupplier(parseInt(id));
    if (!supplier) {
      res.status(404).send({ message: 'Supplier not found' });
    }
    res.status(200).send({ message: 'Supplier deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { sanitizeSupplierInput, findAll, findOne, add, update, remove };
