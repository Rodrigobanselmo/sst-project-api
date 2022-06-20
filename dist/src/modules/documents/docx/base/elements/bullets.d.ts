import { IParagraphOptions, Paragraph } from 'docx';
export declare const bulletsNormal: (bullets: [string, number?][], options?: IParagraphOptions) => Paragraph[];
export declare const bulletsMoreLevels: (bullets: string[][] | string[], options?: IParagraphOptions) => Paragraph[];
