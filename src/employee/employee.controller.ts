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
    return res
      .status(400)
      .json({ message: 'Validation error', error: employeeInput.error });
  }
  try {
    const employee = await employeeService.createEmployee(employeeInput.data);
    return res
      .status(201)
      .json({ message: 'Employee created', data: employee });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: 'Error creating employee', error: error.message });
  }
}

async function findAll(req: Request, res: Response) {
  try {
    const employeeList = await employeeService.findAllEmployee();
    const msg =
      (employeeList?.length ?? 0) === 0
        ? 'No empleyees found'
        : 'Employees found';
    return res.status(200).json({ message: msg, data: employeeList });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function findOneById(req: Request, res: Response) {
  const idInput = await EmployeeIdSchema.safeParseAsync(req.params);
  if (!idInput.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: idInput.error });
  }
  try {
    const employee = await employeeService.findEmployeeById(idInput.data);
    const msg = employee === null ? 'No employee found' : 'Employee found';
    return res.status(200).json({ message: msg, data: employee });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function findOneByTaxId(req: Request, res: Response) {
  const taxIdInput = await EmployeeTaxIdSchema.safeParseAsync(req.params);
  if (!taxIdInput.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: taxIdInput.error });
  }
  try {
    const employee = await employeeService.findEmployeeByTaxId(
      taxIdInput.data.taxId
    );
    const msg = employee === null ? 'No employee found' : 'Employee found';
    return res.status(200).json({ message: msg, data: employee });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function update(req: Request, res: Response) {
  const idInput = await EmployeeIdSchema.safeParseAsync(req.params);
  if (!idInput.success) {
    return res.status(400).json({
      message: 'Validation error',
      error: idInput.error,
    });
  }

  const employeeInput = await EmployeeSchema.safeParseAsync(req.body);
  if (!employeeInput.success) {
    return res.status(400).json({
      message: 'Validation error',
      error: employeeInput.error,
    });
  }

  try {
    const employee = await employeeService.updateEmployee(
      idInput.data,
      employeeInput.data
    );
    return res.status(200).json({
      message: 'Employee updated successfully',
      data: employee,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function remove(req: Request, res: Response) {
  const idInput = await EmployeeIdSchema.safeParseAsync(req.params);
  if (!idInput.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: idInput.error });
  }
  try {
    const deleted = await employeeService.deleteEmployee(idInput.data);
    if(!deleted){
      return res.status(404).json({ message: 'Employee not found' });
    }    
    return res.status(200).json({
      message: 'Employee deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export { findAll, findOneById, findOneByTaxId, add, update, remove };