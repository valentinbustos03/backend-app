import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { Employee } from '../employee.entity.js';
import { EmployeeRole } from '../../shared/enum/employee.roleEnum.js';
import { Dish } from '../../dish/dish.entity.js';

@Entity({ discriminatorValue: EmployeeRole.CHEF })
export class Chef extends Employee {
  @Property()
  hierarchy!: string; //Chef de Cousine, Sous Chef, Chef de Partie, Commis, Plongeour

  @Property()
  tag!: string;

  @OneToMany(() => Dish, (dish) => dish.chef, {
    mappedBy: 'chef',
  })
  dishes = new Collection<Dish>(this);

  toJSON() {
    return {
      ...super.toJSON(),
      role: EmployeeRole.CHEF,
      hierarchy: this.hierarchy,
      tag: this.tag,
    };
  }
}
