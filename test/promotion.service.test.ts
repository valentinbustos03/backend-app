// test/promotion.service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PromotionService, PromotionConflictError } from '../src/promotion/promotion.service.js';

describe('PromotionService.createPromotion', () => {
  let em: any;
  let service: PromotionService;

  beforeEach(() => {
    em = {
      find: vi.fn().mockResolvedValue([{ id: 'd1' }]), // solo existe 1 de los 2 pedidos
      persist: vi.fn().mockReturnThis(),
      flush: vi.fn().mockResolvedValue(undefined),
    };
    service = new PromotionService(em);
  });

  it('lanza error si algún plato de la promoción no existe', async () => {
    const data = {
      cod: 'P1',
      name: '2x1 pastas',
      description: 'promo',
      discountPercentage: 50,
      dateFrom: new Date(),
      dateTo: new Date(),
      active: true,
      dishes: ['d1', 'd2-no-existe'],
    } as any;

    await expect(service.createPromotion(data)).rejects.toBeInstanceOf(PromotionConflictError);
  });
});