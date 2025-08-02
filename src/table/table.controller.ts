import { Request, Response, NextFunction } from 'express';
import { TableService } from '../table/table.service.js';
import { orm } from '../shared/db/orm.js';
import { TableCodSchema, TableIdSchema, TableSchema } from './table.schema.js';

const tableService = new TableService(orm.em);

async function add(req: Request, res: Response) {
  const tableInput = await TableSchema.safeParseAsync(req.body);
  if (!tableInput.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: tableInput.error });
  }
  try {
    const table = await tableService.createTable(tableInput.data);
    return res.status(201).json({ message: 'Table created', data: table });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: 'Error creating table', error: error.message });
  }
}

async function findAll(req: Request, res: Response) {
  try {
    const tableList = await tableService.findAllTable();
    const msg =
      (tableList?.length ?? 0) === 0 ? 'No tables found' : 'Tables found';
    return res.status(200).json({ message: msg, data: tableList });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function findOneById(req: Request, res: Response) {
  const idInput = await TableIdSchema.safeParseAsync(req.body.id);
  if (!idInput.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: idInput.error });
  }
  try {
    const table = await tableService.findTableById(idInput.data);
    const msg = table === null ? 'No table found' : 'Table found';
    return res.status(200).json({ message: msg, data: table });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function findOneByCod(req: Request, res: Response) {
  const codInput = await TableCodSchema.safeParseAsync(req.body.cod);
  if (!codInput.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: codInput.error });
  }
  try {
    const table = await tableService.findTableByCod(codInput.data.cod);
    const msg = table === null ? 'No table found' : 'Table found';
    return res.status(200).json({ message: msg, data: table });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function update(req: Request, res: Response) {
  const idInput = await TableIdSchema.safeParseAsync(req.body.id);
  if (!idInput.success) {
    return res.status(400).json({
      message: 'Validation error',
      error: idInput.error,
    });
  }

  const tableInput = await TableSchema.safeParseAsync(req.body);
  if (!tableInput.success) {
    return res.status(400).json({
      message: 'Validation error',
      error: tableInput.error,
    });
  }

  try {
    const table = await tableService.updateTable(idInput.data, tableInput.data);
    return res.status(200).json({
      message: 'Table updated successfully',
      data: table,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function remove(req: Request, res: Response) {
  const idInput = await TableIdSchema.safeParseAsync(req.body.id);
  if (!idInput.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: idInput.error });
  }
  try {
    await tableService.deleteTable(idInput.data);
    return res.status(200).json({
      message: 'Table deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export { findAll, findOneByCod, findOneById, add, update, remove };
