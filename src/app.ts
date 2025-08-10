import 'reflect-metadata';
import express from 'express';
import { orm, syncSchema } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'
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


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

app.use('/client', clientRouter);
app.use('/dish',dishRouter);
app.use('/employee', employeeRouter);
app.use('/ingredient',ingredientRouter);
app.use('/order',orderRouter);
app.use('/supplier', supplierRouter);
app.use('/table', tableRouter);

//Configura Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((_, res) => {
  res.status(404).send({ message: 'Resource not found' });
});

await syncSchema(); //never in production

app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/');
});
