import { palette } from '../../../../../../../shared/constants/palette';
import { headerTableProps } from '../elements/header';
import { borderStyle } from '../../../../base/config/styles';

const NewHeader = (): headerTableProps[] => {
  const header: headerTableProps[] = [];

  header[0] = {
    text: 'GRAU',
    size: 10,
    borders: borderStyle(palette.common.white.string, {
      right: { size: 15 } as any,
      bottom: { size: 15 } as any,
    }),
  };
  header[1] = {
    text: 'EFEITOS À SAÚDE (Severidade – NR-01 item 1.5.3.4.4.2.1)',
    size: 90,
    borders: borderStyle(palette.common.white.string, {
      bottom: { size: 15 } as any,
    }),
  };
  return header;
};

export const headerConverter = NewHeader();
