import { Cascade, Entity, Enum, OneToOne, PrimaryKey, Property, Rel } from '@mikro-orm/core';
import generateId from '../shared/db/generate-id.js';
import { UserRole } from '../shared/enum/user.roleEnum.js';
import { Client } from '../client/client.entity.js';
import { Employee } from '../employee/employee.entity.js';

@Entity()
export class User {
  @PrimaryKey({ nullable: false, unique: true })
  id: string = generateId();

  @Property({ nullable: false, unique: true })
  email!: string;

  @Property({ nullable: false })
  fullName!: string;

  @Property({ nullable: false })
  password!: string;

  @Property({ nullable: false })
  phoneNumber!: string;

  @Enum(() => UserRole)
  role!: UserRole;

  @Property({ nullable: true })
  profilePicture?: string;

  @OneToOne(() => Client, (client) => client.user, {
    owner: true,
    eager: true,
    nullable: true,
    cascade: [Cascade.ALL],
  })
  client?: Rel<Client>;

  @OneToOne(() => Employee, employee => employee.user, {
    owner: true,
    eager: true,
    nullable: true,
    cascade: [Cascade.ALL],
  })
  employee?: Rel<Employee>;
}
