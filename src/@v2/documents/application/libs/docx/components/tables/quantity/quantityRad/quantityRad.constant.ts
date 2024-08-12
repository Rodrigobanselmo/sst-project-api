import { borderStyleGlobal } from '../../../../base/config/styles';
import { palette } from '../../../../../../../shared/constants/palette';
import { headerTableProps } from './elements/header';

export enum QuantityRadColumnEnum {
  ORIGIN,
  BODY_PART,
  EMPLOYEE,
  RO_EMPLOYEE,
  CUSTOMER,
  RO_CUSTOMER,
}

export const NewQuantityRadHeader = (): headerTableProps[] => {
  const header: headerTableProps[] = [];

  header[QuantityRadColumnEnum.ORIGIN] = {
    text: 'Origem',
    size: 25,
    borders: borderStyleGlobal(palette.common.white.string, {
      right: { size: 15 } as any,
      bottom: { size: 15 } as any,
    }),
  };
  header[QuantityRadColumnEnum.BODY_PART] = {
    text: 'Órgão',
    size: 15,
    borders: borderStyleGlobal(palette.common.white.string, {
      bottom: { size: 15 } as any,
    }),
  };
  header[QuantityRadColumnEnum.EMPLOYEE] = {
    text: `Indivíduo\nOcupacionalmente\nExposto`,
    size: 15,
    borders: borderStyleGlobal(palette.common.white.string, {
      bottom: { size: 15 } as any,
    }),
  };
  header[QuantityRadColumnEnum.RO_EMPLOYEE] = {
    text: 'RO do indivíduo',
    size: 15,
    borders: borderStyleGlobal(palette.common.white.string, {
      bottom: { size: 15 } as any,
      right: { size: 15 } as any,
    }),
  };
  header[QuantityRadColumnEnum.CUSTOMER] = {
    text: `Indivíduo do Público`,
    size: 15,
    borders: borderStyleGlobal(palette.common.white.string, {
      bottom: { size: 15 } as any,
    }),
  };
  header[QuantityRadColumnEnum.RO_CUSTOMER] = {
    text: 'RO do público',
    size: 15,
    borders: borderStyleGlobal(palette.common.white.string, {
      bottom: { size: 15 } as any,
    }),
  };

  return header;
};
