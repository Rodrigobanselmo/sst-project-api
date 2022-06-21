import { Footer } from 'docx';
interface IFooterProps {
    footerText: string;
    version: string;
}
export declare const createFooter: ({ footerText, version }: IFooterProps) => {
    default: Footer;
    first: Footer;
};
export {};
