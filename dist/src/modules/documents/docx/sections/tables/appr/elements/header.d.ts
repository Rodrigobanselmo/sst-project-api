import { BorderStyle, ITableCellOptions, Paragraph, TableCell, TableRow } from 'docx';
export interface headerTableProps extends Partial<ITableCellOptions> {
    text: string;
    size?: number;
    borderBottom?: boolean;
    position?: number;
    columnSpan?: number;
}
export declare const whiteBorder: {
    style: BorderStyle;
    color: string;
    size: number;
};
export declare const whiteColumnBorder: {
    style: BorderStyle;
    color: string;
    size: number;
};
export declare const borderBottomStyle: {
    top: {
        style: BorderStyle;
    };
    bottom: {
        style: BorderStyle;
        color: string;
        size: number;
    };
    left: {
        style: BorderStyle;
    };
    right: {
        style: BorderStyle;
    };
};
export declare const borderRightStyle: {
    top: {
        style: BorderStyle;
    };
    bottom: {
        style: BorderStyle;
    };
    left: {
        style: BorderStyle;
    };
    right: {
        style: BorderStyle;
        color: string;
        size: number;
    };
};
export declare class TableHeaderElements {
    headerTitle({ text, columnSpan, ...props }: headerTableProps): TableRow;
    headerRow(tableCell: TableCell[]): TableRow;
    spacing(): Paragraph;
    headerCell({ text, size, ...rest }: headerTableProps): TableCell;
}
