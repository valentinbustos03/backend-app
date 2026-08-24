import { ReservationStatus } from '../shared/enum/reservation.statusEnum.js';

export interface CreateReservationDto {
  dateTime: Date;
  numberOfPeople: number;
  status: ReservationStatus;
  client: string;
  table: string;
}

export interface ReservationIdDto {
  id: string;
}

export type UpdateReservationDto = CreateReservationDto;
