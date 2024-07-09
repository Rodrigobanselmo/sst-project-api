import { CompanyEntity } from './../../../../company/entities/company.entity';
import { IReportCell, ReportFillColorEnum } from '../types/IReportFactory.types';
import { allBorders, getBoxBorders } from '../constants/theme';

export function getWorkspaceInfoTable(company: CompanyEntity) {
  const rowTitle: IReportCell[] = [
    { content: 'Estabelecimentos', mergeRight: 1, fill: ReportFillColorEnum.HEADER_YELLOW, borders: allBorders },
  ];
  const headerTitle: IReportCell[] = [
    { content: 'Nome Estabelecmento', fill: ReportFillColorEnum.HEADER, borders: allBorders },
    { content: 'Sigla', fill: ReportFillColorEnum.HEADER, borders: allBorders },
  ];

  const rows: IReportCell[][] = [rowTitle, headerTitle];

  company.workspace.map((c, index) => {
    const row: IReportCell[] = [
      { content: c.name, fill: undefined, borders: getBoxBorders(index, 0, company.workspace.length - 1, 1) },
      { content: c.abbreviation, fill: undefined, borders: getBoxBorders(index, 1, company.workspace.length - 1, 1) },
    ];

    rows.push(row);
  });

  return rows;
}
