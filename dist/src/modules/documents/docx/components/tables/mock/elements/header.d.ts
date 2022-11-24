import { ITableCellOptions, ITableRowOptions, TableCell, TableRow } from 'docx';
export interface headerTableProps extends Partial<ITableCellOptions> {
    text: string;
    size?: number;
    position?: number;
}
export declare class TableHeaderElements {
    headerRow(tableCell: TableCell[], rowOptions?: Partial<ITableRowOptions>): TableRow;
    headerCell({ text, size, ...rest }: headerTableProps): TableCell;
}
