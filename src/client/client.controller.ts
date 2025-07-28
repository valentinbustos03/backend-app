import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import { ClientService } from '../client/client.service.js';
import { ClientSchema, ClientIdSchema, ClientDniSchema } from './client.schema.js';

const clientService = new ClientService(orm.em);

async function add(req: Request, res: Response) {
  const clientInput = await ClientSchema.safeParseAsync(req.body);
  if (clientInput.success) {
    try {
      const client = await clientService.createClient(
        clientInput.data
      );
      res.status(201).json({ message: 'Client created', data: client });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: 'Error creating client', error: error.message });
    }
  } else {
    res
      .status(400)
      .json({ message: 'Validation error', error: clientInput.error });
  }
}

async function findAll(req: Request, res: Response) {
  const clientList = await clientService.findAllClient();
  try {
    if (clientList) {
      res
        .status(200)
        .json({ message: 'Found all clients', data: clientList });
    } else {
      res.status(404).json({ message: 'Clients not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

async function findOneById(req: Request, res: Response) {
  const idInput = await ClientIdSchema.safeParseAsync(req.body.id);
  if (idInput.success) {
    //validacion de que el id ES UN SNOWFLAKE ID
    try {
      const client = await clientService.findClientById(
        idInput.data
      );
      if (client) {
        //validacion de que el id EXISTE EN LA BD
        res.status(200).json({ message: 'Client found', data: client }); //EXISTE
      } else {
        res
          .status(404)
          .json({ message: 'Client not found', data: client }); //NO EXISTE
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message }); //SERVER ERROR
    }
  } else {
    res.status(400).json({ message: 'Validation error', error: idInput.error }); //FALLA VALIDACION
  }
}

async function findOneByDni(req: Request, res: Response) {
  const dniInput = await ClientDniSchema.safeParseAsync(req.body.dni);
  if (dniInput.success) {
    //validacion de que el id ES UN SNOWFLAKE ID
    try {
      const client = await clientService.findClientByDni(dniInput.data.dni);
      if (client) {
        //validacion de que el id EXISTE EN LA BD
        res.status(200).json({ message: 'Client found', data: client }); //EXISTE
      } else {
        res.status(404).json({ message: 'Client not found', data: client }); //NO EXISTE
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message }); //SERVER ERROR
    }
  } else {
    res.status(400).json({ message: 'Validation error', error: dniInput.error }); //FALLA VALIDACION
  }
}

async function update(req: Request, res: Response) {
  const idInput = await ClientIdSchema.safeParseAsync(req.body.id);
  const clientInput = await ClientSchema.safeParseAsync(req.body);
  if (idInput.success && clientInput.success) {
    try {
      const client = await clientService.updateClient(
        idInput.data,
        clientInput.data
      );
      if (client) {
        res.status(200).json({
          message: 'Client updated successfully',
          data: client,
        });
      } else {
        res
          .status(404)
          .json({ message: 'Client not found', data: client });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json({
      message: 'Validation error',
      error1: idInput.error,
      error2: clientInput.error,
    });
  }
}

async function remove(req: Request, res: Response) {
  const idInput = await ClientIdSchema.safeParseAsync(req.body.id);
  if (idInput.success) {
    try {
      await clientService.deleteClient(idInput.data);
      res.status(200).json({
        message: 'Client deleted successfully',
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json({ message: 'Validation error', error: idInput.error });
  }
}

export {add, findAll, findOneById, findOneByDni, update, remove};