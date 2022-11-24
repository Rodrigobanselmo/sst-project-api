import { TableCell, TableRow } from 'docx';
export interface headerTableProps {
    text: string;
    size?: number;
    position?: number;
    borders: any;
}
export declare class TableHeaderElements {
    headerTitle(title: string[], columnSpan: number): TableRow;
    headerRow(tableCell: TableCell[]): TableRow;
    headerCell({ text, size, ...rest }: headerTableProps): TableCell;
}
