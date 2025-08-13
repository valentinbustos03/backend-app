import { Entity, Property } from "@mikro-orm/core";
import { Employee } from "../employee.entity.js";

@Entity()
export class Waiter extends Employee{
  @Property()
  calification!: number;

  @Property()
  sector!: string;
  
}