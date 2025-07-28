import { Request, Response } from 'express';
import { EmployeeService } from '../employee/employee.service.js';
import {
  EmployeeSchema,
  EmployeeIdSchema,
  EmployeeTaxIdSchema,
} from './employee.schema.js';
import { orm } from '../shared/db/orm.js';

const employeeService = new EmployeeService(orm.em);

async function add(req: Request, res: Response) {
  const employeeInput = await EmployeeSchema.safeParseAsync(req.body);
  if (!employeeInput.success) {
      res
        .status(400)
        .json({ message: 'Validation error', error: employeeInput.error });
  }
  try {
    const employee = await employeeService.createEmployee(employeeInput.data);
    res
      .status(201)
      .json({ message: 'Employee created', data: employee });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Error creating employee', error: error.message });
  }
}

async function findAll(req: Request, res: Response) {

  try {
    const employeeList = await employeeService.findAllEmployee();
    res
      .status(200)
      .json({ message: 'Found all employees', data: employeeList });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message });
  }
}

async function findOneById(req: Request, res: Response) {
  const idInput = await EmployeeIdSchema.safeParseAsync(req.body.id);
  if (!idInput.success) {
    //validacion de que el id ES UN SNOWFLAKE ID
    res
      .status(400)
      .json({ message: 'Validation error', error: idInput.error }); //FALLA VALIDACION
  }
  try {
    const employee = await employeeService.findEmployeeById(idInput.data);
      res
        .status(200)
        .json({ message: 'Employee found', data: employee }); //EXISTE
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message }); //SERVER ERROR
  }
}

async function findOneByTaxId(req: Request, res: Response) {
  const taxIdInput = await EmployeeTaxIdSchema.safeParseAsync(req.body.taxId);
  if (!taxIdInput.success) {
    //validacion de que el id ES UN SNOWFLAKE ID
    res
      .status(400)
      .json({ message: 'Validation error', error: taxIdInput.error }); //FALLA VALIDACION
  }
  try {
    const employee = await employeeService.findEmployeeByTaxId(
      taxIdInput.data.taxId
    );
      //validacion de que el id EXISTE EN LA BD
      res
        .status(200)
        .json({ message: 'Employee found', data: employee }); //EXISTE
  } catch (error: any) {
    res.status(500).json({ error: error.message }); //SERVER ERROR
  }
}

async function update(req: Request, res: Response) {
  const idInput = await EmployeeIdSchema.safeParseAsync(req.body.id);
  const employeeInput = await EmployeeSchema.safeParseAsync(req.body);
  if (!idInput.success && !employeeInput.success) {
        res.status(400).json({
      message: 'Validation error',
      error1: idInput.error,
      error2: employeeInput.error,
    });
  }
  try {
    const employee = await employeeService.updateEmployee(
      idInput.data,
      employeeInput.data
    );
      res
        .status(200)
        .json({
        message: 'Employee updated successfully',
        data: employee,
      });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message });
  }
}

async function remove(req: Request, res: Response) {
  const idInput = await EmployeeIdSchema.safeParseAsync(req.body.id);
  if (!idInput.success) {
    res
      .status(400)
      .json({ message: 'Validation error', error: idInput.error });
  }
  try {
    await employeeService.deleteEmployee(idInput.data);
    res
      .status(200)
      .json({
      message: 'Employee deleted successfully',
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message });
  }
}

export { findAll, findOneById, findOneByTaxId, add, update, remove };
