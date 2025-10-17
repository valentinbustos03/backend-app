import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { orm, syncSchema } from './shared/db/orm.js';
import { RequestContext } from '@mikro-orm/core';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.config.js';

// Routers
import { clientRouter } from './client/client.route.js';
import { employeeRouter } from './employee/employee.route.js';
import { supplierRouter } from './supplier/supplier.route.js';
import { tableRouter } from './table/table.route.js';
import { ingredientRouter } from './ingredient/ingredient.route.js';
import { dishRouter } from './dish/dish.route.js';
import { orderRouter } from './order/order.router.js';
import { billRouter } from './order/bill/bill.router.js';
import { userRoter } from './user/user.routes.js';

const app = express();

// Configurar CORS
app.use(cors({
  origin: 'http://localhost:3001', // URL del frontend Next.js
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

app.use('/client', clientRouter);
app.use('/dish', dishRouter);
app.use('/employee', employeeRouter);
app.use('/ingredient', ingredientRouter);
app.use('/order', orderRouter, billRouter);
// app.use('/order', billRouter);
app.use('/supplier', supplierRouter);
app.use('/table', tableRouter);
app.use('/user', userRoter);

//Configura Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((_, res) => {
  res.status(404).send({ message: 'Resource not found' });
});

await syncSchema(); //never in production

app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/');
});
