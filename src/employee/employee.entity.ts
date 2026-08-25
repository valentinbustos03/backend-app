import {
  Entity,
  Enum,
  OneToOne,
  PrimaryKey,
  Property,
  Rel,
} from '@mikro-orm/core';
import generateId from '../shared/db/generate-id.js';
import { EmployeeRole } from '../shared/enum/employee.roleEnum.js';
import { User } from '../user/user.entity.js';
import { Waiter } from './type/waiter.entity.js';
import { Chef } from './type/chef.entity.js';

@Entity({ discriminatorColumn: 'role', abstract: true })
export abstract class Employee {
  @PrimaryKey({ nullable: false, unique: true })
  id: string = generateId();

  @Property({ nullable: false, unique: true })
  taxId!: string;

  @Property({ nullable: false })
  shift!: string;

  @Property({ nullable: false, type: 'decimal', precision: 10, scale: 2 })
  workedHours!: number;

  @Property({ nullable: false, type: 'decimal', precision: 10, scale: 2 })
  priceHour!: number;

  @Property({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salary?: number;

  @OneToOne(() => User, (user) => user.employee, {
    eager: true,
  })
  user?: Rel<User>;

  @Enum(() => EmployeeRole)
  role!: EmployeeRole;

  toJSON() {
    return {
      id: this.id,
      taxId: this.taxId,
      shift: this.shift,
      workedHours: this.workedHours,
      priceHour: this.priceHour,
      salary: this.salary,
      role: this.role,
      user: this.user
        ? {
            id: this.user.id,
            email: this.user.email,
            fullName: this.user.fullName,
            phoneNumber: this.user.phoneNumber,
            role: this.user.role,
            profilePicture: this.user.profilePicture,
          }
        : null,
    };
  }
}
