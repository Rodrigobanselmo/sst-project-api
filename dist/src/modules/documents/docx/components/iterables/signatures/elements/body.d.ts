import { ITableBordersOptions, ITableCellOptions, Paragraph, TableCell, TableRow } from 'docx';
export interface bodyTableProps extends Partial<ITableCellOptions> {
    data: Paragraph[];
    empty?: boolean;
}
export declare const borderStyle: ITableBordersOptions;
export declare class TableBodyElements {
    tableRow(tableCell: TableCell[]): TableRow;
    tableCell({ data, empty, ...rest }: bodyTableProps): TableCell;
}
