import { Request, Response, NextFunction } from 'express'
import { TableRepository } from '../repositories/table.repository.js'
import { Table } from '../models/table.model.js'

const tableRepository = new TableRepository()

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

//CRUD
function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput

  const tableInput = new Table(
    input.cod,
    input.capacity,
    input.description,
    input.occupied,
  )

  const table = tableRepository.add(tableInput)
  res.status(201).send({ message: 'Table created', data: table })
}

function findAll(req: Request, res: Response) {
  res.json({ data: tableRepository.findAll() })
}

function findOne(req: Request, res: Response) {
  const cod = req.params.cod
  const table = tableRepository.findOne({ cod })
  if (!table) {
    res.status(404).send({ message: 'Table not found' })
  }
  res.json({ data: table })
}

function update(req: Request, res: Response) {
  req.body.sanitizedInput.cod = req.params.cod
  const table = tableRepository.update(req.body.sanitizedInput)

  if (!table) {
    res.status(404).send({ message: 'Table not found' })
  }

  res.status(200).send({ message: 'Table updated successfully', data: table })
}

function remove(req: Request, res: Response) {
  const cod = req.params.cod
  const table = tableRepository.delete({ cod })

  if (!table) {
    res.status(404).send({ message: 'Table not found' })
  } else {
    res.status(200).send({ message: 'Table deleted successfully' })
  }
}

export { sanitizeTableInput, findAll, findOne, add, update, remove }