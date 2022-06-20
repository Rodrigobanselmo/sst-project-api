import { RiskFactorGroupDataEntity } from '../../../../../checklist/entities/riskGroupData.entity';
export declare const riskCharacterizationConverter: (riskGroup: RiskFactorGroupDataEntity) => {
    darker: boolean;
    text: string;
    size?: number;
    type?: string;
    children?: (import("docx").Paragraph | import("docx").Table)[];
    shading?: import("docx").IShadingAttributesProperties;
    margins?: import("docx/build/file/table/table-properties/table-cell-margin").ITableCellMarginOptions;
    verticalAlign?: import("docx").VerticalAlign;
    textDirection?: import("docx").TextDirection;
    verticalMerge?: import("docx").VerticalMergeType;
    width?: import("docx").ITableWidthProperties;
    columnSpan?: number;
    rowSpan?: number;
    borders?: import("docx").ITableCellBorders;
}[][];
