import ExcelJS from 'exceljs';

class ExcelService {
  async createExcelFile(data: {
    tableBody: string[][];
    tableHeaders: string[];
  }) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    worksheet.addTable({
      name: 'Table1',
      ref: 'A1',
      headerRow: true,
      totalsRow: false,
      style: {
        theme: 'TableStyleMedium9',
        showRowStripes: true,
      },
      columns: data.tableHeaders.map((e) => ({ name: e })),
      rows: data.tableBody,
    });

    return workbook.xlsx.writeBuffer();
  }
}

export const excelService = new ExcelService();
