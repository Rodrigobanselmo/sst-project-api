import { AlignmentType, ITableCellOptions, ITableRowOptions, TableCell, TableRow } from 'docx';
export interface bodyTableProps extends Partial<ITableCellOptions> {
    text: string;
    color?: string;
    size?: number;
    textSize?: number;
    alignment?: AlignmentType;
}
export declare class TableBodyElements {
    tableRow(tableCell: TableCell[], rowOptions?: Partial<ITableRowOptions>): TableRow;
    tableCell({ text, size, alignment, ...rest }: bodyTableProps): TableCell;
}
