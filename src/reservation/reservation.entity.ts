import { Entity, Enum, ManyToOne, PrimaryKey, Property, Rel } from '@mikro-orm/core';
import generateId from '../shared/db/generate-id.js';
import { Client } from '../client/client.entity.js';
import { Table } from '../table/table.entity.js';
import { ReservationStatus } from '../shared/enum/reservation.statusEnum.js';

@Entity()
export class Reservation {
  @PrimaryKey({ nullable: false, unique: true })
  id: string = generateId();

  @Property({ type: 'datetime', nullable: false })
  dateTime!: Date;

  @Property({ nullable: false })
  numberOfPeople!: number;

  @Enum(() => ReservationStatus)
  status: ReservationStatus = ReservationStatus.PENDIENTE;

  @ManyToOne(() => Client, { eager: true })
  client!: Rel<Client>;

  @ManyToOne(() => Table, { eager: true })
  table!: Rel<Table>;
}
