import { Request, Response, NextFunction } from 'express';
import { EmployeeService } from '../services/employee.service.js';
import { orm } from '../shared/db/orm.js';

const employeeService = new EmployeeService(orm.em);

//API Sanitize
function sanitizeEmployeeInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    taxId: req.body.taxId,
    companyName: req.body.companyName,
    shift: req.body.shift,
    workedHours: req.body.workedHours,
    priceHour: req.body.priceHour,
    salary: req.body.salary,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  next();
}

//CRUD
async function add(req: Request, res: Response) {
  try {
    const input = req.body.sanitizedInput;
    const employeeInput = await employeeService.createEmployee(input);
    res.status(201).json({ message: 'Employee created', data: employeeInput });
  } catch (erro: any) {
    res.status(500).json({ message: 'Employee can not be created' });
  }
}

async function findAll(req: Request, res: Response) {
  try {
    const employeeList = await employeeService.findAllEmployee();
    if (!employeeList) {
      res.status(404).json({ message: 'Employee not found' });
    }
    res
      .status(200)
      .json({ message: 'Found all employees', data: employeeList });
  } catch (error: any) {
    res.status(500).json({ message: 'not found' });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const taxId = req.params.taxId;
    const employee = await employeeService.findEmployeeByTaxId(taxId);
    if (!employee) {
      res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json({ message: 'found employee', data: employee });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const taxId = req.params.taxId;
    const employee = await employeeService.updateEmployee(
      taxId,
      req.body.sanitizedInput
    );
    if (!employee) {
      res.status(404).send({ message: 'Employee not found' });
    }
    res
      .status(200)
      .send({ message: 'Employee updated successfully', data: employee });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const taxId = req.params.taxId;
    const employee = await employeeService.deleteEmployee(taxId);
    if (!employee) {
      res.status(404).send({ message: 'Employee not found' });
    }
    res.status(200).send({ message: 'Employee deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { sanitizeEmployeeInput, findAll, findOne, add, update, remove };
