import { ISectionOptions, Paragraph } from 'docx';
interface ITextProps {
    x?: number;
    y?: number;
    boxX?: number;
    boxY?: number;
    size?: number;
    color?: string;
    bold?: boolean;
}
interface IHeaderProps {
    version: string;
    imgPath: string;
    companyName: string;
    title?: string;
    coverProps?: {
        logoProps?: {
            maxLogoHeight?: number;
            maxLogoWidth?: number;
            x?: number;
            y?: number;
        };
        titleProps?: ITextProps;
        versionProps?: ITextProps;
        companyProps?: ITextProps;
        backgroundImagePath?: string;
    };
}
export declare const createCover: (props: IHeaderProps) => Paragraph[];
export declare const coverSections: (props: IHeaderProps) => ISectionOptions;
export {};
