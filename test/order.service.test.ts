// test/order.service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderService } from '../src/order/order.service.js';
import { InsufficientStockError } from '../src/order/order.error.js';
import { OrderStatus } from '../src/shared/enum/order.statusEnum.js';

describe('OrderService.createOrder', () => {
  let em: any;
  let service: OrderService;

  beforeEach(() => {
    em = {
      getReference: vi.fn((_entity, id) => ({ id })),
      find: vi.fn().mockResolvedValue([
        {
          id: 'dish1',
          price: 10,
          ingredients: [
            { ingredient: { id: 'ing1', name: 'Tomate', stock: 2 }, quantity: 5 },
          ],
        },
      ]),
      findOne: vi.fn().mockResolvedValue({ id: 'exists' }), // client/table/waiter existen
      persist: vi.fn().mockReturnThis(),
      flush: vi.fn().mockResolvedValue(undefined),
    };
    service = new OrderService(em);
  });

  it('lanza InsufficientStockError si no alcanza el stock del ingrediente', async () => {
    const data = {
      description: 'Mesa 3',
      status: OrderStatus.PENDIENTE,
      estimatedEndTime: new Date(),
      endTime: new Date(),
      client: 'c1',
      table: 't1',
      waiter: 'w1',
      orderItems: [{ dish: 'dish1', quantity: 1 }], // requiere 5, hay 2
    } as any;

    await expect(service.createOrder(data)).rejects.toBeInstanceOf(InsufficientStockError);
  });
});