import {
  Property,
  PrimaryKey,
  Entity,
  ManyToMany,
  Collection,
  ManyToOne,
} from '@mikro-orm/core';
import { Ingredient } from '../ingredient/ingredient.entity.js';
import generateId from '../shared/db/generate-id.js';

@Entity()
export class Dish {
  @PrimaryKey({ nullable: false, unique: true })
  id: string = generateId();

  @Property({ nullable: false, unique: true })
  cod!: string;

  @Property({ nullable: false, unique: true })
  name!: string;

  @Property({ unique: true })
  description?: string;

  @Property({ nullable: true })
  picture?: string; //usar Cloudinary

  @Property({ nullable: false, type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  calification?: number;

  @Property()
  tag!: string;

  @ManyToMany(() => Ingredient, (ingredient) => ingredient.dishes, {
    eager: true,
  })
  ingredients = new Collection<Ingredient>(this);

  //@ManyToOne(()=> Chef { nullable: false})
  //createdBy: Partial<Chef>;
}
