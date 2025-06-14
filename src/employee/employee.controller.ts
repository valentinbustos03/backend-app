import { Request, Response, NextFunction } from 'express';
import { EmployeeService } from '../employee/employee.service.js';
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
    workedHours: parseFloat(req.body.workedHours),
    priceHour: parseFloat(req.body.priceHour),
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  next();
}

// // API Sanitize and Validate
// function sanitizeAndValidateEmployeeInput(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const { taxId, companyName, shift, workedHours, priceHour } = req.body;

//   // --- Validación y Conversión ---
//   const numWorkedHours = parseFloat(workedHours);
//   const numPriceHour = parseFloat(priceHour);

//   if (typeof taxId !== 'string' || taxId.trim() === '') {
//     return res.status(400).json({ message: 'Tax ID is required and must be a string.' });
//   }
//   if (typeof companyName !== 'string' || companyName.trim() === '') {
//     return res.status(400).json({ message: 'Company name is required and must be a string.' });
//   }
//   // Shift es opcional, pero si se envía, podría validarse
//   if (shift !== undefined && typeof shift !== 'string') {
//     return res.status(400).json({ message: 'Shift must be a string.' });
//   }

//   if (isNaN(numWorkedHours) || numWorkedHours <= 0) { // Asumimos que las horas trabajadas deben ser positivas
//     return res.status(400).json({ message: 'Worked hours must be a valid positive number.' });
//   }
//   if (isNaN(numPriceHour) || numPriceHour <= 0) { // Asumimos que el precio por hora debe ser positivo
//     return res.status(400).json({ message: 'Price per hour must be a valid positive number.' });
//   }

//   // Preparamos el input sanitizado y con tipos correctos para el controlador
//   req.body.sanitizedInput = {
//     taxId: taxId.trim(),
//     companyName: companyName.trim(),
//     // Incluir shift solo si fue proporcionado y no es undefined
//     ...(shift !== undefined && { shift: shift.trim() }),
//     workedHours: numWorkedHours,
//     priceHour: numPriceHour,
//   };

//   // Eliminar propiedades que eran undefined en el original para no pasarlas
//   // (aunque con la validación anterior, los campos requeridos ya deben estar)
//   Object.keys(req.body.sanitizedInput).forEach((key) => {
//     const k = key as keyof typeof req.body.sanitizedInput; // Type assertion
//     if (req.body.sanitizedInput[k] === undefined) {
//       delete req.body.sanitizedInput[k];
//     }
//   });

//   next();
// }

//CRUD

async function add(req: Request, res: Response) {
  try {
    const input = req.body.sanitizedInput;
    const employeeInput = await employeeService.createEmployee(input);
    res.status(201).json({ message: 'Employee created', data: employeeInput });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
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
