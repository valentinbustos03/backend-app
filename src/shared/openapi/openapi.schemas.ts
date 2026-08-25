import { z } from 'zod';
import { registerResponse } from './openapi.builder.js';
import { EmployeeRole } from '../enum/employee.roleEnum.js';
import { OrderStatus } from '../enum/order.statusEnum.js';
import { ReservationStatus } from '../enum/reservation.statusEnum.js';
import { UserRole } from '../enum/user.roleEnum.js';

const SnowflakeId = z
  .string()
  .regex(/^\d+$/)
  .describe('Identificador snowflake generado por el backend');

const DateTime = z.string().meta({
  format: 'date-time',
  description: 'Fecha y hora en formato ISO 8601',
});

const Email = z.string().meta({ format: 'email' });

const Decimal = z
  .number()
  .describe(
    'Columna DECIMAL de MySQL; MikroORM la coacciona a number porque la propiedad esta tipada number'
  );

export const UserSummarySchema = registerResponse(
  'UserSummary',
  z
    .object({
      id: SnowflakeId,
      email: Email,
      fullName: z.string(),
      phoneNumber: z.string(),
      role: z.enum(UserRole),
      profilePicture: z.string().optional(),
    })
    .describe('Datos del usuario embebidos en cliente y empleado, sin password')
);

export const ClientSummarySchema = registerResponse(
  'ClientSummary',
  z
    .object({
      id: SnowflakeId,
      dni: z.number().int(),
      penalty: z.number().int(),
    })
    .describe('Datos del cliente embebidos en el usuario')
);

export const EmployeeSummarySchema = registerResponse(
  'EmployeeSummary',
  z
    .object({
      id: SnowflakeId,
      taxId: z.string(),
      shift: z.string(),
      workedHours: Decimal,
      priceHour: Decimal,
      salary: Decimal.optional(),
      role: z.enum(EmployeeRole),
    })
    .describe('Datos del empleado embebidos en el usuario')
);

export const UserSchema = registerResponse(
  'User',
  z.object({
    id: SnowflakeId,
    email: Email,
    fullName: z.string(),
    phoneNumber: z.string(),
    role: z.enum(UserRole),
    profilePicture: z.string().optional(),
    client: ClientSummarySchema.nullable(),
    employee: EmployeeSummarySchema.nullable(),
  })
);

export const ClientSchema = registerResponse(
  'Client',
  z.object({
    id: SnowflakeId,
    dni: z.number().int(),
    penalty: z
      .number()
      .int()
      .describe('Cantidad de penalizaciones acumuladas por el cliente'),
    user: UserSummarySchema.nullable(),
  })
);

const employeeBase = {
  id: SnowflakeId,
  taxId: z.string(),
  shift: z.string(),
  workedHours: Decimal,
  priceHour: Decimal,
  salary: Decimal.optional(),
  user: UserSummarySchema.nullable(),
};

export const ChefSchema = registerResponse(
  'Chef',
  z.object({
    ...employeeBase,
    role: z.literal(EmployeeRole.CHEF),
    hierarchy: z
      .string()
      .describe('Chef de Cuisine, Sous Chef, Chef de Partie, Commis, Plongeur'),
    tag: z.string(),
  })
);

export const WaiterSchema = registerResponse(
  'Waiter',
  z.object({
    ...employeeBase,
    role: z.literal(EmployeeRole.WAITER),
    calification: z.number(),
    sector: z.string(),
  })
);

export const EmployeeSchema = registerResponse(
  'Employee',
  z
    .discriminatedUnion('role', [ChefSchema, WaiterSchema])
    .describe('Empleado; el campo role discrimina entre chef y waiter')
);

export const SupplierSchema = registerResponse(
  'Supplier',
  z.object({
    id: SnowflakeId,
    companyName: z.string(),
    taxId: z.string().describe('CUIT/CUIL con formato NN-NNNNNNNN-N'),
    mail: Email,
    phoneNumber: z.string(),
    typeIngredient: z.string(),
    fullName: z.string(),
    bussinessName: z.string(),
  })
);

export const IngredientSchema = registerResponse(
  'Ingredient',
  z.object({
    id: SnowflakeId,
    cod: z.string(),
    name: z.string(),
    description: z.string().optional(),
    stock: z.number().int(),
    uniteOfMeasure: z.string(),
    origin: z.string(),
    stockLimit: z
      .number()
      .int()
      .describe('Umbral de reposicion: por debajo de este valor el ingrediente aparece en /ingredient/lowStock'),
    unitCost: Decimal.optional(),
    suppliers: z
      .array(SupplierSchema)
      .optional()
      .describe('Solo viene poblada cuando se pide includeDetails=true'),
  })
);

export const DishIngredientSchema = registerResponse(
  'DishIngredient',
  z
    .object({
      ingredient: IngredientSchema,
      quantity: z.number().int(),
    })
    .describe('Renglon de la receta del plato')
);

export const DishSchema = registerResponse(
  'Dish',
  z.object({
    id: SnowflakeId,
    cod: z.string(),
    name: z.string(),
    description: z.string().optional(),
    picture: z.string().optional(),
    price: Decimal,
    calification: Decimal.optional(),
    tag: z.string(),
    ingredients: z.array(DishIngredientSchema),
    chef: ChefSchema,
  })
);

export const TableSchema = registerResponse(
  'Table',
  z.object({
    id: SnowflakeId,
    cod: z.string(),
    capacity: z.number().int(),
    description: z.string().optional(),
    occupied: z.boolean(),
    sector: z.string(),
  })
);

export const OrderItemSchema = registerResponse(
  'OrderItem',
  z.object({
    orderItemId: SnowflakeId,
    dish: SnowflakeId.describe(
      'ID del plato: la relacion no se puebla, se serializa la clave primaria'
    ),
    quantity: z.number().int(),
  })
);

export const BillSchema = registerResponse(
  'Bill',
  z.object({
    billId: SnowflakeId,
    createdAt: DateTime,
    paymentMethod: z.string(),
    order: SnowflakeId.describe('ID del pedido facturado'),
  })
);

export const OrderSchema = registerResponse(
  'Order',
  z.object({
    orderId: SnowflakeId,
    description: z.string().optional(),
    status: z.enum(OrderStatus),
    startTime: DateTime.describe('Se fija en el alta, no se recibe por request'),
    estimatedEndTime: DateTime,
    endTime: DateTime,
    subtotal: z
      .number()
      .describe(
        'Calculado por el backend con el precio de los platos y la mejor promocion vigente al momento del alta'
      ),
    orderItems: z.array(OrderItemSchema),
    client: ClientSchema,
    table: TableSchema,
    waiter: WaiterSchema,
    bill: BillSchema.nullable().optional(),
  })
);

export const PromotionSchema = registerResponse(
  'Promotion',
  z.object({
    id: SnowflakeId,
    cod: z.string(),
    name: z.string(),
    description: z.string().optional(),
    discountPercentage: z.number(),
    dateFrom: DateTime,
    dateTo: DateTime,
    active: z.boolean(),
    dishes: z.array(DishSchema),
  })
);

export const ReservationSchema = registerResponse(
  'Reservation',
  z.object({
    id: SnowflakeId,
    dateTime: DateTime,
    numberOfPeople: z.number().int(),
    status: z.enum(ReservationStatus),
    client: ClientSchema,
    table: TableSchema,
  })
);

export const StockShortageSchema = registerResponse(
  'StockShortage',
  z
    .object({
      id: SnowflakeId,
      name: z.string(),
      stock: z.number().int().describe('Stock disponible'),
      required: z.number().int().describe('Stock que exige el pedido'),
    })
    .describe('Faltante de stock que impide dar de alta el pedido')
);

export const MissingReferenceSchema = registerResponse(
  'MissingReference',
  z
    .object({
      tipo: z.enum(['client', 'table', 'waiter', 'dish']),
      id: SnowflakeId,
    })
    .describe('Referencia enviada en el pedido que no existe en la base')
);

export const StatusTransitionSchema = registerResponse(
  'StatusTransition',
  z
    .object({
      from: z.enum(OrderStatus),
      to: z.enum(OrderStatus),
    })
    .describe('Transicion de estado rechazada')
);

export const ValidationErrorSchema = registerResponse(
  'ValidationError',
  z.object({
    message: z.string(),
    error: z.object({
      name: z.literal('ZodError'),
      message: z
        .string()
        .describe(
          'Lista de issues de Zod serializada como texto JSON, no como objeto'
        ),
    }),
  })
);

export const ErrorSchema = registerResponse(
  'Error',
  z.object({
    message: z.string().optional(),
    error: z.string().optional().describe('Mensaje de la excepcion original'),
  })
);
