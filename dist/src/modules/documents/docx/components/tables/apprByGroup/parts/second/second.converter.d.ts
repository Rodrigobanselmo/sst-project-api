import { AlignmentType } from 'docx';
import { HierarchyMapData } from '../../../../../converter/hierarchy.converter';
export declare const dataConverter: (hierarchyData: HierarchyMapData) => ({
    text: string;
    alignment: AlignmentType;
    borders: {
        top: {
            style: import("docx").BorderStyle;
        };
        bottom: {
            style: import("docx").BorderStyle;
        };
        left: {
            style: import("docx").BorderStyle;
        };
        right: {
            style: import("docx").BorderStyle;
            color: string;
            size: number;
        };
    };
} | {
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
})[];
