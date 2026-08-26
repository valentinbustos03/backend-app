import { Router } from 'express';
import { profitabilityReport, salesReport } from './report.controller.js';

export const reportRouter = Router();

reportRouter.get('/sales', salesReport);
reportRouter.get('/profitability', profitabilityReport);
