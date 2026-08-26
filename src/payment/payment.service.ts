import { EntityManager } from '@mikro-orm/mysql';
import { Bill } from '../order/bill/bill.entity.js';
import { Order } from '../order/order.entity.js';
import { PaymentMethod } from '../shared/enum/payment.methodEnum.js';
import { PaymentProvider } from '../shared/enum/payment.providerEnum.js';
import { PaymentStatus } from '../shared/enum/payment.statusEnum.js';
import { OrderStatus } from '../shared/enum/order.statusEnum.js';
import {
  CheckoutResultDto,
  InternalPaymentResultDto,
  RegisterInternalDto,
  SyncResultDto,
} from './payment.dto.js';
import { Payment } from './payment.entity.js';
import {
  GatewayError,
  OrderAlreadyPaidError,
  OrderNotFoundError,
  OrderNotPayableError,
  PaymentNotFoundError,
  PaymentNotSyncableError,
} from './payment.error.js';
import { WebhookInput } from './payment.schema.js';
import {
  createPreference,
  fetchPayment,
  findPaymentByReference,
  isConfigured,
  RemotePayment,
} from './mercadopago.client.js';

export class PaymentService {
  private static readonly REMOTE_STATUS: Record<string, PaymentStatus> = {
    pending: PaymentStatus.PENDING,
    in_process: PaymentStatus.IN_PROCESS,
    in_mediation: PaymentStatus.IN_PROCESS,
    authorized: PaymentStatus.IN_PROCESS,
    approved: PaymentStatus.APPROVED,
    rejected: PaymentStatus.REJECTED,
    cancelled: PaymentStatus.CANCELLED,
    refunded: PaymentStatus.REFUNDED,
    charged_back: PaymentStatus.REFUNDED,
  };

  private readonly em: EntityManager;

  constructor(em: EntityManager) {
    this.em = em;
  }

  async startCheckout(orderId: string): Promise<CheckoutResultDto> {
    const order = await this.assertPayable(orderId);

    if (!isConfigured()) {
      throw new GatewayError('Falta configurar MP_ACCESS_TOKEN');
    }

    const payment = new Payment();
    payment.order = order;
    payment.provider = PaymentProvider.MERCADO_PAGO;
    payment.method = PaymentMethod.MERCADO_PAGO;
    payment.status = PaymentStatus.PENDING;
    payment.amount = Number(order.subtotal);

    let preference;
    try {
      preference = await createPreference({
        paymentId: payment.paymentId,
        orderId: order.orderId,
        amount: payment.amount,
        description: `Pedido ${order.orderId}`,
      });
    } catch (error: any) {
      throw new GatewayError(error?.message ?? 'Error desconocido');
    }

    payment.preferenceId = preference.preferenceId;
    await this.em.persist(payment).flush();

    return {
      paymentId: payment.paymentId,
      preferenceId: preference.preferenceId,
      initPoint: preference.initPoint,
      amount: payment.amount,
      status: payment.status,
    };
  }

  async registerInternal(
    data: RegisterInternalDto
  ): Promise<InternalPaymentResultDto> {
    const order = await this.assertPayable(data.orderId);

    const payment = new Payment();
    payment.order = order;
    payment.provider = PaymentProvider.INTERNO;
    payment.method = data.method;
    payment.status = PaymentStatus.APPROVED;
    payment.amount = Number(order.subtotal);

    const bill = this.buildBill(order, payment.method);

    await this.em.persist([payment, bill]).flush();

    return { payment, bill };
  }

  async handleWebhook(body: WebhookInput): Promise<void> {
    const externalId = body?.data?.id;
    if (externalId === undefined || externalId === null) {
      return;
    }
    if (!isConfigured()) {
      return;
    }

    try {
      const remote = await fetchPayment(String(externalId));
      if (!remote) {
        return;
      }
      const payment = await this.em.findOne(Payment, {
        paymentId: remote.externalReference,
      });
      if (!payment) {
        return;
      }
      await this.reconcile(payment, remote);
    } catch (error: any) {
      console.error('Error procesando el webhook de Mercado Pago:', error?.message);
    }
  }

  async syncPayment(paymentId: string): Promise<SyncResultDto> {
    const payment = await this.em.findOne(
      Payment,
      { paymentId },
      { populate: ['order'] }
    );
    if (!payment) {
      throw new PaymentNotFoundError(paymentId);
    }
    if (payment.provider === PaymentProvider.INTERNO) {
      throw new PaymentNotSyncableError(paymentId);
    }
    if (!isConfigured()) {
      throw new GatewayError('Falta configurar MP_ACCESS_TOKEN');
    }

    let remote: RemotePayment | null;
    try {
      remote = payment.externalId
        ? await fetchPayment(payment.externalId)
        : await findPaymentByReference(payment.paymentId);
    } catch (error: any) {
      throw new GatewayError(error?.message ?? 'Error desconocido');
    }

    if (remote) {
      await this.reconcile(payment, remote);
    }

    const bill = await this.em.findOne(Bill, {
      order: { orderId: payment.order.orderId },
    });
    return { payment, bill };
  }

  async findPaymentsByOrder(orderId: string): Promise<Payment[]> {
    return this.em.find(
      Payment,
      { order: { orderId } },
      { orderBy: { createdAt: 'DESC' } }
    );
  }

  async findPaymentById(paymentId: string): Promise<Payment | null> {
    return this.em.findOne(Payment, { paymentId });
  }

  private async reconcile(
    payment: Payment,
    remote: RemotePayment
  ): Promise<void> {
    if (payment.status === PaymentStatus.APPROVED) {
      return;
    }

    payment.externalId = remote.externalId;
    payment.status =
      PaymentService.REMOTE_STATUS[remote.status] ?? PaymentStatus.PENDING;
    if (remote.amount > 0) {
      payment.amount = remote.amount;
    }

    if (payment.status === PaymentStatus.APPROVED) {
      const order = await this.em.findOne(Order, {
        orderId: payment.order.orderId,
      });
      const existing = await this.em.findOne(Bill, {
        order: { orderId: payment.order.orderId },
      });
      if (order && !existing) {
        this.em.persist(this.buildBill(order, payment.method));
      }
    }

    await this.em.flush();
  }

  private buildBill(order: Order, method: PaymentMethod): Bill {
    const bill = new Bill();
    bill.order = order;
    bill.paymentMethod = method;
    return bill;
  }

  private async assertPayable(orderId: string): Promise<Order> {
    const order = await this.em.findOne(Order, { orderId });
    if (!order) {
      throw new OrderNotFoundError(orderId);
    }
    if (order.status !== OrderStatus.ENTREGADO) {
      throw new OrderNotPayableError(orderId, order.status);
    }
    const bill = await this.em.findOne(Bill, { order: { orderId } });
    if (bill) {
      throw new OrderAlreadyPaidError(orderId, bill.billId);
    }
    return order;
  }
}
