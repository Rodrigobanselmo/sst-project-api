import { AlignmentType } from 'docx';
import { HierarchyMapData } from '../../../../../converter/hierarchy.converter';
import { HierarchyEntity } from './../../../../../../../company/entities/hierarchy.entity';
export declare const dataConverter: (hierarchyData: HierarchyMapData & {
    hierarchies: HierarchyEntity[];
}) => {
    text: string;
    alignment: AlignmentType;
    borders: {
        top: {
            style: import("docx").BorderStyle;
            size: number;
        };
        bottom: {
            style: import("docx").BorderStyle;
            size: number;
        };
        left: {
            style: import("docx").BorderStyle;
            size: number;
        };
        right: {
            style: import("docx").BorderStyle;
            size: number;
        };
    };
}[];
