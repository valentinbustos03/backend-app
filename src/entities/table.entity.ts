//creation of table entity
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity() //Le dice al MIKRO ORM que "MESA" es una tabla en la base de datos.
export class Table {
  @PrimaryKey({ nullable: false, unique: true }) //indica que codigo es una llave primaria
  cod!: string;

  @Property({ nullable: false }) //Declara las columnas dentro de la base de datos.
  capacity!: number;

  @Property({ nullable: false })
  description?: string;

  @Property({ nullable: false })
  occupied: boolean = false;
}
