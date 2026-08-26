import { Employee } from '../employee/employee.entity.js';
import { EntityManager } from '@mikro-orm/core';
import {
  CreateEmployeeDto,
  EmployeeFilterDto,
  EmployeeIdDto,
  UpdateEmployeeDto,
} from '../employee/employee.dto.js';
import { EmployeeRole } from '../shared/enum/employee.roleEnum.js';
import { Chef } from './type/chef.entity.js';
import { WaiterSummaryDto } from './employee.dto.js';
import { Waiter } from './type/waiter.entity.js';

export class EmployeeService {
  private readonly em: EntityManager;

  constructor(em: EntityManager) {
    this.em = em;
  }

  async createEmployee(data: CreateEmployeeDto): Promise<Employee> {
    const newEmployee =
      data.role === EmployeeRole.CHEF
        ? this.em.create(Chef, data)
        : this.em.create(Waiter, data);
    newEmployee.salary = this.computeSalary(data.workedHours, data.priceHour);
    await this.em.persistAndFlush(newEmployee);
    return newEmployee;
  }

  async findWaiterSummaries(): Promise<WaiterSummaryDto[]> {
    const waiterList = await this.em.find(Waiter, {});
    return waiterList.map((waiter) => ({
      id: waiter.id,
      fullName: waiter.user?.fullName ?? null,
      profilePicture: waiter.user?.profilePicture ?? null,
    }));
  }

  async findAllEmployee(filter?: EmployeeFilterDto): Promise<Employee[] | null> {
    const baseWhere: Record<string, unknown> = {};
    if (filter?.shift) {
      baseWhere.shift = filter.shift;
    }

    const includeChef = !filter?.role || filter.role === EmployeeRole.CHEF;
    const includeWaiter = !filter?.role || filter.role === EmployeeRole.WAITER;

    // minCalification es un campo de Waiter, un Chef nunca lo cumple
    const chefList =
      includeChef && filter?.minCalification === undefined
        ? await this.em.find(Chef, baseWhere)
        : [];

    const waiterWhere: Record<string, unknown> = { ...baseWhere };
    if (filter?.minCalification !== undefined) {
      waiterWhere.calification = { $gte: filter.minCalification };
    }
    const waiterList = includeWaiter
      ? await this.em.find(Waiter, waiterWhere)
      : [];

    const employeeList = [...chefList, ...waiterList];
    return employeeList;
  }

  async findEmployeeByTaxId(taxId: string): Promise<Employee | null> {
    const employee = await this.em.findOne(Employee, { taxId });
    return employee;
  }

  async findEmployeeById(id: EmployeeIdDto): Promise<Employee | null> {
    const employee = await this.em.findOne(Employee, id);
    return employee;
  }

  async updateEmployee(
    id: EmployeeIdDto,
    data: UpdateEmployeeDto
  ): Promise<Employee | null> {
    console.log(id)
    const updatedEmployee = await this.em.findOne(Employee, id);
    if (updatedEmployee) {
      this.em.assign(updatedEmployee, data);
      updatedEmployee.salary = this.computeSalary(
        data.workedHours,
        data.priceHour
      );
      await this.em.flush();
      return updatedEmployee;
    } else {
      return null;
    }
  }

  async deleteEmployee(id: EmployeeIdDto): Promise<boolean> {
    const deletedEmployee = await this.em.findOne(Employee, id);
    if (deletedEmployee) {
      await this.em.removeAndFlush(deletedEmployee);
      return true;
    }
    return false;
  }

  private computeSalary(workedHours: number , priceHour: number): number {
    if (workedHours < 0 || priceHour < 0) {
      throw new Error('Invalid input for salary computation');
    }
    return Math.round(workedHours * priceHour * 100) / 100; // Redondear a 2 decimales
  }
}
