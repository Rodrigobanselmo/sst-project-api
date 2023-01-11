import { Workbook } from 'exceljs';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { IReportCell, IReportFactoryProduct, IReportFactoryProductFindData, IReportRows, ReportFillColorEnum } from '../types/IReportFactory.types';

export abstract class ReportFactoryAbstractionCreator {
  public abstract factoryMethod(): IReportFactoryProduct;
  private readonly excelProvider: ExcelProvider;

  constructor(excelProvider) {
    this.excelProvider = excelProvider;
  }

  public create() {
    const product = this.factoryMethod();

    return product;
  }

  public async excelCompile(): Promise<{ workbook: Workbook; filename: string }> {
    const { rows, filename: fileName, sheetName } = await this.getRows();

    const { workbook, filename } = await this.excelProvider.createReportTable([{ rows, name: sheetName }], fileName);

    return { workbook, filename };
  }

  public async getRows() {
    const product = this.create();

    const tableData = await product.findTableData();
    const rows = this.organizeRows(tableData);

    return { rows, filename: product.getFilename(), sheetName: product.getSheetName() };
  }

  public organizeRows(findArgs: IReportFactoryProductFindData): IReportRows {
    const rows = this.getRowsFromSanitazeData(findArgs);

    rows.unshift(findArgs.headerRow.map<IReportCell>((h) => ({ fill: ReportFillColorEnum.HEADER, ...h })));
    rows.unshift(...findArgs.titleRows.map<IReportCell[]>((row) => row.map<IReportCell>((t) => ({ fill: ReportFillColorEnum.TITLE, ...t }))));
    rows.push(...findArgs.endRows.map<IReportCell[]>((row) => row.map<IReportCell>((t) => ({ fill: ReportFillColorEnum.END, ...t }))));

    return rows;
  }

  public getRowsFromSanitazeData({ sanitizeData, headerRow }: IReportFactoryProductFindData) {
    const headerMap = this.getHeaderMap(headerRow);

    const rows = sanitizeData.map<IReportCell[]>((dataRow) => {
      const row: IReportCell[] = Array.from({ length: headerRow.length }).map(() => ({ content: '' }));

      Object.entries(dataRow).forEach(([key, value]) => {
        const headerFound = headerMap[key];
        if (headerFound) {
          row[headerFound.index] = value;
        }
      });

      return row;
    });

    return rows;
  }

  public getHeaderMap(header: IReportFactoryProductFindData['headerRow']) {
    const headerMap: Record<string, { index: number }> = {};
    header.forEach((headerRow, index) => {
      headerMap[headerRow.database] = { index };
    });

    return headerMap;
  }
}
