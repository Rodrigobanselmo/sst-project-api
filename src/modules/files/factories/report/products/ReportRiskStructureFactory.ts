import { Injectable } from '@nestjs/common';
import { clothesList } from './../../../../../shared/constants/maps/ibtu-clothes.map';

import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { CompanyRepository } from '../../../../company/repositories/implementations/CompanyRepository';
import { CompanyStructColumnList } from '../../upload/products/CompanyStructure/constants/headersList/CompanyStructColumnList';
import { IColumnRule } from '../../upload/types/IFileFactory.types';
import { ReportFactoryAbstractionCreator } from '../creator/ReportFactoryCreator';
import {
  IReportCell,
  IReportFactoryProduct,
  IReportFactoryProductFindData,
  IReportHeader,
  IReportSanitizeData,
  ReportFillColorEnum
} from '../types/IReportFactory.types';

@Injectable()
export class ReportRiskStructureFactory extends ReportFactoryAbstractionCreator<any> {
  constructor(private readonly companyRepository: CompanyRepository, private readonly excelProv: ExcelProvider) {
    super(excelProv, companyRepository);
  }

  public factoryMethod(): IReportFactoryProduct<any> {
    return new ReportFactoryProduct(this.companyRepository);
  }
}

class ReportFactoryProduct implements IReportFactoryProduct<any> {
  constructor(private readonly companyRepository: CompanyRepository) { }

  public async findTableData() {
    const sanitizeData = this.sanitizeData();
    const headerData = this.getHeader();
    const titleData = this.getTitle();
    const infoData = [];

    const returnData: IReportFactoryProductFindData = { headerRow: headerData, titleRows: titleData, endRows: infoData, sanitizeData };

    return returnData;
  }

  public sanitizeData(): IReportSanitizeData[] {
    const rows: IReportSanitizeData[] = [];
    return rows;
  }

  public getFilename(): string {
    const date = new Date();
    const filename = `Estrutura Ocupacional ${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
    return filename;
  }

  public getSheetName(): string {
    const name = `Estrutura Ocupacional`;

    return name;
  }

  public getHeader(): IReportHeader {
    const header: IReportHeader[] = CompanyStructColumnList.map<IReportHeader>((column, index) => {
      const fillColors = column.fillColors || [ReportFillColorEnum.HEADER, ReportFillColorEnum.HEADER_BLUE];
      return column.group
        .map((column: IColumnRule | IColumnRule[], _index) => {
          if (Array.isArray(column)) {
            return column.map((column) => {
              return {
                content: column.field,
                database: column.field,
                fill: fillColors[_index % fillColors.length],
                ...column,
              };
            });
          }

          return {
            content: column.field,
            database: column.field,
            fill: fillColors[index % fillColors.length],
            ...column,
          };
        })
        .flat(1);
    });

    return header.flat(1);
  }

  public getTitle(): IReportCell[][] {
    const row: IReportCell[] = [{ content: 'Estrutura Ocupacional' }];
    const emptyRow: IReportCell[] = [{ content: '', fill: undefined }];
    const headerTitle: IReportCell[] = [];

    CompanyStructColumnList.forEach((column) => {
      const cell: IReportCell = {
        content: column.name,
        align: { horizontal: 'center' },
        ...(column.group.flat(1).length > 1 && { mergeRight: column.group.flat(1).length - 1 }),
        fill: ReportFillColorEnum.TITLE_LIGHT,
        ...column,
      };

      headerTitle.push(cell);

      column.group.flat(1).forEach((_, i) => {
        if (i != 0) headerTitle.push({ content: '', fill: undefined });
      });
    });

    const rows: IReportCell[][] = [row, emptyRow, ...this.getClothesTable(), headerTitle];
    return rows;
  }

  public getClothesTable(): IReportCell[][] {
    const rowTitle: IReportCell[] = [{ content: 'Tipos de Vestimentas [IBUTG]', mergeRight: 1, fill: ReportFillColorEnum.HEADER_RED }];
    const emptyRow: IReportCell[] = [{ content: '', fill: undefined }];
    const headerTitle: IReportCell[] = [
      { content: 'Vestimenta', fill: ReportFillColorEnum.HEADER },
      { content: 'Valor', fill: ReportFillColorEnum.HEADER },
    ];

    const rows: IReportCell[][] = [emptyRow, rowTitle, headerTitle];

    clothesList.map((c) => {
      const row: IReportCell[] = [
        { content: c.content, fill: undefined },
        { content: c.value, fill: undefined },
      ];

      rows.push(row);
    });

    rows.push(emptyRow);

    return rows;
  }

  public getEndInformation(): IReportCell[][] {
    const rows = [];

    return rows;
  }
}
