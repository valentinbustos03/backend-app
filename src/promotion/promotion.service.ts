import { EntityManager } from '@mikro-orm/mysql';
import { Promotion } from './promotion.entity.js';
import { Dish } from '../dish/dish.entity.js';
import {
  CreatePromotionDto,
  PromotionFilterDto,
  PromotionIdDto,
  UpdatePromotionDto,
} from './promotion.dto.js';

export class PromotionConflictError extends Error {}

export class PromotionService {
  private readonly em: EntityManager;

  constructor(em: EntityManager) {
    this.em = em;
  }

  async createPromotion(data: CreatePromotionDto): Promise<Promotion> {
    const dishes = await this.resolveDishes(data.dishes);

    const newPromotion = new Promotion();
    newPromotion.cod = data.cod;
    newPromotion.name = data.name;
    newPromotion.description = data.description;
    newPromotion.discountPercentage = data.discountPercentage;
    newPromotion.dateFrom = data.dateFrom;
    newPromotion.dateTo = data.dateTo;
    newPromotion.active = data.active;
    newPromotion.dishes.set(dishes);

    await this.em.persist(newPromotion).flush();

    return newPromotion;
  }

  async findAllPromotions(
    filter?: PromotionFilterDto
  ): Promise<Promotion[] | null> {
    if (filter?.current) {
      const now = new Date();
      return this.em.find(
        Promotion,
        {
          active: true,
          dateFrom: { $lte: now },
          dateTo: { $gte: now },
        },
        { populate: ['dishes'] }
      );
    }

    return this.em.findAll(Promotion, { populate: ['dishes'] });
  }

  async findPromotionById(id: PromotionIdDto): Promise<Promotion | null> {
    const promotion = this.em.findOne(Promotion, id, {
      populate: ['dishes'],
    });
    return promotion;
  }

  async updatePromotion(
    id: PromotionIdDto,
    data: UpdatePromotionDto
  ): Promise<Promotion | null> {
    const updatedPromotion = await this.em.findOne(Promotion, id, {
      populate: ['dishes'],
    });
    if (!updatedPromotion) {
      return null;
    }

    const dishes = await this.resolveDishes(data.dishes);
    updatedPromotion.dishes.set(dishes);

    const { dishes: _ignored, ...rest } = data;
    this.em.assign(updatedPromotion, rest);

    await this.em.flush();

    return updatedPromotion;
  }

  async deletePromotion(id: PromotionIdDto): Promise<boolean> {
    const deletedPromotion = await this.em.findOne(Promotion, id);
    if (!deletedPromotion) {
      return false;
    }

    await this.em.removeAndFlush(deletedPromotion);
    return true;
  }

  private async resolveDishes(dishIds: string[]): Promise<Dish[]> {
    const dishes = await this.em.find(Dish, { id: { $in: dishIds } });

    if (dishes.length !== new Set(dishIds).size) {
      throw new PromotionConflictError('One or more dishes do not exist');
    }

    return dishes;
  }
}
