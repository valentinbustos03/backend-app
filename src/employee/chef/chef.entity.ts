import { Entity, Property } from "@mikro-orm/core";
import { Employee } from "../employee.entity.js";

@Entity()
export class Chef extends Employee {
  @Property({ default: 'Plongeour'})
  hierarchy!: string; //Chef de Cousine, Sous Chef, Chef de Partie, Commis, Plongeour

  @Property()
  tag!: string
}