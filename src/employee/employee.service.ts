import { Employee } from '../employee/employee.entity.js';
import { EntityManager} from '@mikro-orm/core';

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
  }): Promise<Employee> {
    const newEmployee = this.em.create(Employee, data);
    newEmployee.salary = this.computeSalary(data.workedHours,data.priceHour)
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
    }
  ): Promise<Employee | null> {
    const updatedEmployee = await this.em.findOne(Employee, { taxId });
    if (updatedEmployee) {
      this.em.assign(updatedEmployee, data);
      updatedEmployee.salary = this.computeSalary(data.workedHours,data.priceHour)
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

    private computeSalary(workedHours: number, priceHour: number): number {
      if (workedHours < 0 || priceHour < 0) {
          throw new Error('Invalid input for salary computation');
      }
      return Math.round((workedHours * priceHour) * 100) / 100; // Redondear a 2 decimales
  }
}
