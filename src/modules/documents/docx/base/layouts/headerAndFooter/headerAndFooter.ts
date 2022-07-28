import { sectionProperties } from '../../config/styles';
import { createFooter } from './footer';
import { createHeader } from './header';

export interface IHeaderFooterProps {
  version: string;
  footerText: string;
  logoPath: string;
  consultantLogoPath: string;
}

export const headerAndFooter = ({
  version,
  footerText,
  logoPath,
  consultantLogoPath,
}: IHeaderFooterProps) => {
  return {
    footers: createFooter({
      footerText,
      version,
      consultantLogoPath,
    }),
    headers: createHeader({
      path: logoPath,
    }),
    properties: sectionProperties,
  };
};
