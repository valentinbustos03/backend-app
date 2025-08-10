import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Supplier } from '../supplier/supplier.entity.js';
import { Dish } from '../dish/dish.entity.js';
import generateId from '../shared/db/generate-id.js';

@Entity()
export class Ingredient {
  @PrimaryKey({ nullable: false, unique: true })
  id: string = generateId();

  @Property({ nullable: false, unique: true })
  cod!: string;

  @Property({ nullable: false })
  name!: string;

  @Property()
  description?: string;

  @Property({ nullable: false })
  stock!: number;

  @Property({ nullable: false })
  uniteOfMeasure!: string;

  @Property({ nullable: false })
  origin!: string;

  @Property({ nullable: false })
  stockLimit!: number;

  @ManyToMany(() => Supplier, (supplier) => supplier.ingredients, {
    cascade: [Cascade.PERSIST],
  })
  suppliers = new Collection<Supplier>(this);

  @ManyToMany(() => Dish, undefined,{
    mappedBy: 'ingredients',
  })
  dishes = new Collection<Dish>(this);
}
