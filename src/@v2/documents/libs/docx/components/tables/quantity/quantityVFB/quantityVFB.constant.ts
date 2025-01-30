import { borderStyleGlobal } from '../../../../base/config/styles';
import { palette } from '../../../../constants/palette';
import { headerTableProps } from './elements/header';

export enum QuantityVFBColumnEnum {
  ORIGIN,
  AREN,
  RO_AREN,
  VDVR,
  RO_VDVR,
}

export const NewQuantityVFBHeader = (): headerTableProps[] => {
  const header: headerTableProps[] = [];

  header[QuantityVFBColumnEnum.ORIGIN] = {
    text: 'Origem',
    size: 40,
    borders: borderStyleGlobal(palette.common.white.string, {
      right: { size: 15 } as any,
      bottom: { size: 15 } as any,
    }),
  };
  header[QuantityVFBColumnEnum.AREN] = {
    text: `aren (m/s^2)`,
    size: 10,
    borders: borderStyleGlobal(palette.common.white.string, {
      bottom: { size: 15 } as any,
    }),
  };
  header[QuantityVFBColumnEnum.RO_AREN] = {
    text: 'RO do aren',
    size: 20,
    borders: borderStyleGlobal(palette.common.white.string, {
      bottom: { size: 15 } as any,
      right: { size: 15 } as any,
    }),
  };
  header[QuantityVFBColumnEnum.VDVR] = {
    text: `VDVR (m/s^1.75)`,
    size: 10,
    borders: borderStyleGlobal(palette.common.white.string, {
      bottom: { size: 15 } as any,
    }),
  };
  header[QuantityVFBColumnEnum.RO_VDVR] = {
    text: 'RO do VDVR',
    size: 20,
    borders: borderStyleGlobal(palette.common.white.string, {
      bottom: { size: 15 } as any,
    }),
  };

  return header;
};
