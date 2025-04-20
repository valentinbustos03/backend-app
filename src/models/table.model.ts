class TableFactory {
  createTable(cod: string, capacity: number, description?: string, occupied: boolean = false): Table {
    return {
      cod,
      capacity,
      description,
      occupied,
    };
  }
}