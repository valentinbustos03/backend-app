// test/reservation.service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReservationService, ReservationConflictError } from '../src/reservation/reservation.service.js';
import { ReservationStatus } from '../src/shared/enum/reservation.statusEnum.js';

describe('ReservationService.createReservation', () => {
  let em: any;
  let service: ReservationService;

  beforeEach(() => {
    em = {
      findOne: vi.fn().mockResolvedValue({ id: 't1', cod: 'T1', capacity: 4 }),
      count: vi.fn(),
      getReference: vi.fn((_entity, id) => ({ id })),
      persist: vi.fn().mockReturnThis(),
      flush: vi.fn().mockResolvedValue(undefined),
    };
    service = new ReservationService(em);
  });

  it('rechaza una reserva si supera la capacidad de la mesa', async () => {
    const data = {
      dateTime: new Date(),
      numberOfPeople: 6, // mesa tiene capacidad 4
      status: ReservationStatus.PENDIENTE,
      client: 'c1',
      table: 't1',
    } as any;

    await expect(service.createReservation(data)).rejects.toBeInstanceOf(ReservationConflictError);
  });
});