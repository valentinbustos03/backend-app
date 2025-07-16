import {
  Property,
  PrimaryKey,
  Entity,
  ManyToMany,
  Collection,
  ManyToOne,
} from '@mikro-orm/core';
import snowflake from 'snowflake-id';
import { Ingredient } from '../ingredient/ingredient.entity.js';

@Entity()
export class Dish {
  @PrimaryKey({ nullable: false, unique: true })
  id: string = snowflake();

  @Property({ nullable: false, unique: true })
  cod!: string;

  @Property({ nullable: false, unique: true })
  name!: string;

  @Property({ unique: true })
  description?: string;

  @Property()
  picture?: string; //usar Cloudinary

  @Property({ nullable: false, type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Property()
  calification!: number;

  @ManyToMany(() => Ingredient, (ingredient) => ingredient.dishes, {
    eager: true,
  })
  ingredients = new Collection<Ingredient>(this);

  //@ManyToOne(()=> Chef { nullable: false})
  //createdBy: Chef;
}