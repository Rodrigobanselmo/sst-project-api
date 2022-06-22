import { sectionProperties } from '../../config/styles';
import { createFooter } from './footer';
import { createHeader } from './header';

export interface IHeaderFooterProps {
  version: string;
  footerText: string;
  logoPath: string;
}

export const headerAndFooter = ({
  version,
  footerText,
  logoPath,
}: IHeaderFooterProps) => {
  return {
    footers: createFooter({
      footerText,
      version,
    }),
    headers: createHeader({
      path: logoPath,
    }),
    properties: sectionProperties,
  };
};
