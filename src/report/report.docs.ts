import { z } from 'zod';
import {
  dataResponse,
  PathsObject,
  queryParam,
  ref,
  refResponse,
  registerResponse,
} from '../shared/openapi/openapi.builder.js';

const SnowflakeId = z
  .string()
  .regex(/^\d+$/)
  .describe('Identificador snowflake generado por el backend');

const ReportDate = z
  .string()
  .nullable()
  .meta({ description: 'Limite del rango tal como llego, o null si no se envio' });

registerResponse(
  'SalesReport',
  z
    .object({
      from: ReportDate,
      to: ReportDate,
      salesCount: z.number().int().describe('Cantidad de pedidos facturados'),
      totalRevenue: z
        .number()
        .describe('Suma de los subtotales congelados de esos pedidos'),
      avgTicket: z.number().describe('totalRevenue / salesCount, o 0 sin ventas'),
      byDish: z.array(
        z.object({
          dishId: SnowflakeId,
          name: z.string(),
          units: z.number().int().describe('Unidades vendidas del plato'),
          share: z
            .number()
            .describe('Porcentaje que representa sobre el total de unidades'),
        })
      ),
      byPaymentMethod: z.array(
        z.object({
          paymentMethod: z.string(),
          salesCount: z.number().int(),
          total: z.number(),
        })
      ),
    })
    .describe(
      'Informe de ventas del periodo. Solo cuenta pedidos con factura: un pedido sin facturar todavia no se pago. No hay plata por plato, solo unidades, porque el precio unitario no se guarda en el pedido.'
    )
);

registerResponse(
  'ProfitabilityReport',
  z
    .object({
      from: ReportDate,
      to: ReportDate,
      revenue: z.number().describe('Suma de los subtotales facturados'),
      cost: z
        .number()
        .describe(
          'Costo de las recetas vendidas, salteando los ingredientes sin unitCost cargado'
        ),
      margin: z.number().describe('revenue - cost'),
      marginPct: z
        .number()
        .nullable()
        .describe('Porcentaje de margen, o null si no hubo ingresos'),
      costIncomplete: z
        .boolean()
        .describe(
          'true si algun plato vendido no se pudo costear entero. Con esta bandera en true el margen es un techo, no un valor exacto: el ingreso del plato se cuenta igual pero su costo no.'
        ),
      dishesWithoutCost: z.array(
        z.object({ dishId: SnowflakeId, name: z.string() })
      ),
    })
    .describe(
      'Rentabilidad del restaurante en el periodo. Es a nivel local y no por plato: el ingreso solo existe agregado en el subtotal del pedido.'
    )
);

const fromParam = queryParam(
  'from',
  'Inicio del rango, inclusive, en formato YYYY-MM-DD. Se compara contra la fecha de la factura.',
  { type: 'string', format: 'date' }
);

const toParam = queryParam(
  'to',
  'Fin del rango, inclusive: cubre el dia entero. Formato YYYY-MM-DD.',
  { type: 'string', format: 'date' }
);

export const reportPaths: PathsObject = {
  '/report/sales': {
    get: {
      tags: ['report'],
      operationId: 'getSalesReport',
      summary: 'Informe de ventas por plato y por metodo de pago',
      description:
        'Agrega los pedidos facturados del periodo. Sin from ni to devuelve todo el historico. Un rango sin ventas responde 200 con los totales en cero y las listas vacias, no es un error.',
      parameters: [fromParam, toParam],
      responses: {
        200: dataResponse('Informe de ventas', ref('SalesReport')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
  },
  '/report/profitability': {
    get: {
      tags: ['report'],
      operationId: 'getProfitabilityReport',
      summary: 'Informe de rentabilidad del restaurante',
      description:
        'Ingresos facturados menos el costo de las recetas vendidas. Si falta algun unitCost, costIncomplete viene en true y el margen queda inflado hacia arriba.',
      parameters: [fromParam, toParam],
      responses: {
        200: dataResponse('Informe de rentabilidad', ref('ProfitabilityReport')),
        400: refResponse('ValidationError'),
        500: refResponse('ServerError'),
      },
    },
  },
};
