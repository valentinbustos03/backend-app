//creation of employee entity
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Employee {
  @PrimaryKey({ nullable: false, unique: true })
  taxId!: string;

  @Property({ nullable: false })
  companyName!: string;

  @Property({ nullable: false })
  shift?: string;

  @Property({ nullable: false })
  workedHours: number = 0;

  @Property({ nullable: false })
  priceHour: number = 0;

  @Property({ nullable: false })
  salary: number = 0;
}
