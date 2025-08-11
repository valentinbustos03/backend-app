import { Client } from '../client/client.entity.js';
import { EntityManager } from '@mikro-orm/core';
import { ClientIdDto, CreateClientDto, UpdateClientDto } from './client.dto.js';
import { Order } from '../order/order.entity.js';

export class ClientService {
  private readonly em: EntityManager;

  constructor(em: EntityManager) {
    this.em = em;
  }

  async createClient(data: CreateClientDto): Promise<Client> {
    const newClient = this.em.create(Client, data);
    await this.em.persistAndFlush(newClient);
    return newClient;
  }

  async findAllClient(): Promise<Client[] | null> {
    const ClientList = this.em.findAll(Client);
    return ClientList;
  }

  async findClientByDni(dni: number): Promise<Client | null> {
    const client = this.em.findOne(Client, { dni });
    return client;
  }

  async findClientById(id: ClientIdDto): Promise<Client | null> {
    const client = this.em.findOne(Client, id);
    return client;
  }

  async updateClient(
    id: ClientIdDto,
    data: UpdateClientDto
  ): Promise<Client | null> {
    const updatedClient = await this.em.findOne(Client, id);
    if (updatedClient) {
      this.em.assign(updatedClient, data);
      await this.em.flush();
      return updatedClient;
    } else {
      return null;
    }
  }

  async deleteClient(id: ClientIdDto): Promise<boolean> {
    const deletedClient = await this.em.findOne(Client, id);
    if (deletedClient) {
      await this.em.removeAndFlush(deletedClient);
      return true; 
    }
    return false; 
  }

}
