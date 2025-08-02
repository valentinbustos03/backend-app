import {
  Collection,
  Entity,
  PrimaryKey,
  Property,
  ManyToMany,
} from '@mikro-orm/core';
import snowflake from 'snowflake-id';
import { Ingredient } from '../ingredient/ingredient.entity.js';

@Entity()
export class Supplier {
  @PrimaryKey({ nullable: false, unique: true })
  id: string = snowflake();

  @Property({ nullable: false })
  companyName!: string;

  @Property({ nullable: false, unique: true})
  taxId!: string; //cuil/cuit

  @Property({ nullable: false })
  mail!: string;

  @Property({ nullable: false })
  phoneNumber!: string;

  @Property({ nullable: false })
  typeIngredient!: string;

  @Property({ nullable: false })
  fullName!: string;

  @Property({ nullable: false })
  bussinessName!: string;

  @ManyToMany(() => Ingredient, undefined, {
    mappedBy: 'suppliers',
  })
  ingredients = new Collection<Ingredient>(this);
}
