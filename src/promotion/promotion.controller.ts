import { Request, Response } from 'express';
import { orm } from '../shared/db/orm.js';
import {
  CreatePromotionInput,
  PromotionFilterSchema,
  PromotionIdSchema,
  PromotionSchema,
  UpdatePromotionInput,
  UpdatePromotionSchema,
} from './promotion.schema.js';
import {
  PromotionConflictError,
  PromotionService,
} from './promotion.service.js';

const promotionService = new PromotionService(orm.em);

async function add(req: Request, res: Response) {
  const promotionBody = await PromotionSchema.safeParseAsync(req.body);
  if (!promotionBody.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: promotionBody.error });
  }
  try {
    const promotionInput: CreatePromotionInput = promotionBody.data;
    const promotion = await promotionService.createPromotion(promotionInput);
    return res
      .status(201)
      .json({ message: 'Promotion created', data: promotion });
  } catch (error: any) {
    if (error instanceof PromotionConflictError) {
      return res.status(409).json({ message: error.message });
    }
    return res
      .status(500)
      .json({ message: 'Error creating promotion', error: error.message });
  }
}

async function findAll(req: Request, res: Response) {
  const filterInput = await PromotionFilterSchema.safeParseAsync(req.query);
  if (!filterInput.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: filterInput.error });
  }
  try {
    const promotionList = await promotionService.findAllPromotions(
      filterInput.data
    );
    const msg =
      (promotionList?.length ?? 0) === 0
        ? 'No promotions found'
        : 'Promotions found';
    return res.status(200).json({ message: msg, data: promotionList });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  const idInput = await PromotionIdSchema.safeParseAsync(req.params);
  if (!idInput.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: idInput.error });
  }

  try {
    const promotion = await promotionService.findPromotionById(idInput.data);
    const msg = promotion === null ? 'No promotion found' : 'Promotion found';
    return res.status(200).json({ message: msg, data: promotion });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function update(req: Request, res: Response) {
  const idInput = await PromotionIdSchema.safeParseAsync(req.params);
  if (!idInput.success) {
    return res.status(400).json({
      message: 'Validation error',
      error: idInput.error,
    });
  }

  const promotionBody = await UpdatePromotionSchema.safeParseAsync(req.body);
  if (!promotionBody.success) {
    return res.status(400).json({
      message: 'Validation error',
      error: promotionBody.error,
    });
  }

  try {
    const promotionInput: UpdatePromotionInput = promotionBody.data;
    const promotion = await promotionService.updatePromotion(
      idInput.data,
      promotionInput
    );
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    return res.status(200).json({
      message: 'Promotion updated successfully',
      data: promotion,
    });
  } catch (error: any) {
    if (error instanceof PromotionConflictError) {
      return res.status(409).json({ message: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
}

async function remove(req: Request, res: Response) {
  const idInput = await PromotionIdSchema.safeParseAsync(req.params);
  if (!idInput.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: idInput.error });
  }
  try {
    const deleted = await promotionService.deletePromotion(idInput.data);
    if (!deleted) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    return res.status(200).json({
      message: 'Promotion deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export { add, findAll, findOne, update, remove };
