import { Client } from '../client/client.entity.js';
import { Collection, EntityManager, Reference, wrap } from '@mikro-orm/core';
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
    const client = this.em.findOne(Client,  {dni} );
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

        if (data.orderHistory) {
          const orders = await this.em.find(Order, {
            orderId: { $in: data.orderHistory },
          });
          updatedClient.orderHistory.set(orders);
        }

      this.em.assign(updatedClient, {
        dni: data.dni,
        penalty: data.penalty,
      });
      this.em.flush();
      return updatedClient;
    } else {
      return null;
    }
  }

  async deleteClient(id: ClientIdDto){
    const deletedClient = await this.em.findOne(Client, id);
    if (deletedClient) {
      this.em.removeAndFlush(deletedClient);
    }
  }

  // addOrderToClient - crear metodo para cargar una orden a un nuevo cliente. Considerar hacer dentro de order.service -> createOrder()
}
