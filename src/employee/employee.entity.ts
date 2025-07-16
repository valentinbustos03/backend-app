import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import snowflake from 'snowflake-id';

@Entity()
export class Employee {
  @PrimaryKey({ nullable: false, unique: true })
  id: string = snowflake();

  @Property({ nullable: false, unique: true })
  taxId!: string;

  @Property({ nullable: false })
  companyName!: string;

  @Property({ nullable: false })
  shift?: string;

  @Property({ nullable: false, type: 'decimal', precision: 10, scale: 2 })
  workedHours!: number;

  @Property({ nullable: false, type: 'decimal', precision: 10, scale: 2 })
  priceHour!: number;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  salary?: number;
}
