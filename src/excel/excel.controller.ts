import { Request, Response } from 'express';

import { excelService } from '../excel/excel.service';
import { badRequestResponse } from '../libs/express-responses';

class ExcelController {
  async createExcelFile(req: Request, res: Response) {
    const {
      tableBody,
      tableHeaders,
    }: {
      tableBody: string[][];
      tableHeaders: string[];
    } = req.body;

    if (!tableBody || !tableBody.length) {
      return badRequestResponse(res, 'NO_TABLE_BODY');
    }

    if (!tableHeaders || !tableHeaders.length) {
      return badRequestResponse(res, 'NO_TABLE_HEADERS');
    }

    const excelBuffer = await excelService.createExcelFile({
      tableHeaders,
      tableBody,
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
    res.send(excelBuffer);
  }
}

export const excelController = new ExcelController();
