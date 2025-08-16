import { Entity, Property } from '@mikro-orm/core';
import { Employee } from '../employee.entity.js';
import { EmployeeRole } from '../../shared/enum/employee.roleEnum.js';

@Entity({ discriminatorValue: EmployeeRole.CHEF })
export class Chef extends Employee {
  @Property()
  hierarchy!: string; //Chef de Cousine, Sous Chef, Chef de Partie, Commis, Plongeour

  @Property()
  tag!: string;
}
