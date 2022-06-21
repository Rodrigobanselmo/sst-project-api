import { IParagraphOptions, Paragraph } from 'docx';
export declare const paragraphNormal: (text: string, options?: IParagraphOptions & {
    break?: boolean;
}) => Paragraph;
export declare const pageBreak: () => Paragraph;
