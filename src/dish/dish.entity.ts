import {
  Property,
  PrimaryKey,
  Entity,
  OneToMany,
  Collection,
  ManyToOne,
  Cascade,
  Rel,
} from '@mikro-orm/core';
import { DishIngredient } from './dishIngredient.entity.js';
import generateId from '../shared/db/generate-id.js';
import { Chef } from '../employee/type/chef.entity.js';

@Entity()
export class Dish {
  @PrimaryKey({ nullable: false, unique: true })
  id: string = generateId();

  @Property({ nullable: false, unique: true })
  cod!: string;

  @Property({ nullable: false, unique: true })
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ nullable: true })
  picture?: string; //usar Cloudinary

  @Property({ nullable: false, type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  calification?: number;

  @Property()
  tag!: string;

  @OneToMany(() => DishIngredient, (dishIngredient) => dishIngredient.dish, {
    eager: true,
    cascade: [Cascade.ALL],
    orphanRemoval: true,
  })
  ingredients = new Collection<DishIngredient>(this);

  @ManyToOne(() => Chef, { eager: true })
  chef!: Rel<Chef>;
}
