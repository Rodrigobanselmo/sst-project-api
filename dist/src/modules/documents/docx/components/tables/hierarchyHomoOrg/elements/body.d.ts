import { ITableCellOptions, TableCell, TableRow } from 'docx';
export interface bodyTableProps extends Partial<ITableCellOptions> {
    text?: string;
    size?: number;
    employee?: string;
    description?: string;
}
export declare const borderNoneStyle: {};
export declare const emptyCellName = " ";
export declare class TableBodyElements {
    tableRow(tableCell: TableCell[]): TableRow;
    tableCell({ text, size, ...rest }: bodyTableProps): TableCell;
}
