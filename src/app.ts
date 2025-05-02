import 'reflect-metadata';
import express from 'express';
import { tableRouter } from './routes/table.route.js';
import { orm, syncSchema } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'
import { supplierRouter } from './routes/supplier.route.js';
import { employeeRouter } from './routes/employee.route.js';



const app = express();
app.use(express.json());

app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

app.use('/api/tables', tableRouter);
app.use('/api/suppliers', supplierRouter);
app.use('/api/employees', employeeRouter);

app.use((_, res) => {
  res.status(404).send({ message: 'Resource not found' });
});

await syncSchema(); //never in production

app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/');
});
