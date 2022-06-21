import { ISectionOptions, Paragraph } from 'docx';
interface IHeaderProps {
    version: string;
    imgPath: string;
}
export declare const createCover: ({ version, imgPath, }: IHeaderProps) => Paragraph[];
export declare const coverSections: ({ version, imgPath, }: IHeaderProps) => ISectionOptions;
export {};
