// table.model.ts
export class Table {
  constructor(
    public cod: string,
    public capacity: number,
    public description?: string,
    public occupied: boolean = false
  ) {}
}
