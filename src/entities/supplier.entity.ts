import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity() 
export class Supplier {
  @PrimaryKey({ nullable: false, unique: true}) 
  id!: number;

  @Property({ nullable: false }) 
  companyName!: string;

  @Property({ nullable: false })
  taxId!: string; //cuil/cuit

  @Property({ nullable: false })
  mail!: string;
  
  @Property({ nullable: false})
  phoneNumber!: string;

  @Property({ nullable: false }) 
  typeIngredient!: string;

  @Property({ nullable: false })
  fullName!: string;

  @Property({ nullable: false })
  bussinessName!: string;

}
