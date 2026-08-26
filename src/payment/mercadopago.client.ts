import {
  MercadoPagoConfig,
  Payment as MpPayment,
  Preference as MpPreference,
} from 'mercadopago';

export interface PreferenceResult {
  preferenceId: string;
  initPoint: string;
}

export interface RemotePayment {
  externalId: string;
  status: string;
  amount: number;
  externalReference: string;
}

export interface CreatePreferenceArgs {
  paymentId: string;
  orderId: string;
  amount: number;
  description: string;
}

function accessToken(): string {
  return process.env.MP_ACCESS_TOKEN ?? '';
}

function frontendUrl(): string {
  return process.env.FRONTEND_URL ?? 'http://localhost:3001';
}

function publicUrl(): string {
  return process.env.PUBLIC_URL ?? '';
}

export function isConfigured(): boolean {
  return accessToken().length > 0;
}

function client(): MercadoPagoConfig {
  return new MercadoPagoConfig({ accessToken: accessToken() });
}

function toRemotePayment(raw: {
  id?: number | string;
  status?: string;
  transaction_amount?: number;
  external_reference?: string;
}): RemotePayment | null {
  if (raw.id === undefined || raw.id === null) {
    return null;
  }
  return {
    externalId: String(raw.id),
    status: raw.status ?? '',
    amount: Number(raw.transaction_amount ?? 0),
    externalReference: raw.external_reference ?? '',
  };
}

export async function createPreference(
  args: CreatePreferenceArgs
): Promise<PreferenceResult> {
  const preference = new MpPreference(client());
  const front = frontendUrl();
  const backUrl = `${front}/pedidos/${args.orderId}`;
  const notificationUrl = publicUrl()
    ? `${publicUrl()}/payment/webhook`
    : undefined;

  const created = await preference.create({
    body: {
      items: [
        {
          id: args.paymentId,
          title: args.description,
          quantity: 1,
          unit_price: args.amount,
          currency_id: 'ARS',
        },
      ],
      external_reference: args.paymentId,
      back_urls: {
        success: `${backUrl}?pago=success`,
        failure: `${backUrl}?pago=failure`,
        pending: `${backUrl}?pago=pending`,
      },
      auto_return: 'approved',
      notification_url: notificationUrl,
    },
  });

  if (!created.id || !created.init_point) {
    throw new Error('Mercado Pago no devolvio una preferencia utilizable');
  }

  return { preferenceId: created.id, initPoint: created.init_point };
}

export async function fetchPayment(
  externalId: string
): Promise<RemotePayment | null> {
  const payment = new MpPayment(client());
  const found = await payment.get({ id: externalId });
  return toRemotePayment(found);
}

export async function findPaymentByReference(
  externalReference: string
): Promise<RemotePayment | null> {
  const payment = new MpPayment(client());
  const found = await payment.search({
    options: { external_reference: externalReference },
  });
  const first = found.results?.[0];
  return first ? toRemotePayment(first) : null;
}
