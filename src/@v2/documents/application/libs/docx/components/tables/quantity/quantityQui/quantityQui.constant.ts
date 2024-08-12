import { borderStyleGlobal } from '../../../../base/config/styles';
import { palette } from '../../../../../../../shared/constants/palette';
import { headerTableProps } from './elements/header';

export enum QuantityQuiColumnEnum {
  ORIGIN,
  CHEMICAL,
  TYPE,
  UNIT,
  RESULT,
  LEO,
  IJ,
  RO,
}

export const NewQuantityQuiHeader = (): headerTableProps[] => {
  const header: headerTableProps[] = [];

  header[QuantityQuiColumnEnum.ORIGIN] = {
    text: 'Origem',
    size: 17,
    borders: borderStyleGlobal(palette.common.white.string, {
      bottom: { size: 15 } as any,
    }),
  };
  header[QuantityQuiColumnEnum.CHEMICAL] = {
    text: `Agente Químico`,
    size: 18,
    borders: borderStyleGlobal(palette.common.white.string, {
      bottom: { size: 15 } as any,
      right: { size: 15 } as any,
    }),
  };
  header[QuantityQuiColumnEnum.TYPE] = {
    text: `Tipo`,
    size: 10,
    borders: borderStyleGlobal(palette.common.white.string, {
      bottom: { size: 15 } as any,
    }),
  };
  header[QuantityQuiColumnEnum.UNIT] = {
    text: `unidade`,
    size: 10,
    borders: borderStyleGlobal(palette.common.white.string, {
      bottom: { size: 15 } as any,
    }),
  };
  header[QuantityQuiColumnEnum.RESULT] = {
    text: `Resultado da Amostra`,
    size: 10,
    borders: borderStyleGlobal(palette.common.white.string, {
      bottom: { size: 15 } as any,
    }),
  };
  header[QuantityQuiColumnEnum.LEO] = {
    text: `LEO`,
    size: 10,
    borders: borderStyleGlobal(palette.common.white.string, {
      bottom: { size: 15 } as any,
    }),
  };
  header[QuantityQuiColumnEnum.IJ] = {
    text: `Índice de Julgamento`,
    size: 10,
    borders: borderStyleGlobal(palette.common.white.string, {
      bottom: { size: 15 } as any,
      right: { size: 15 } as any,
    }),
  };
  header[QuantityQuiColumnEnum.RO] = {
    text: 'RO',
    size: 15,
    borders: borderStyleGlobal(palette.common.white.string, {
      bottom: { size: 15 } as any,
      left: { size: 15 } as any,
    }),
  };

  return header;
};
