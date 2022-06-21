import { IParagraphOptions, Paragraph } from 'docx';
export declare const bulletsNormal: (text: string, level?: 0 | 1 | 2 | 3 | 4 | 5 | 6, options?: IParagraphOptions) => Paragraph;
export declare const bulletsArray: (bullets: [
    string,
    number?
][], options?: IParagraphOptions) => Paragraph[];
export declare const bulletsMoreLevels: (bullets: string[][] | string[], options?: IParagraphOptions) => Paragraph[];
