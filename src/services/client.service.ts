//comportameientos de la entity client (CRUD+)
//import { Client } from '../entities/client.entity.js';
import { Client } from '../entities/client.entity.js';
import { EntityManager } from '@mikro-orm/core';
//import { Order } from '../entities/order.entity.js';

export class ClientService {
  private readonly em: EntityManager;

  constructor(em: EntityManager) {
    this.em = em;
  }

  async createClient(data: {
    dni: number;
    orderHistory: string;
    penalization: number;
  }): Promise<Client> {
    //crearClient - data = atributos
    const newClient = this.em.create(Client, data);
    await this.em.persistAndFlush(newClient);
    return newClient;
  } //newClient = nuevaClientnode -v

  async findAllClient(): Promise<Client[] | null> {
    const ClientList = this.em.findAll(Client);
    return ClientList;
  }

  async findClientByDni(dni: number): Promise<Client | null> {
    const client = this.em.findOne(Client, { dni });
    return client;
  }

  async updateClient(
    dni: number,
    data: {orderHistory: string; penalization: number; }
  ): Promise<Client | null> {
    const updatedClient = await this.em.findOne(Client, { dni });
    if (updatedClient) {
      this.em.assign(updatedClient, data);
      this.em.flush();
      return updatedClient;
    } else {
      return null;
    }
  }

  async deleteClient(dni: number): Promise<Client | null> {
    const deletedClient = await this.em.findOne(Client, { dni });
    if (deletedClient) {
      this.em.removeAndFlush(deletedClient);
      return deletedClient;
    } else {
      return null;
    }
  }
}
