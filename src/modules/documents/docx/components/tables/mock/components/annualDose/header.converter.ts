import { palette } from '../../../../../../../../shared/constants/palette';
import { headerTableProps } from '../../elements/header';
import { borderStyle } from '../../../../../base/config/styles';

export const NewTopHeader = (): headerTableProps[] => {
  const header: headerTableProps[] = [];

  header[0] = {
    text: 'LIMITES DE DOSES ANUAIS',
    size: 10,
    columnSpan: 4,
    borders: borderStyle(palette.common.white.string, {}),
  };
  return header;
};

export const NewHeader = (): headerTableProps[] => {
  const header: headerTableProps[] = [];

  header[0] = {
    text: 'Grandeza',
    size: 25,
    borders: borderStyle(palette.common.white.string, {
      right: { size: 15 } as any,
      bottom: { size: 15 } as any,
    }),
  };
  header[1] = {
    text: 'Órgão',
    size: 15,
    borders: borderStyle(palette.common.white.string, {
      bottom: { size: 15 } as any,
    }),
  };
  header[2] = {
    text: 'Indivíduo Ocupacionalmente Exposto',
    size: 40,
    borders: borderStyle(palette.common.white.string, {
      bottom: { size: 15 } as any,
    }),
  };
  header[3] = {
    text: 'Indivíduo do Público',
    size: 25,
    borders: borderStyle(palette.common.white.string, {
      bottom: { size: 15 } as any,
    }),
  };
  return header;
};
