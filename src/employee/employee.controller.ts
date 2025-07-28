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
  if (employeeInput.success) {
    try {
      const employee = await employeeService.createEmployee(employeeInput.data);
      res.status(201).json({ message: 'Employee created', data: employee });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: 'Error creating employee', error: error.message });
    }
  } else {
    res
      .status(400)
      .json({ message: 'Validation error', error: employeeInput.error });
  }
}

async function findAll(req: Request, res: Response) {
  const employeeList = await employeeService.findAllEmployee();
  try {
    if (employeeList) {
      res
        .status(200)
        .json({ message: 'Found all employees', data: employeeList });
    } else {
      res.status(404).json({ message: 'Employees not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

async function findOneById(req: Request, res: Response) {
  const idInput = await EmployeeIdSchema.safeParseAsync(req.body.id);
  if (idInput.success) {
    //validacion de que el id ES UN SNOWFLAKE ID
    try {
      const employee = await employeeService.findEmployeeById(idInput.data);
      if (employee) {
        //validacion de que el id EXISTE EN LA BD
        res.status(200).json({ message: 'Employee found', data: employee }); //EXISTE
      } else {
        res.status(404).json({ message: 'Employee not found', data: employee }); //NO EXISTE
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message }); //SERVER ERROR
    }
  } else {
    res.status(400).json({ message: 'Validation error', error: idInput.error }); //FALLA VALIDACION
  }
}

async function findOneByTaxId(req: Request, res: Response) {
  const taxIdInput = await EmployeeTaxIdSchema.safeParseAsync(req.body.taxId);
  if (taxIdInput.success) {
    //validacion de que el id ES UN SNOWFLAKE ID
    try {
      const employee = await employeeService.findEmployeeByTaxId(
        taxIdInput.data.taxId
      );
      if (employee) {
        //validacion de que el id EXISTE EN LA BD
        res.status(200).json({ message: 'Employee found', data: employee }); //EXISTE
      } else {
        res.status(404).json({ message: 'Employee not found', data: employee }); //NO EXISTE
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message }); //SERVER ERROR
    }
  } else {
    res
      .status(400)
      .json({ message: 'Validation error', error: taxIdInput.error }); //FALLA VALIDACION
  }
}

async function update(req: Request, res: Response) {
  const idInput = await EmployeeIdSchema.safeParseAsync(req.body.id);
  const employeeInput = await EmployeeSchema.safeParseAsync(req.body);
  if (idInput.success && employeeInput.success) {
    try {
      const employee = await employeeService.updateEmployee(
        idInput.data,
        employeeInput.data
      );
      if (employee) {
        res.status(200).json({
          message: 'Employee updated successfully',
          data: employee,
        });
      } else {
        res.status(404).json({ message: 'Employee not found', data: employee });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json({
      message: 'Validation error',
      error1: idInput.error,
      error2: employeeInput.error,
    });
  }
}

async function remove(req: Request, res: Response) {
  const idInput = await EmployeeIdSchema.safeParseAsync(req.body.id);
  if (idInput.success) {
    try {
      await employeeService.deleteEmployee(idInput.data);
      res.status(200).json({
        message: 'Employee deleted successfully',
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json({ message: 'Validation error', error: idInput.error });
  }
}

export { findAll, findOneById, findOneByTaxId, add, update, remove };
