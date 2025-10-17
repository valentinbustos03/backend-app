import { Collection, Entity, OneToMany, Property } from "@mikro-orm/core";
import { Employee } from "../employee.entity.js";
import { EmployeeRole } from "../../shared/enum/employee.roleEnum.js";
import { Table } from "../../table/table.entity.js";
import { Order } from "../../order/order.entity.js";

@Entity({ discriminatorValue: EmployeeRole.WAITER })
export class Waiter extends Employee {
  @Property()
  calification!: number;

  @Property()
  sector!: string;

  @OneToMany(() => Order, (order) => order.waiter, {
    mappedBy: 'waiter',
  })
  orders = new Collection<Table>(this);

  toJSON() {
    return {
      ...super.toJSON(),
      role: EmployeeRole.WAITER,
      calification: this.calification,
      sector: this.sector,
    };
  }
}