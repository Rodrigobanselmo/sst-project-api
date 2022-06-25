import { palette } from '../../../../../../../shared/constants/palette';
import { headerTableProps } from '../elements/header';
import { borderStyle } from '../../../../base/config/styles';

export const NewHeader = (headerArray: string[]): headerTableProps[] => {
  const header: headerTableProps[] = [];

  header[0] = {
    text: headerArray[0],
    size: 28,
    borders: borderStyle(palette.common.white.string, {
      right: { size: 15 } as any,
      bottom: { size: 15 } as any,
    }),
  };
  header[1] = {
    text: headerArray[1],
    size: 15,
    borders: borderStyle(palette.common.white.string, {
      bottom: { size: 15 } as any,
    }),
  };
  header[2] = {
    text: headerArray[2],
    size: 40,
    borders: borderStyle(palette.common.white.string, {
      bottom: { size: 15 } as any,
    }),
  };
  header[3] = {
    text: headerArray[3],
    size: 15,
    borders: borderStyle(palette.common.white.string, {
      left: { size: 15 } as any,
      bottom: { size: 15 } as any,
    }),
  };
  return header;
};
