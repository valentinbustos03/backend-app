import { Request, Response } from 'express';
import { orm } from '../shared/db/orm.js';
import { PaymentService } from './payment.service.js';
import {
  InternalPaymentSchema,
  OrderIdParamSchema,
  PaymentIdSchema,
  WebhookSchema,
} from './payment.schema.js';
import {
  GatewayError,
  OrderAlreadyPaidError,
  OrderNotFoundError,
  OrderNotPayableError,
  PaymentNotFoundError,
  PaymentNotSyncableError,
} from './payment.error.js';

const paymentService = new PaymentService(orm.em);

function handleError(error: any, res: Response, fallback: string) {
  if (error instanceof OrderNotFoundError) {
    return res
      .status(404)
      .json({ message: error.message, data: { orderId: error.orderId } });
  }
  if (error instanceof OrderNotPayableError) {
    return res.status(409).json({
      message: error.message,
      data: { orderId: error.orderId, status: error.status },
    });
  }
  if (error instanceof OrderAlreadyPaidError) {
    return res.status(409).json({
      message: error.message,
      data: { orderId: error.orderId, billId: error.billId },
    });
  }
  if (error instanceof PaymentNotFoundError) {
    return res
      .status(404)
      .json({ message: error.message, data: { paymentId: error.paymentId } });
  }
  if (error instanceof PaymentNotSyncableError) {
    return res
      .status(409)
      .json({ message: error.message, data: { paymentId: error.paymentId } });
  }
  if (error instanceof GatewayError) {
    return res
      .status(502)
      .json({ message: error.message, data: { detail: error.detail } });
  }
  return res.status(500).json({ message: fallback, error: error.message });
}

async function checkout(req: Request, res: Response) {
  const params = await OrderIdParamSchema.safeParseAsync(req.params);
  if (!params.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: params.error });
  }
  try {
    const result = await paymentService.startCheckout(params.data.orderId);
    return res.status(201).json({ message: 'Checkout created', data: result });
  } catch (error: any) {
    return handleError(error, res, 'Error creating checkout');
  }
}

async function internal(req: Request, res: Response) {
  const params = await OrderIdParamSchema.safeParseAsync(req.params);
  if (!params.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: params.error });
  }
  const body = await InternalPaymentSchema.safeParseAsync(req.body);
  if (!body.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: body.error });
  }
  try {
    const result = await paymentService.registerInternal({
      orderId: params.data.orderId,
      method: body.data.method,
    });
    return res
      .status(201)
      .json({ message: 'Payment registered', data: result });
  } catch (error: any) {
    return handleError(error, res, 'Error registering payment');
  }
}

async function webhook(req: Request, res: Response) {
  const body = WebhookSchema.safeParse(req.body);
  if (body.success) {
    await paymentService.handleWebhook(body.data);
  }
  return res.status(200).json({ message: 'Notification received' });
}

async function sync(req: Request, res: Response) {
  const params = await PaymentIdSchema.safeParseAsync(req.params);
  if (!params.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: params.error });
  }
  try {
    const result = await paymentService.syncPayment(params.data.paymentId);
    return res.status(200).json({ message: 'Payment synced', data: result });
  } catch (error: any) {
    return handleError(error, res, 'Error syncing payment');
  }
}

async function findByOrder(req: Request, res: Response) {
  const params = await OrderIdParamSchema.safeParseAsync(req.params);
  if (!params.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: params.error });
  }
  try {
    const paymentList = await paymentService.findPaymentsByOrder(
      params.data.orderId
    );
    const msg = paymentList.length === 0 ? 'No payments found' : 'Payments found';
    return res.status(200).json({ message: msg, data: paymentList });
  } catch (error: any) {
    return handleError(error, res, 'Error finding payments');
  }
}

async function findOne(req: Request, res: Response) {
  const params = await PaymentIdSchema.safeParseAsync(req.params);
  if (!params.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: params.error });
  }
  try {
    const payment = await paymentService.findPaymentById(params.data.paymentId);
    const msg = payment === null ? 'No payment found' : 'Payment found';
    return res.status(200).json({ message: msg, data: payment });
  } catch (error: any) {
    return handleError(error, res, 'Error finding payment');
  }
}

export { checkout, internal, webhook, sync, findByOrder, findOne };
