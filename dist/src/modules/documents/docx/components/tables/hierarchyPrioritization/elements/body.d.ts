import { ITableCellOptions, TableCell, TableRow } from 'docx';
export interface bodyTableProps extends Partial<ITableCellOptions> {
    text?: string;
    size?: number;
    attention?: boolean;
    shaded?: boolean;
}
export declare class TableBodyElements {
    tableRow(tableCell: TableCell[]): TableRow;
    tableCell({ text, attention, shaded, size, ...rest }: bodyTableProps): TableCell;
}
