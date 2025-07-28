import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import { ClientService } from '../client/client.service.js';
import { ClientSchema, ClientIdSchema, ClientDniSchema } from './client.schema.js';

const clientService = new ClientService(orm.em);

async function add(req: Request, res: Response) {
  const clientInput = await ClientSchema.safeParseAsync(req.body);
  if (!clientInput.success) {
    res
      .status(400)
      .json({ message: 'Validation error', error: clientInput.error });
    }
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
}

async function findAll(req: Request, res: Response) {
    try {
      const clientList = await clientService.findAllClient();
      res
        .status(200)
        .json({ message: 'Found all clients', data: clientList });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

async function findOneById(req: Request, res: Response) {
  const idInput = await ClientIdSchema.safeParseAsync(req.body.id);
  if (!idInput.success) {
    res
      .status(400)
      .json({ message: 'Validation error', error: idInput.error }); //FALLA VALIDACION    //validacion de que el id ES UN SNOWFLAKE ID
  }
  try {
    const client = await clientService.findClientById(
      idInput.data
    );
      res
        .status(200)
        .json({ message: 'Client found', data: client }); //EXISTE
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message }); //SERVER ERROR correccion gasti ( habria que diferenciar error de server a q no exista?)
  }
}

  


async function findOneByDni(req: Request, res: Response) {
  const dniInput = await ClientDniSchema.safeParseAsync(req.body.dni);
  if (!dniInput.success) {
    //validacion de que el id ES UN SNOWFLAKE ID
    res
      .status(400)
      .json({ message: 'Validation error', error: dniInput.error }); //FALLA VALIDACION

    try {
      const client = await clientService.findClientByDni(dniInput.data.dni);
        //validacion de que el id EXISTE EN LA BD
        res
          .status(200)
          .json({ message: 'Client found', data: client }); //EXISTE
    } catch (error: any) {
      res
        .status(500)
        .json({ error: error.message }); //SERVER ERROR correc gasti, server error o client not found 
    }
  } 
}

async function update(req: Request, res: Response) {
  const idInput = await ClientIdSchema.safeParseAsync(req.body.id);
  const clientInput = await ClientSchema.safeParseAsync(req.body);
  if (!idInput.success && !clientInput.success) {
      res.status(400).json({
      message: 'Validation error',
      error1: idInput.error,
      error2: clientInput.error,
    });
    }
    try {
      const client = await clientService.updateClient(
        idInput.data,
        clientInput.data
      );
      res.status(200).json({
        message: 'Client updated successfully',
        data: client,
      });
    } catch (error: any) { //aca adentro se puede hacer un if con status === (num error ) 
      res
        .status(500)
        .json({ error: error.message });
    }
}


async function remove(req: Request, res: Response) {
  const idInput = await ClientIdSchema.safeParseAsync(req.body.id);
  if (!idInput.success) {
    res
      .status(400)
      .json({ message: 'Validation error', error: idInput.error });
  }
    try {
      await clientService.deleteClient(idInput.data);
      res.status(200).json({
        message: 'Client deleted successfully',
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
}

export {add, findAll, findOneById, findOneByDni, update, remove};