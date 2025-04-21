export interface Repository<T> {
  findAll(): T[] | undefined
  findOne(item: { cod: string }): T | undefined
  add(item: T): T | undefined
  update(item: T): T | undefined
  delete(item: { cod: string }): T | undefined
}