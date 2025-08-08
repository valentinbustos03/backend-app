import { Employee } from '../employee/employee.entity.js';
import { EntityManager } from '@mikro-orm/core';
import {
  CreateEmployeeDto,
  EmployeeIdDto,
  UpdateEmployeeDto,
} from '../employee/employee.dto.js';

export class EmployeeService {
  private readonly em: EntityManager;

  constructor(em: EntityManager) {
    this.em = em;
  }

  async createEmployee(data: CreateEmployeeDto): Promise<Employee> {
    const newEmployee = this.em.create(Employee, data);
    newEmployee.salary = this.computeSalary(data.workedHours, data.priceHour);
    await this.em.persistAndFlush(newEmployee);
    return newEmployee;
  }

  async findAllEmployee(): Promise<Employee[] | null> {
    const employeeList = this.em.findAll(Employee);
    return employeeList;
  }

  async findEmployeeByTaxId(taxId: string): Promise<Employee | null> {
    const employee = this.em.findOne(Employee, { taxId });
    return employee;
  }

  async findEmployeeById(id: EmployeeIdDto): Promise<Employee | null> {
    const employee = this.em.findOne(Employee, id);
    return employee;
  }

  async updateEmployee(
    id: EmployeeIdDto,
    data: UpdateEmployeeDto
  ): Promise<Employee | null> {
    const updatedEmployee = await this.em.findOne(Employee, id);
    if (updatedEmployee) {
      this.em.assign(updatedEmployee, data);
      updatedEmployee.salary = this.computeSalary(
        data.workedHours,
        data.priceHour
      );
      this.em.flush();
      return updatedEmployee;
    } else {
      return null;
    }
  }

  async deleteEmployee(id: EmployeeIdDto) {
    const deletedEmployee = await this.em.findOne(Employee, id);
    if (deletedEmployee) {
      this.em.removeAndFlush(deletedEmployee);
    }
  }

  private computeSalary(workedHours: number, priceHour: number): number {
    if (workedHours < 0 || priceHour < 0) {
      throw new Error('Invalid input for salary computation');
    }
    return Math.round(workedHours * priceHour * 100) / 100; // Redondear a 2 decimales
  }
}
