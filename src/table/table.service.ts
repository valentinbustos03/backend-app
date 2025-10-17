import { EntityManager } from '@mikro-orm/core';
import { Table } from '../table/table.entity.js';
import { CreateTableDto, TableIdDto, UpdateTableDto } from './table.dto.js';

export class TableService {
  private readonly em: EntityManager;

  constructor(em: EntityManager) {
    this.em = em;
  }

  async createTable(data: CreateTableDto): Promise<Table> {
    const newTable = this.em.create(Table, data);
    await this.em.persistAndFlush(newTable);
    return newTable;
  }

  async findAllTable(): Promise<Table[] | null> {
    const tableList = await this.em.findAll(Table);
    return tableList;
  }

  async findTableByCod(cod: string): Promise<Table | null> {
    const table = await this.em.findOne(Table, { cod });
    return table;
  }

  async findTableById(id: TableIdDto): Promise<Table | null> {
    const table = await this.em.findOne(Table, id);
    return table;
  }

  async updateTable(
    id: TableIdDto,
    data: UpdateTableDto
  ): Promise<Table | null> {
    const updatedTable = await this.em.findOne(Table, id);
    if (updatedTable) {
      this.em.assign(updatedTable, data);
      await this.em.flush();
      return updatedTable;
    } else {
      return null;
    }
  }

  async deleteTable(id: TableIdDto): Promise<boolean> {
    const deletedTable = await this.em.findOne(Table, id);
    if (deletedTable) {
      await this.em.removeAndFlush(deletedTable);
      return true;
    }
    return false;
  }
}
