import { TableCell, TableRow } from 'docx';
export interface bodyTableProps {
    text: string;
    size?: number;
    borders: any;
}
export declare class TableBodyElements {
    tableRow(tableCell: TableCell[]): TableRow;
    tableCell({ text, size, ...rest }: bodyTableProps): TableCell;
}
