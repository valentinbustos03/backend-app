import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity() 
export class Table {
  @PrimaryKey({ nullable: false, unique: true}) 
  cod!: string;

  @Property({ nullable: false }) 
  capacity!: number;

  @Property()
  description?: string;

  @Property({ nullable: false })
  occupied: boolean = false;

}
