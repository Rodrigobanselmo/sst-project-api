import { ISectionOptions, Paragraph } from 'docx';
interface IHeaderProps {
    version: string;
    imgPath: string;
    companyName: string;
}
export declare const createCover: ({ version, imgPath, companyName }: IHeaderProps) => Paragraph[];
export declare const coverSections: ({ version, imgPath, companyName }: IHeaderProps) => ISectionOptions;
export {};
