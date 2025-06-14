import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import { ClientService } from '../client/client.service.js';

const clientService = new ClientService(orm.em);

//API Sanitize
function sanitizeClientInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    dni: parseInt(req.body.dni),
    orderHistory: req.body.orderHistory,
    penalty: req.body.penalty,
  
  };
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  next();
}

//CRUD
async function add(req: Request, res: Response) {
  try {
    const input = req.body.sanitizedInput;
    const clientInput = await clientService.createClient(input);
    res.status(201).json({ message: 'Client created', data: clientInput });
  } catch (erro: any) {
    res.status(500).json({ message: 'Client can not be created' });
  }
}

async function findAll(req: Request, res: Response) {
  try {
    const clientList = await clientService.findAllClient();
    if (!clientList) {
      res.status(404).json({ message: 'Client not found' });
    }
    res.status(200).json({ message: 'Found all clients', data: clientList });
  } catch (error: any) {
    res.status(500).json({ message: 'not found' });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const dni = parseInt(req.params.dni);
    const client = await clientService.findClientByDni(dni);  
    if (!client) {
      res.status(404).json({ message: 'Client not found' });
    }
    res.status(200).json({ message: 'client found', data: client });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const dni = parseInt(req.params.dni);
    const client = await clientService.updateClient(dni, req.body.sanitizedInput);
    if (!client) {
      res.status(404).send({ message: 'Client not found' });
    }
    res
      .status(200)
      .send({ message: 'Client updated successfully', data: client });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const dni = parseInt(req.params.dni);
    const client = await clientService.deleteClient(dni);
    if (!client) {
      res.status(404).send({ message: 'Client not found' });
    }
    res.status(200).send({ message: 'Client deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { sanitizeClientInput, findAll, findOne, add, update, remove };
