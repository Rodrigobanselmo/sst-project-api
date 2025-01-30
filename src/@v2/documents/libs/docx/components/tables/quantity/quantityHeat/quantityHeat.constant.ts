import { borderStyleGlobal } from '../../../../base/config/styles';
import { palette } from '../../../../constants/palette';
import { headerTableProps } from './elements/header';

export enum QuantityHeatColumnEnum {
  ORIGIN,
  IBTUG,
  LT,
  RO,
}

export const NewQuantityHeatHeader = (): headerTableProps[] => {
  const header: headerTableProps[] = [];

  header[QuantityHeatColumnEnum.ORIGIN] = {
    text: 'Origem',
    size: 50,
    borders: borderStyleGlobal(palette.common.white.string, {
      right: { size: 15 } as any,
      bottom: { size: 15 } as any,
    }),
  };
  header[QuantityHeatColumnEnum.IBTUG] = {
    text: `IBUTG ºC`,
    size: 10,
    borders: borderStyleGlobal(palette.common.white.string, {
      bottom: { size: 15 } as any,
    }),
  };
  header[QuantityHeatColumnEnum.LT] = {
    text: `LT ºC`,
    size: 10,
    borders: borderStyleGlobal(palette.common.white.string, {
      bottom: { size: 15 } as any,
    }),
  };
  header[QuantityHeatColumnEnum.RO] = {
    text: 'RO',
    size: 30,
    borders: borderStyleGlobal(palette.common.white.string, {
      left: { size: 15 } as any,
      bottom: { size: 15 } as any,
    }),
  };

  return header;
};
