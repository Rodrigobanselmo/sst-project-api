import { ITableCellOptions, TableCell, TableRow } from 'docx';
export interface headerTableProps extends Partial<ITableCellOptions> {
    text: string;
    size?: number;
    font?: number;
    position?: number;
}
export declare class TableHeaderElements {
    headerRow(tableCell: TableCell[]): TableRow;
    headerCell({ text, font, size, ...rest }: headerTableProps): TableCell;
}
