import { palette } from '../../../../../../../../shared/constants/palette';
import { headerTableProps } from '../../elements/header';
import { borderStyleGlobal } from '../../../../../base/config/styles';

export const NewHeader = (): headerTableProps[] => {
  const header: headerTableProps[] = [];

  header[0] = {
    text: 'DPG',
    size: 10,
    borders: borderStyleGlobal(palette.common.white.string, {
      right: { size: 15 } as any,
      bottom: { size: 15 } as any,
    }),
  };
  header[1] = {
    text: 'NA',
    size: 10,
    borders: borderStyleGlobal(palette.common.white.string, {
      bottom: { size: 15 } as any,
    }),
  };

  return header;
};
