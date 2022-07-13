import { borderStyleGlobal } from './../../../../base/config/styles';
import { palette } from '../../../../../../../shared/constants/palette';
import { headerTableProps } from './elements/header';

export enum QuantityNoiseColumnEnum {
  ORIGIN,
  DB,
  RO,
}

export const NewQuantityNoiseHeader = (q = '3'): headerTableProps[] => {
  const header: headerTableProps[] = [];

  header[QuantityNoiseColumnEnum.ORIGIN] = {
    text: 'Origem',
    size: 60,
    borders: borderStyleGlobal(palette.common.white.string, {
      right: { size: 15 } as any,
      bottom: { size: 15 } as any,
    }),
  };
  header[QuantityNoiseColumnEnum.DB] = {
    text: `MVUE q${q} (dB A)`,
    size: 20,
    borders: borderStyleGlobal(palette.common.white.string, {
      bottom: { size: 15 } as any,
    }),
  };
  header[QuantityNoiseColumnEnum.RO] = {
    text: 'RO',
    size: 20,
    borders: borderStyleGlobal(palette.common.white.string, {
      left: { size: 15 } as any,
      bottom: { size: 15 } as any,
    }),
  };

  return header;
};
