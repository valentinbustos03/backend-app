//comportameientos de la entity table (CRUD+)
import { Employee } from '../entities/employee.entity.js';
import { EntityManager } from '@mikro-orm/core';

export class EmployeeService {
  private readonly em: EntityManager;

  constructor(em: EntityManager) {
    this.em = em;
  }

  async createEmployee(data: {
    taxId: string;
    companyName: string;
    shift: string;
    workedHours: number;
    priceHour: number;
    salary: number;
  }): Promise<Employee> {
    const newEmployee = this.em.create(Employee, data);
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

  async updateEmployee(
    taxId: string,
    data: {
      companyName: string;
      shift: string;
      workedHours: number;
      priceHour: number;
      salary: number;
    }
  ): Promise<Employee | null> {
    const updatedEmployee = await this.em.findOne(Employee, { taxId });
    if (updatedEmployee) {
      this.em.assign(updatedEmployee, data);
      this.em.flush();
      return updatedEmployee;
    } else {
      return null;
    }
  }

  async deleteEmployee(taxId: string): Promise<Employee | null> {
    const deletedEmployee = await this.em.findOne(Employee, { taxId });
    if (deletedEmployee) {
      this.em.removeAndFlush(deletedEmployee);
      return deletedEmployee;
    } else {
      return null;
    }
  }
}
