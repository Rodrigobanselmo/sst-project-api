import { sectionProperties } from '../styles';
import { createFooter } from './footer';
import { createHeader } from './header';

interface IHeaderFooterProps {
  version: string;
  chapter: string;
  logoPath: string;
}

export const headerAndFooter = ({
  version,
  chapter,
  logoPath,
}: IHeaderFooterProps) => {
  return {
    footers: createFooter({
      chapter,
      version,
    }),
    headers: createHeader({
      path: logoPath,
    }),
    properties: sectionProperties,
  };
};
