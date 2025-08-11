export interface CreateEmployeeDto{
  taxId: string;
  shift: string;
  workedHours: number;
  priceHour: number;
}

export interface EmployeeIdDto{
  id: string;
}

export interface UpdateEmployeeDto extends Partial<CreateEmployeeDto> {
  workedHours: number;
  priceHour: number;
}
