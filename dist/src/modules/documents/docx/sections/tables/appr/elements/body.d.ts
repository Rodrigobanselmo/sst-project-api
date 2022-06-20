import { AlignmentType, BorderStyle, ISpacingProperties, ITableCellOptions, TableCell, TableRow } from 'docx';
export interface bodyTableProps extends Partial<ITableCellOptions> {
    text: string;
    title?: string;
    color?: string;
    borderNone?: boolean;
    bold?: boolean;
    size?: number;
    spacing?: ISpacingProperties;
    alignment?: AlignmentType;
}
export declare const borderNoneStyle: {
    top: {
        style: BorderStyle;
        size: number;
    };
    bottom: {
        style: BorderStyle;
        size: number;
    };
    left: {
        style: BorderStyle;
        size: number;
    };
    right: {
        style: BorderStyle;
        size: number;
    };
};
export declare class TableBodyElements {
    tableRow(tableCell: TableCell[]): TableRow;
    tableCell({ text, title, size, bold, spacing, alignment, color, ...rest }: bodyTableProps): TableCell;
}
