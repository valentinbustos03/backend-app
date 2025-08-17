import { Entity, Property } from "@mikro-orm/core";
import { Employee } from "../employee.entity.js";
import { EmployeeRole } from "../../shared/enum/employee.roleEnum.js";

@Entity({discriminatorValue: EmployeeRole.WAITER})
export class Waiter extends Employee{
  @Property()
  calification!: number;

  @Property()
  sector!: string;
  
}