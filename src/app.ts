import express from 'express';
import bodyParser from 'body-parser';
import { errorHandler } from './middleware/errorHandler';
import apiRoutes from './routes/api';

const app = express();

app.use(bodyParser.json());

app.use('/api', apiRoutes);

app.use(errorHandler);

export default app;
