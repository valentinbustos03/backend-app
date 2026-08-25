import { EntityManager } from '@mikro-orm/mysql';
import { FilterQuery } from '@mikro-orm/core';
import {
  CreateReservationDto,
  ReservationIdDto,
  UpdateReservationDto,
} from './reservation.dto.js';
import { Reservation } from './reservation.entity.js';
import { Client } from '../client/client.entity.js';
import { Table } from '../table/table.entity.js';
import { ReservationStatus } from '../shared/enum/reservation.statusEnum.js';

// Margen a ambos lados del horario pedido: dos reservas confirmadas en la misma
// mesa dentro de esta ventana se consideran superpuestas.
const RESERVATION_WINDOW_HOURS = 2;

export class ReservationConflictError extends Error {}

export class ReservationService {
  private readonly em: EntityManager;

  constructor(em: EntityManager) {
    this.em = em;
  }

  async createReservation(data: CreateReservationDto): Promise<Reservation> {
    await this.assertReservationIsValid(data);

    const newReservation = new Reservation();
    newReservation.dateTime = data.dateTime;
    newReservation.numberOfPeople = data.numberOfPeople;
    newReservation.status = data.status;
    newReservation.client = this.em.getReference(Client, data.client);
    newReservation.table = this.em.getReference(Table, data.table);

    await this.em.persist(newReservation).flush();

    await this.syncTableOccupancy(data.table);

    return newReservation;
  }

  async findAllReservations(): Promise<Reservation[] | null> {
    const reservationList = this.em.findAll(Reservation);
    return reservationList;
  }

  async findReservationById(id: ReservationIdDto): Promise<Reservation | null> {
    const reservation = this.em.findOne(Reservation, id);
    return reservation;
  }

  async updateReservation(
    id: ReservationIdDto,
    data: UpdateReservationDto
  ): Promise<Reservation | null> {
    const updatedReservation = await this.em.findOne(Reservation, id);
    if (!updatedReservation) {
      return null;
    }

    await this.assertReservationIsValid(data, updatedReservation.id);

    // Hay que leerla antes del assign: despues del assign ya es la mesa nueva
    // y la vieja quedaria ocupada para siempre.
    const previousTableId = updatedReservation.table.id;

    this.em.assign(updatedReservation, data);
    await this.em.flush();

    await this.syncTableOccupancy(previousTableId);
    if (updatedReservation.table.id !== previousTableId) {
      await this.syncTableOccupancy(updatedReservation.table.id);
    }

    return updatedReservation;
  }

  async deleteReservation(id: ReservationIdDto): Promise<boolean> {
    const deletedReservation = await this.em.findOne(Reservation, id);
    if (!deletedReservation) {
      return false;
    }

    const tableId = deletedReservation.table.id;
    await this.em.removeAndFlush(deletedReservation);

    await this.syncTableOccupancy(tableId);

    return true;
  }

  // occupied no se asigna, se recalcula: una mesa esta ocupada si y solo si le
  // queda alguna reserva confirmada. Se llama siempre despues del flush.
  private async syncTableOccupancy(tableId: string): Promise<void> {
    const table = await this.em.findOne(Table, tableId);
    if (!table) {
      return;
    }

    const confirmedCount = await this.em.count(Reservation, {
      table: tableId,
      status: ReservationStatus.CONFIRMADA,
    });

    table.occupied = confirmedCount > 0;
    await this.em.flush();
  }

  private async assertReservationIsValid(
    data: CreateReservationDto,
    excludedReservationId?: string
  ): Promise<void> {
    const table = await this.em.findOne(Table, data.table);
    if (!table) {
      throw new ReservationConflictError('Table not found');
    }

    if (data.numberOfPeople > table.capacity) {
      throw new ReservationConflictError(
        `Table ${table.cod} seats ${table.capacity} people, ${data.numberOfPeople} requested`
      );
    }

    // Dos reservas pendientes sobre la misma mesa conviven: recien al
    // confirmarlas (que es un update, y revalida) hay conflicto real.
    if (data.status !== ReservationStatus.CONFIRMADA) {
      return;
    }

    const windowMs = RESERVATION_WINDOW_HOURS * 60 * 60 * 1000;
    const where: FilterQuery<Reservation> = {
      table: data.table,
      status: ReservationStatus.CONFIRMADA,
      dateTime: {
        $gte: new Date(data.dateTime.getTime() - windowMs),
        $lte: new Date(data.dateTime.getTime() + windowMs),
      },
    };

    if (excludedReservationId) {
      where.id = { $ne: excludedReservationId };
    }

    const overlapping = await this.em.count(Reservation, where);
    if (overlapping > 0) {
      throw new ReservationConflictError(
        `Table ${table.cod} already has a confirmed reservation within ${RESERVATION_WINDOW_HOURS} hours of that time`
      );
    }
  }
}
