import { palette } from '../../../../../constants/palette';
import { headerTableProps } from '../../elements/header';
import { borderStyleGlobal } from '../../../../../base/config/styles';

const NewHeader = (): headerTableProps[] => {
  const header: headerTableProps[] = [];

  header[0] = {
    text: 'GRAU',
    size: 12,
    borders: borderStyleGlobal(palette.common.white.string, {
      right: { size: 15 } as any,
      bottom: { size: 15 } as any,
    }),
  };
  header[1] = {
    text: 'CARACTERÍSTICAS DA EXPOSIÇÃO (Probabilidade)',
    size: 66,
    borders: borderStyleGlobal(palette.common.white.string, {
      bottom: { size: 15 } as any,
      right: { size: 15 } as any,
    }),
  };
  header[2] = {
    text: 'Critérios de Controle',
    size: 22,
    borders: borderStyleGlobal(palette.common.white.string, {
      bottom: { size: 15 } as any,
    }),
  };
  return header;
};

export const headerConverter = NewHeader();
