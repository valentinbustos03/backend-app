import { EmployeeRole } from '../shared/enum/employee.roleEnum.js';

export interface BaseEmployeeDto {
  taxId: string;
  shift: string;
  workedHours: number;
  priceHour: number;
  role: EmployeeRole;
}

export interface CreateChefDto extends BaseEmployeeDto {
  role: EmployeeRole.CHEF;
  hierarchy: string;
  tag: string;
}

export interface CreateWaiterDto extends BaseEmployeeDto {
  role: EmployeeRole.WAITER;
  calification: number;
  sector: string;
}

export type CreateEmployeeDto = CreateChefDto | CreateWaiterDto;

export interface EmployeeIdDto {
  id: string;
}

export interface EmployeeFilterDto {
  shift?: string;
  role?: EmployeeRole;
  minCalification?: number;
}

// export type UpdateEmployeeDto = Partial<CreateChefDto> | Partial<CreateEmployeeDto> & {
//   workedHours: number;
//   priceHour: number;
// }

export type UpdateEmployeeDto = (
  | Omit<CreateChefDto, 'workedHours' | 'priceHour' >
  | Omit<CreateWaiterDto, 'workedHours' | 'priceHour'>
) & {
  workedHours: number;
  priceHour: number;
};
export interface WaiterSummaryDto {
  id: string;
  fullName: string | null;
  profilePicture: string | null;
}
