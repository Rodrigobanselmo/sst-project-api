import { CompanyEntity } from './../../../../company/entities/company.entity';
import { IReportCell, ReportFillColorEnum } from '../types/IReportFactory.types';

export function concatSideBySideTables(tables: IReportCell[][][]) {
  const rows: IReportCell[][] = [];

  // Find the maximum number of rows across all tables
  const maxRows = Math.max(...tables.map((table) => table.length));

  // Iterate through each row index
  for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
    const combinedRow: IReportCell[] = [];

    // For each table, add its cells at the current row index
    for (let tableIndex = 0; tableIndex < tables.length; tableIndex++) {
      const table = tables[tableIndex];

      // If the table has a row at this index, add its cells
      if (rowIndex < table.length) {
        const row = table[rowIndex];
        combinedRow.push(...row);
      } else {
        // If the table doesn't have this row, add empty cells to maintain alignment
        // You might want to adjust this based on your needs
        const maxColsInTable = Math.max(...table.map((row) => row.length));
        for (let colIndex = 0; colIndex < maxColsInTable; colIndex++) {
          combinedRow.push({ content: '', fill: undefined });
        }
      }
    }

    rows.push(combinedRow);
  }

  return rows;
}
