import {
  buildSchemaComponents,
  envelope,
  jsonSchemaResponse,
  JsonObject,
  PathsObject,
  ref,
} from './shared/openapi/openapi.builder.js';
import './shared/openapi/openapi.schemas.js';

import { authPaths } from './auth/auth.docs.js';
import { clientPaths } from './client/client.docs.js';
import { dishPaths } from './dish/dish.docs.js';
import { employeePaths } from './employee/employee.docs.js';
import { ingredientPaths } from './ingredient/ingredient.docs.js';
import { orderPaths } from './order/order.docs.js';
import { billPaths } from './order/bill/bill.docs.js';
import { paymentPaths } from './payment/payment.docs.js';
import { promotionPaths } from './promotion/promotion.docs.js';
import { reportPaths } from './report/report.docs.js';
import { reservationPaths } from './reservation/reservation.docs.js';
import { supplierPaths } from './supplier/supplier.docs.js';
import { tablePaths } from './table/table.docs.js';
import { userPaths } from './user/user.docs.js';

const DESCRIPTION = `API del sistema de gestion de restaurante (TP Desarrollo de Software).

**Convenciones**

- Toda respuesta viaja envuelta en \`{ message, data }\`. \`message\` describe el resultado en texto y \`data\` trae el recurso, la lista, o el detalle del error de negocio.
- Los IDs son snowflakes: numeros largos que viajan como string.
- Buscar por ID algo que no existe responde **200 con \`data\` en null**, no 404. Es una decision de diseno acordada con la catedra para simplificar el manejo de errores: el cliente de la API tiene la obligacion de mandar un ID valido. El 404 queda para los DELETE sobre un recurso inexistente.
- Los PUT reemplazan el recurso completo: exigen todos los campos del alta, no solo los que cambian.
- Los errores de validacion (400) devuelven el \`ZodError\` serializado, con la lista de issues dentro de \`error.message\` como texto JSON.
- Una ruta que no existe responde 404 con \`{ message: "Resource not found" }\`.

**Autenticacion**

El login devuelve un JWT que viaja en la cookie httpOnly \`token\`. Para probar desde esta pagina o desde Postman, el mismo token se acepta en el header \`Authorization: Bearer <token>\`.

**Todos los endpoints exigen sesion salvo los marcados como publicos**: \`/auth/login\`, \`/auth/register\`, \`/auth/logout\`, \`/payment/webhook\` y esta documentacion. La politica es *deny by default*: un endpoint que no este contemplado en la tabla de reglas queda restringido a administradores, no abierto.

Hay tres roles, y **no se guardan**: se derivan del \`role\` del usuario y de sus relaciones con Client y Employee, con precedencia \`admin\` -> \`empleado\` -> \`cliente\`. Un usuario sin ninguna de las dos relaciones no puede iniciar sesion.

Un rol insuficiente responde **403**; la falta de sesion, **401**.`;

const paths: PathsObject = {
  ...authPaths,
  ...clientPaths,
  ...dishPaths,
  ...employeePaths,
  ...ingredientPaths,
  ...orderPaths,
  ...billPaths,
  ...paymentPaths,
  ...promotionPaths,
  ...reportPaths,
  ...reservationPaths,
  ...supplierPaths,
  ...tablePaths,
  ...userPaths,
};

const responses: JsonObject = {
  ValidationError: jsonSchemaResponse(
    'Los datos enviados no pasaron la validacion de Zod',
    ref('ValidationError')
  ),
  NotFound: jsonSchemaResponse(
    'El recurso a eliminar no existe',
    envelope()
  ),
  ServerError: jsonSchemaResponse(
    'Error inesperado del servidor',
    ref('Error')
  ),
};

export const swaggerSpec = {
  openapi: '3.1.0',
  info: {
    title: 'API del sistema de restaurante',
    version: '2.19.0',
    description: DESCRIPTION,
    license: { name: 'ISC', identifier: 'ISC' },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local de desarrollo',
    },
  ],
  tags: [
    { name: 'auth', description: 'Sesion, registro y perfil propio' },
    { name: 'client', description: 'Clientes del restaurante' },
    { name: 'dish', description: 'Platos de la carta y su receta' },
    { name: 'employee', description: 'Empleados: chefs y mozos' },
    { name: 'ingredient', description: 'Ingredientes y control de stock' },
    { name: 'order', description: 'Pedidos' },
    { name: 'bill', description: 'Facturacion de los pedidos' },
    {
      name: 'payment',
      description: 'Pagos: Mercado Pago Checkout Pro y registro interno',
    },
    { name: 'promotion', description: 'Promociones y descuentos' },
    { name: 'report', description: 'Informes de ventas y rentabilidad' },
    { name: 'reservation', description: 'Reservas de mesa' },
    { name: 'supplier', description: 'Proveedores de ingredientes' },
    { name: 'table', description: 'Mesas del salon' },
    { name: 'user', description: 'Usuarios del sistema' },
  ],
  paths,
  security: [{ cookieAuth: [] }, { bearerAuth: [] }],
  components: {
    schemas: buildSchemaComponents(),
    responses,
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'token',
        description: 'La cookie httpOnly que setea /auth/login',
      },
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'El mismo token, para Swagger y Postman',
      },
    },
  },
};
