import { IColumnRule, ISheetHeaderList } from '../../upload/types/IFileFactory.types';
import { allBorders, requiredBorders } from '../constants/theme';
import { IReportHeader, ReportFillColorEnum } from '../types/IReportFactory.types';

export function convertHeaderUpload(sheetHeaderList: ISheetHeaderList): IReportHeader {
  const header: IReportHeader[] = sheetHeaderList.map<IReportHeader>((column, index) => {
    const fillColors = column.fillColors || [ReportFillColorEnum.HEADER, ReportFillColorEnum.HEADER_BLUE];
    return column.group
      .map((column: IColumnRule | IColumnRule[], _index) => {
        if (Array.isArray(column)) {
          return column.map((column) => {
            return {
              content: column.field,
              database: column.database || column.field,
              fill: fillColors[_index % fillColors.length],
              borders: { ...allBorders, ...(column.required && requiredBorders) },
              ...column,
            };
          });
        }

        return {
          content: column.field,
          database: column.database,
          fill: fillColors[index % fillColors.length],
          borders: { ...allBorders, ...(column.required && requiredBorders) },
          ...column,
        };
      })
      .flat(1);
  });

  return header.flat(1);
}
