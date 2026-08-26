import { Request, Response } from 'express';
import { orm } from '../shared/db/orm.js';
import { ReportFilterSchema } from './report.schema.js';
import { ReportService } from './report.service.js';

const reportService = new ReportService(orm.em);

async function salesReport(req: Request, res: Response) {
  const filterInput = await ReportFilterSchema.safeParseAsync(req.query);
  if (!filterInput.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: filterInput.error });
  }
  try {
    const report = await reportService.getSalesReport(filterInput.data);
    const msg =
      report.salesCount === 0 ? 'No sales found' : 'Sales report generated';
    return res.status(200).json({ message: msg, data: report });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

async function profitabilityReport(req: Request, res: Response) {
  const filterInput = await ReportFilterSchema.safeParseAsync(req.query);
  if (!filterInput.success) {
    return res
      .status(400)
      .json({ message: 'Validation error', error: filterInput.error });
  }
  try {
    const report = await reportService.getProfitabilityReport(
      filterInput.data
    );
    const msg =
      report.revenue === 0
        ? 'No sales found'
        : 'Profitability report generated';
    return res.status(200).json({ message: msg, data: report });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export { salesReport, profitabilityReport };
