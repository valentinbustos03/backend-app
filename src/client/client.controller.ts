import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import { ClientService } from '../client/client.service.js';
import {
  ClientSchema,
  ClientIdSchema,
  ClientDniSchema,
} from './client.schema.js';

const clientService = new ClientService(orm.em);

async function add(req: Request, res: Response) {
  const clientInput = await ClientSchema.safeParseAsync(req.body);
  if (!clientInput.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: clientInput.error });
  }
  try {
    const client = await clientService.createClient(clientInput.data);
    return res.status(201).json({ message: 'Client created', data: client });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: 'Error creating client', error: error.message });
  }
}

async function findAll(req: Request, res: Response) {
  try {
    const clientList = await clientService.findAllClient();
    const msg =
      (clientList?.length ?? 0) === 0 ? 'No clients found' : 'Clients found';
    return res.status(200).json({ message: msg, data: clientList ?? [] });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function findOneById(req: Request, res: Response) {
  const idInput = await ClientIdSchema.safeParseAsync(req.body.id);
  if (!idInput.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: idInput.error });
  }
  try {
    const client = await clientService.findClientById(idInput.data);
    const msg = client === null ? 'No client found' : 'Client found';
    return res.status(200).json({ message: msg, data: client });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function findOneByDni(req: Request, res: Response) {
  const dniInput = await ClientDniSchema.safeParseAsync(req.body.dni);
  if (!dniInput.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: dniInput.error });
  }
  try {
    const client = await clientService.findClientByDni(dniInput.data.dni);
    const msg = client === null ? 'No client found' : 'Client found';
    return res.status(200).json({ message: msg, data: client });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function update(req: Request, res: Response) {
  const idInput = await ClientIdSchema.safeParseAsync(req.body.id);
  if (!idInput.success) {
    return res.status(400).json({
      message: 'Validation error',
      error: idInput.error,
    });
  }
  
  const clientInput = await ClientSchema.safeParseAsync(req.body);
  if (!clientInput.success) {
    return res.status(400).json({
      message: 'Validation error',
      error: clientInput.error,
    });
  }

  try {
    const client = await clientService.updateClient(
      idInput.data,
      clientInput.data
    );
    return res.status(200).json({
      message: 'Client updated successfully',
      data: client,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function remove(req: Request, res: Response) {
  const idInput = await ClientIdSchema.safeParseAsync(req.body.id);
  if (!idInput.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: idInput.error });
  }
  try {
    await clientService.deleteClient(idInput.data);
    return res.status(200).json({
      message: 'Client deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export { add, findAll, findOneById, findOneByDni, update, remove };