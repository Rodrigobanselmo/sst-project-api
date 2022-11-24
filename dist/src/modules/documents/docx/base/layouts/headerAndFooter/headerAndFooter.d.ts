export interface IHeaderFooterProps {
    version: string;
    footerText: string;
    logoPath: string;
    consultantLogoPath: string;
}
export declare const headerAndFooter: ({ version, footerText, logoPath, consultantLogoPath }: IHeaderFooterProps) => {
    footers: {
        default: import("docx").Footer;
        first: import("docx").Footer;
    };
    headers: {
        default: import("docx").Header;
        first: import("docx").Header;
    };
    properties: import("docx").ISectionPropertiesOptions;
};
