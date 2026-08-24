import {
  Entity,
  ManyToOne,
  PrimaryKeyProp,
  Property,
  Rel,
} from '@mikro-orm/core';
import { Dish } from './dish.entity.js';
import { Ingredient } from '../ingredient/ingredient.entity.js';

@Entity({ tableName: 'ingredient_dishes' })
export class DishIngredient {
  [PrimaryKeyProp]?: ['ingredient', 'dish'];

  @ManyToOne(() => Ingredient, { primary: true, eager: true })
  ingredient!: Rel<Ingredient>;

  @ManyToOne(() => Dish, { primary: true, hidden: true })
  dish!: Rel<Dish>;

  @Property({ nullable: false })
  quantity!: number;
}
