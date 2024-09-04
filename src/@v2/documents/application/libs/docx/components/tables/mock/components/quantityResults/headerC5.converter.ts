import { palette } from '../../../../../constants/palette';
import { headerTableProps } from '../../elements/header';
import { borderStyleGlobal } from '../../../../../base/config/styles';

export const NewHeaderC5 = (headerArray: string[]): headerTableProps[] => {
  const header: headerTableProps[] = [];

  header[0] = {
    text: headerArray[0],
    size: 10,
    borders: borderStyleGlobal(palette.common.white.string, {
      bottom: { size: 15 } as any,
    }),
  };
  header[1] = {
    text: headerArray[1],
    size: 10,
    borders: borderStyleGlobal(palette.common.white.string, {
      bottom: { size: 15 } as any,
      right: { size: 15 } as any,
    }),
  };
  header[2] = {
    text: headerArray[2],
    size: 15,
    borders: borderStyleGlobal(palette.common.white.string, {
      bottom: { size: 15 } as any,
    }),
  };
  header[3] = {
    text: headerArray[3],
    size: 40,
    borders: borderStyleGlobal(palette.common.white.string, {
      bottom: { size: 15 } as any,
    }),
  };
  header[4] = {
    text: headerArray[4],
    size: 25,
    borders: borderStyleGlobal(palette.common.white.string, {
      left: { size: 15 } as any,
      bottom: { size: 15 } as any,
    }),
    columnSpan: 2,
  };
  return header;
};
