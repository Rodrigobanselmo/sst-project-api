import { ITableCellOptions, TableCell, TableRow } from 'docx';
export interface bodyTableProps extends Partial<ITableCellOptions> {
    text: string;
    size?: number;
    type?: string;
    darker?: boolean;
}
export declare class TableBodyElements {
    tableRow(tableCell: TableCell[]): TableRow;
    tableCell({ text, size, type: _, darker, ...rest }: bodyTableProps): TableCell;
}
