import { AlignmentType } from 'docx';
import { MapData } from '../../../../converter/hierarchy.converter';
export declare const dataConverter: (hierarchyData: MapData) => ({
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
