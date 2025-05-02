//creation of table entity
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
//import{Order} from './order.entity.js';

@Entity() //Le dice al MIKRO ORM que "CLIENTE" es una tabla en la base de datos.
export class Client {
  @PrimaryKey({ nullable: false, unique: true }) //indica que codigo es una llave primaria
  dni!: number; //MODIFICAR EN EL GRAFICO

  @Property({ nullable: false }) //Declara las columnas dentro de la base de datos.
  orderHistory?: string;

  @Property({ nullable: false })
  penalization: number=0;
}
