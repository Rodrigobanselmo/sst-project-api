interface IHeaderFooterProps {
    version: string;
    chapter: string;
    logoPath: string;
}
export declare const headerAndFooter: ({ version, chapter, logoPath, }: IHeaderFooterProps) => {
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
export {};
