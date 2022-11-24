import { IBorderOptions, ISectionPropertiesOptions, ITableBordersOptions } from 'docx';
export declare const pageWidth = 790;
export declare const pageHeight = 1125;
export declare const pageWidthEmu: number;
export declare const pageHeightEmu: number;
export declare const pageWidthParagraph = 11000;
export declare const pageWidthParagraphBox = 12000;
export declare const convertToEmu: (value: number, type: 'w' | 'h') => number;
export declare const convertToParagraph: (value: number) => number;
export declare const convertToParagraphBox: (value: number) => number;
export declare const sectionProperties: ISectionPropertiesOptions;
export declare const sectionLandscapeProperties: ISectionPropertiesOptions;
export declare const sectionCoverProperties: ISectionPropertiesOptions;
export declare const borderNoneStyle: ITableBordersOptions;
interface ISTableBordersOptions {
    readonly top?: Partial<IBorderOptions>;
    readonly bottom?: Partial<IBorderOptions>;
    readonly left?: Partial<IBorderOptions>;
    readonly right?: Partial<IBorderOptions>;
    readonly insideHorizontal?: Partial<IBorderOptions>;
    readonly insideVertical?: Partial<IBorderOptions>;
    readonly size?: number;
}
export declare const borderStyleGlobal: (color: string, options?: ISTableBordersOptions) => ITableBordersOptions;
export {};
