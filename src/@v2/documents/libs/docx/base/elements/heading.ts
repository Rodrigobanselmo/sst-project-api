import { HeadingLevel, IParagraphOptions, Paragraph } from 'docx';

const baseHeading = (
  text: string,
  heading: (typeof HeadingLevel)[keyof typeof HeadingLevel],
  options?: IParagraphOptions,
) =>
  new Paragraph({
    text: text,
    heading,
    ...options,
  });

export const title = (text: string, options?: IParagraphOptions) =>
  new Paragraph({
    text: text,
    heading: HeadingLevel.TITLE,
    pageBreakBefore: true,
    ...options,
  });

export const h1 = (text: string, options?: IParagraphOptions) => baseHeading(text, HeadingLevel.HEADING_1, options);

export const h2 = (text: string, options?: IParagraphOptions) => baseHeading(text, HeadingLevel.HEADING_2, options);

export const h3 = (text: string, options?: IParagraphOptions) => baseHeading(text, HeadingLevel.HEADING_3, options);

export const h4 = (text: string, options?: IParagraphOptions) => baseHeading(text, HeadingLevel.HEADING_4, options);

export const h5 = (text: string, options?: IParagraphOptions) => baseHeading(text, HeadingLevel.HEADING_5, options);

export const h6 = (text: string, options?: IParagraphOptions) => baseHeading(text, HeadingLevel.HEADING_6, options);
