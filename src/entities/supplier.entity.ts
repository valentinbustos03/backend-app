//creation of table entity
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity() //Le dice al MIKRO ORM que "Supplier" es una tabla en la base de datos.
export class Supplier {
  @PrimaryKey({ nullable: false, unique: true}) //indica que codigo es una llave primaria
  id!: number;

  @Property({ nullable: false }) //Declara las columnas dentro de la base de datos.
  companyName!: string;

  @Property({ nullable: false })
  taxId!: string; //cuil/cuit

  @Property({ nullable: false })
  mail!: string;
  
  @Property({ nullable: false}) //indica que codigo es una llave primaria
  phoneNumber!: string;

  @Property({ nullable: false }) //Declara las columnas dentro de la base de datos.
  typeIngredient!: string;

  @Property({ nullable: false })
  name!: string;

  @Property({ nullable: false })
  bussinessName!: string;

}
