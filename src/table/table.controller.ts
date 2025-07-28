import { Request, Response, NextFunction } from 'express';
import { TableService } from '../table/table.service.js';
import { orm } from '../shared/db/orm.js';
import { TableCodSchema, TableIdSchema, TableSchema } from './table.schema.js';

const tableService = new TableService(orm.em);

async function add(req: Request, res: Response) {
  const tableInput = await TableSchema.safeParseAsync(req.body);
  if (!tableInput.success) {
      res
    .status(400)
    .json({ message: 'Validation error', error: tableInput.error });
  }
  try {
    const table = await tableService.createTable(tableInput.data);
    res
      .status(201)
      .json({ message: 'Table created', data: table });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Error creating table', error: error.message });
  }
}

async function findAll(req: Request, res: Response) {
  try {
    const tableList = await tableService.findAllTable();
    res
      .status(200)
      .json({ message: 'Found all tables', data: tableList });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message });
  }
}

async function findOneById(req: Request, res: Response) {
  const idInput = await TableIdSchema.safeParseAsync(req.body.id);
  if (!idInput.success) {
    res
      .status(400)
      .json({ message: 'Validation error', error: idInput.error }); //FALLA VALIDACION
  }
    //validacion de que el id ES UN SNOWFLAKE ID
  try {
    const table = await tableService.findTableById(idInput.data);
      //validacion de que el id EXISTE EN LA BD
    res
      .status(200)
      .json({ message: 'Table found', data: table }); //EXISTE
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message }); //SERVER ERROR
  }
}

async function findOneByCod(req: Request, res: Response) {
  const codInput = await TableCodSchema.safeParseAsync(req.body.cod);
  if (!codInput.success) {
    res
      .status(400)
      .json({ message: 'Validation error', error: codInput.error }); //FALLA VALIDACION
  }
    //validacion de que el id ES UN SNOWFLAKE ID
  try {
    const table = await tableService.findTableByCod(codInput.data.cod);
      //validacion de que el id EXISTE EN LA BD
    res
      .status(200)
      .json({ message: 'Table found', data: table }); //EXISTE
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message }); //SERVER ERROR
  }
}

async function update(req: Request, res: Response) {
  const idInput = await TableIdSchema.safeParseAsync(req.body.id);
  const tableInput = await TableSchema.safeParseAsync(req.body);
  if (!idInput.success && !tableInput.success) {
    res
      .status(400)
      .json({
      message: 'Validation error',
      error1: idInput.error,
      error2: tableInput.error,
    });
  }
  try {
    const table = await tableService.updateTable(
      idInput.data,
      tableInput.data
    );
    res
      .status(200)
      .json({
        message: 'Table updated successfully',
        data: table,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message });
  }
}

async function remove(req: Request, res: Response) {
  const idInput = await TableIdSchema.safeParseAsync(req.body.id);
  if (!idInput.success) {
    res
      .status(400)
      .json({ message: 'Validation error', error: idInput.error });
  }
  try {
    await tableService.deleteTable(idInput.data);
    res
      .status(200)
      .json({
      message: 'Table deleted successfully',
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message });
  }
}

export { findAll, findOneByCod, findOneById, add, update, remove };
