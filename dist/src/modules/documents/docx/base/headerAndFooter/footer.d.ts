import { Footer } from 'docx';
interface IFooterProps {
    chapter: string;
    version: string;
}
export declare const createFooter: ({ chapter, version }: IFooterProps) => {
    default: Footer;
    first: Footer;
};
export {};
