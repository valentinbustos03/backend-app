import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import generateId from '../shared/db/generate-id.js';
import { Dish } from '../dish/dish.entity.js';

@Entity()
export class Promotion {
  @PrimaryKey({ nullable: false, unique: true })
  id: string = generateId();

  @Property({ nullable: false, unique: true })
  cod!: string;

  @Property({ nullable: false })
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ nullable: false })
  discountPercentage!: number;

  @Property({ type: 'datetime', nullable: false })
  dateFrom!: Date;

  @Property({ type: 'datetime', nullable: false })
  dateTo!: Date;

  @Property({ nullable: false })
  active: boolean = true;

  @ManyToMany(() => Dish)
  dishes = new Collection<Dish>(this);
}
