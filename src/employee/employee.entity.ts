import { Entity, Enum, OneToOne, PrimaryKey, Property, Rel } from '@mikro-orm/core';
import generateId from '../shared/db/generate-id.js';
import { EmployeeRole } from '../shared/enum/employee.roleEnum.js';
import { User } from '../user/user.entity.js';

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

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  salary?: number;

  @OneToOne(() => User, (user) => user.employee)
  user?: Rel<User>;

  @Enum(() => EmployeeRole)
  role!: EmployeeRole;
}
