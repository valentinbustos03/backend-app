import express from 'express';
import { tableRouter } from './routes/table.route.js';

const app = express();
app.use(express.json());

app.use('/api/tables', tableRouter);

app.use((_, res) => {
  res.status(404).send({ message: 'Resource not found' });
});

app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/');
});
