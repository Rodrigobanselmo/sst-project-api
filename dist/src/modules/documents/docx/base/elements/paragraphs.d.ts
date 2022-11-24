import { AlignmentType, ExternalHyperlink, IParagraphOptions, Paragraph, SequentialIdentifier } from 'docx';
interface ParagraphProps extends IParagraphOptions {
    break?: boolean;
    sequentialIdentifier?: SequentialIdentifier;
    size?: number;
    align?: AlignmentType;
    isBold?: boolean;
    isBreak?: boolean;
    color?: string;
}
export declare const paragraphNormal: (text: string, { children, color, ...options }?: ParagraphProps) => Paragraph;
export declare const pageBreak: () => Paragraph;
export declare const textLink: (text: string, options?: ParagraphProps) => ExternalHyperlink;
export declare const paragraphTable: (text: string, options?: ParagraphProps) => Paragraph;
export declare const paragraphTableLegend: (text: string, options?: ParagraphProps) => Paragraph;
export declare const paragraphFigure: (text: string, options?: ParagraphProps & {
    spacingAfter?: number;
}) => Paragraph;
export {};
