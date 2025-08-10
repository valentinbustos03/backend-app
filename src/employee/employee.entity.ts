import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import generateId from '../shared/db/generate-id.js';

@Entity()
export class Employee {
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
}
