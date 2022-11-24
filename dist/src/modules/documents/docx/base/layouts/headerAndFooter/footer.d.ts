import { Footer } from 'docx';
interface IFooterProps {
    footerText: string;
    consultantLogoPath: string;
    version: string;
}
export declare const createFooter: ({ footerText, version, consultantLogoPath }: IFooterProps) => {
    default: Footer;
    first: Footer;
};
export {};
