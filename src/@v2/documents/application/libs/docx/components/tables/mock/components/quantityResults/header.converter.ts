import { palette } from '../../../../../constants/palette';
import { headerTableProps } from '../../elements/header';
import { borderStyleGlobal } from '../../../../../base/config/styles';

export const NewHeader = (headerArray: string[]): headerTableProps[] => {
  const header: headerTableProps[] = [];

  header[0] = {
    text: headerArray[0],
    size: 28,
    borders: borderStyleGlobal(palette.common.white.string, {
      right: { size: 15 } as any,
      bottom: { size: 15 } as any,
    }),
  };
  header[1] = {
    text: headerArray[1],
    size: 15,
    borders: borderStyleGlobal(palette.common.white.string, {
      bottom: { size: 15 } as any,
    }),
  };
  header[2] = {
    text: headerArray[2],
    size: 40,
    borders: borderStyleGlobal(palette.common.white.string, {
      bottom: { size: 15 } as any,
    }),
  };
  header[3] = {
    text: headerArray[3],
    size: 15,
    borders: borderStyleGlobal(palette.common.white.string, {
      left: { size: 15 } as any,
      bottom: { size: 15 } as any,
    }),
  };
  return header;
};
