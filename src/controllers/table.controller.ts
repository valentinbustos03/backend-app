import { Request, Response, NextFunction } from 'express'
import { TableService } from '../services/table.service.js'
import { orm } from '../shared/db/orm.js'

const tableService = new TableService(orm.em)

//API Sanitize
function sanitizeTableInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    cod: req.body.cod,
    capacity: req.body.capacity, 
    description: req.body.description, 
    occupied: req.body.occupied
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
  if (req.body.sanitizedInput[key] === undefined) {
    delete req.body.sanitizedInput[key]
  }
  })

  next()
}
/*
  CONTROLADOR: Contiene la lógica de negocio para manejar las peticiones 
  a las rutas de las mesas. Interactúa con la base de datos 
  a través del ORM MikroORM y envía las respuestas HTTP al cliente.

  hace el laburo de depaul
*/


//CRUD
async function add(req: Request, res: Response) {
  try{
    const input = req.body.sanitizedInput;
    const tableInput = await tableService.createTable(input);
    res.status(201).json({message: 'Table created', data: tableInput});
  }catch(erro:any){
    res.status(500).json({message: 'Table can not be created'});
  }
}

async function findAll(req: Request, res: Response) {
  try {
    const tableList = await tableService.findAllTable();
    if (!tableList) {
      res.status(404).json({ message: 'Table not found' });
    }
    res.status(200).json({message: 'Found all tables', data: tableList});
  } catch (error:any) {
    res.status(500).json({message: 'not found'});
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const cod = req.params.cod;
    const table = await tableService.findTableByCod(cod);
    if (!table) {
      res.status(404).json({ message: 'Table not found' });
      }
    res.status(200).json({ message: 'found table', data: table });
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const cod = req.params.cod;
    const table = await tableService.updateTable(cod, req.body.sanitizedInput)
    if (!table) {
      res.status(404).send({ message: 'Table not found' })
    }
    res.status(200).send({ message: 'Table updated successfully', data: table })
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try{
  const cod = req.params.cod;
  const table = await tableService.deleteTable(cod);
  if (!table) {
    res.status(404).send({ message: 'Table not found' })
  }
  res.status(200).send({ message: 'Table deleted successfully' })
  }
  catch(error:any){
    res.status(500).json({ message: error.message });
  }
}

export { sanitizeTableInput, findAll, findOne, add, update, remove }