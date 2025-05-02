import { Table } from '../models/table.model.js';
import { Repository } from '../shared/repository.js';


//Table Array Example
const tables: Table[] = [
  new Table(
    'M01',
    4,
    'View to Fontana Di Trevi',
    true
  ),
]

//CRUD
export class TableRepository implements Repository<Table> {
  public findAll(): Table[] | undefined {
    return tables
  }

  public findOne(item: { cod: string }): Table | undefined {
    return tables.find((table) => table.cod === item.cod)
  }

  public add(item: Table): Table | undefined {
    tables.push(item)
    return item
  }

  public update(item: Table): Table | undefined {
    const tableIdx = tables.findIndex((table) => table.cod === item.cod)

    if (tableIdx !== -1) {
      tables[tableIdx] = { ...tables[tableIdx], ...item }
    }
    return tables[tableIdx]
  }

  public delete(item: { cod: string }): Table | undefined {
    const tableIdx = tables.findIndex((table) => table.cod === item.cod)

    if (tableIdx !== -1) {
      const deletedTables = tables[tableIdx]
      tables.splice(tableIdx, 1)
      return deletedTables
    }
  }
}