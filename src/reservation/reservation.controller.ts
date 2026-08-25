import { Request, Response } from 'express';
import { orm } from '../shared/db/orm.js';
import {
  CreateReservationInput,
  ReservationIdSchema,
  ReservationSchema,
  UpdateReservationInput,
  UpdateReservationSchema,
} from './reservation.schema.js';
import {
  ReservationConflictError,
  ReservationService,
} from './reservation.service.js';

const reservationService = new ReservationService(orm.em);

async function add(req: Request, res: Response) {
  const reservationBody = await ReservationSchema.safeParseAsync(req.body);
  if (!reservationBody.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: reservationBody.error });
  }
  try {
    const reservationInput: CreateReservationInput = reservationBody.data;
    const reservation = await reservationService.createReservation(
      reservationInput
    );
    return res
      .status(201)
      .json({ message: 'Reservation created', data: reservation });
  } catch (error: any) {
    if (error instanceof ReservationConflictError) {
      return res.status(409).json({ message: error.message });
    }
    return res
      .status(500)
      .json({ message: 'Error creating reservation', error: error.message });
  }
}

async function findAll(req: Request, res: Response) {
  try {
    const reservationList = await reservationService.findAllReservations();
    const msg =
      (reservationList?.length ?? 0) === 0
        ? 'No reservations found'
        : 'Reservations found';
    return res.status(200).json({ message: msg, data: reservationList });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  const idInput = await ReservationIdSchema.safeParseAsync(req.params);
  if (!idInput.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: idInput.error });
  }

  try {
    const reservation = await reservationService.findReservationById(
      idInput.data
    );
    const msg = reservation === null ? 'No reservation found' : 'Reservation found';
    return res.status(200).json({ message: msg, data: reservation });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function update(req: Request, res: Response) {
  const idInput = await ReservationIdSchema.safeParseAsync(req.params);
  if (!idInput.success) {
    return res.status(400).json({
      message: 'Validation error',
      error: idInput.error,
    });
  }

  const reservationBody = await UpdateReservationSchema.safeParseAsync(
    req.body
  );
  if (!reservationBody.success) {
    return res.status(400).json({
      message: 'Validation error',
      error: reservationBody.error,
    });
  }

  try {
    const reservationInput: UpdateReservationInput = reservationBody.data;
    const reservation = await reservationService.updateReservation(
      idInput.data,
      reservationInput
    );
    return res.status(200).json({
      message: 'Reservation updated successfully',
      data: reservation,
    });
  } catch (error: any) {
    if (error instanceof ReservationConflictError) {
      return res.status(409).json({ message: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
}

async function remove(req: Request, res: Response) {
  const idInput = await ReservationIdSchema.safeParseAsync(req.params);
  if (!idInput.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: idInput.error });
  }
  try {
    const deleted = await reservationService.deleteReservation(idInput.data);
    if (!deleted) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    return res.status(200).json({
      message: 'Reservation deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export { add, findAll, findOne, update, remove };
