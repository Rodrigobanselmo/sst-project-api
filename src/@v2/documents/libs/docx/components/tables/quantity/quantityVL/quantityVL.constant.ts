import { borderStyleGlobal } from '../../../../base/config/styles';
import { palette } from '../../../../constants/palette';
import { headerTableProps } from './elements/header';

export enum QuantityVLColumnEnum {
  ORIGIN,
  AREN,
  RO_AREN,
  VDVR,
  RO_VDVR,
}

export const NewQuantityVLHeader = (): headerTableProps[] => {
  const header: headerTableProps[] = [];

  header[QuantityVLColumnEnum.ORIGIN] = {
    text: 'Origem',
    size: 50,
    borders: borderStyleGlobal(palette.common.white.string, {
      right: { size: 15 } as any,
      bottom: { size: 15 } as any,
    }),
  };
  header[QuantityVLColumnEnum.AREN] = {
    text: `aren (m/s^2)`,
    size: 20,
    borders: borderStyleGlobal(palette.common.white.string, {
      bottom: { size: 15 } as any,
    }),
  };
  header[QuantityVLColumnEnum.RO_AREN] = {
    text: 'RO',
    size: 30,
    borders: borderStyleGlobal(palette.common.white.string, {
      bottom: { size: 15 } as any,
      left: { size: 15 } as any,
    }),
  };

  return header;
};
