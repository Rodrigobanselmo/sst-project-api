import { sectionProperties } from '../../config/styles';
import { createFooter } from './footer';
import { createHeader } from './header';

export interface IHeaderFooterProps {
  version: string;
  footerText: string;
  logoPath: string | null;
  consultantLogoPath: string;
  title: string;
}

export const headerAndFooter = ({ title, version, footerText, logoPath, consultantLogoPath }: IHeaderFooterProps) => {
  return {
    footers: createFooter({
      footerText,
      version,
      consultantLogoPath,
      title,
    }),
    headers: createHeader({
      path: logoPath!,
    }),
    properties: sectionProperties,
  };
};
