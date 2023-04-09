import { ISheetHeaderList } from '../../upload/types/IFileFactory.types';
import { allBorders } from '../constants/theme';
import { IReportCell, ReportFillColorEnum } from '../types/IReportFactory.types';

export function convertTitleUpload(sheetHeaderList: ISheetHeaderList) {
  const headerTitle: IReportCell[] = [];

  sheetHeaderList.forEach((column) => {
    const cell: IReportCell = {
      content: column.name,
      align: { horizontal: 'center' },
      ...(column.group.flat(1).length > 1 && { mergeRight: column.group.flat(1).length - 1 }),
      fill: ReportFillColorEnum.TITLE_LIGHT,
      borders: allBorders,
      ...column,
    };

    headerTitle.push(cell);

    column.group.flat(1).forEach((_, i) => {
      if (i != 0) headerTitle.push({ content: '', fill: undefined });
    });
  });

  return headerTitle;
}
