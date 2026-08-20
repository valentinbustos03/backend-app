import { Request, Response } from 'express';
import { orm } from '../shared/db/orm.js';
import {
  CreateOrderInput,
  OrderIdSchema,
  OrderSchema,
  UpdateOrderInput,
  UpdateOrderSchema,
} from './order.schema.js';
import { OrderService } from './order.service.js';
import { ClientIdSchema } from '../client/client.schema.js';

const orderService = new OrderService(orm.em);

async function add(req: Request, res: Response) {
  const orderBody = await OrderSchema.safeParseAsync(req.body);
  if (!orderBody.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: orderBody.error });
  }
  try {
    const orderInput: CreateOrderInput = orderBody.data;
    const order = await orderService.createOrder(orderInput);
    return res.status(201).json({ message: 'Order created', data: order });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: 'Error creating order', error: error.message });
  }
}

async function findAll(req: Request, res: Response) {
  try {
    const orderList = await orderService.findAllOrders();
    const msg =
      (orderList?.length ?? 0) === 0 ? 'No orders found' : 'Orders found';
    return res.status(200).json({ message: msg, data: orderList });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  const idInput = await OrderIdSchema.safeParseAsync(req.params);
  if (!idInput.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: idInput.error });
  }

  try {
    const order = await orderService.findOrderById(idInput.data);
    const msg = order === null ? 'No order found' : 'Order found';
    return res.status(200).json({ message: msg, data: order });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function update(req: Request, res: Response) {
  const idInput = await OrderIdSchema.safeParseAsync(req.params);
  if (!idInput.success) {
    return res.status(400).json({
      message: 'Validation error',
      error: idInput.error,
    });
  }

  const orderBody = await UpdateOrderSchema.safeParseAsync(req.body);
  if (!orderBody.success) {
    return res.status(400).json({
      message: 'Validation error',
      error: orderBody.error,
    });
  }

  try {
    const orderInput: UpdateOrderInput = orderBody.data;
    const order = await orderService.updateOrder(idInput.data, orderInput);
    return res.status(200).json({
      message: 'Order updated successfully',
      data: order,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function remove(req: Request, res: Response) {
  const idInput = await OrderIdSchema.safeParseAsync(req.params);
  if (!idInput.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: idInput.error });
  }
  try {
    const deleted = await orderService.deleteOrder(idInput.data);
    if (!deleted) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.status(200).json({
      message: 'Order deleted successfully'
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function findAllOrdersByClientId(req: Request, res: Response) {
  const clientIdInput = await ClientIdSchema.safeParseAsync(req.params);
  if (!clientIdInput.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: clientIdInput.error });
  }
  try {
    const orderList = await orderService.findOrdersByClientId(
      clientIdInput.data
    );
    const msg =
      (orderList?.length ?? 0) === 0 ? 'No orders found' : 'Orders found';

    return res.status(200).json({ message: msg, data: orderList });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export { add, findAll, findOne, update, remove, findAllOrdersByClientId };
