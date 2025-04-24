//comportameientos de la entity table (CRUD+)
import { Table } from "../entities/table.entity.js";
import { EntityManager } from "@mikro-orm/core";

export class TableService{
  private readonly em: EntityManager

  constructor(em: EntityManager) {
      this.em = em;
  }
  
  async createTable(data:{cod:string, capacity:number, description:string, occupied:boolean}): Promise<Table> //crearMesa - data = atributos
  {
    const newTable = this.em.create(Table, data);
    await this.em.persistAndFlush(newTable);
    return newTable
  } //newTable = nuevaMesa

  async findAllTable(): Promise<Table[] | null>
  {
    const tableList = this.em.findAll(Table);
    return tableList 
  }

  async findTableByCod(cod:string): Promise<Table | null>
  {
    const table = this.em.findOne(Table,{cod});
    return table 
  }

  async updateTable(cod: string, data:{capacity?:number, description?:string, occupied?:boolean}): Promise<Table | null>
  {
    const updatedTable = await this.em.findOne(Table, {cod});
    if(updatedTable){
      this.em.assign(updatedTable, data);
      this.em.flush();
      return updatedTable
    }else{
      return null
    }
  }

  async deleteTable(cod: string): Promise<Table | null>
  {
    const deletedTable = await this.em.findOne(Table, {cod});
    if(deletedTable){
      this.em.removeAndFlush(deletedTable);
      return deletedTable
    }else{
      return null
    }
  }

}
