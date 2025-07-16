import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import snowflake from 'snowflake-id';

@Entity()
export class Table {
  @PrimaryKey({ nullable: false, unique: true })
  id: string = snowflake();

  @Property({ nullable: false, unique: true })
  cod!: string;

  @Property({ nullable: false })
  capacity!: number;

  @Property()
  description?: string;

  @Property({ nullable: false })
  occupied: boolean = false;
}
