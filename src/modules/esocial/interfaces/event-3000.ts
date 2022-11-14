import { EmployeeESocialEventTypeEnum } from '@prisma/client';

import { IEventProps } from './event-batch';

export enum EnumTpEventEnum {
  S2210 = 'S-2210',
  S2220 = 'S-2220',
  S2240 = 'S-2240',
}

export const mapTpEvent: Record<
  EmployeeESocialEventTypeEnum,
  EnumTpEventEnum | null
> = {
  [EmployeeESocialEventTypeEnum.CAT_2210]: EnumTpEventEnum.S2210,
  [EmployeeESocialEventTypeEnum.EXAM_2220]: EnumTpEventEnum.S2220,
  [EmployeeESocialEventTypeEnum.RISK_2240]: EnumTpEventEnum.S2240,
};

export const mapInverseTpEvent: Record<
  EnumTpEventEnum,
  EmployeeESocialEventTypeEnum
> = {
  [EnumTpEventEnum.S2210]: EmployeeESocialEventTypeEnum.CAT_2210,
  [EnumTpEventEnum.S2220]: EmployeeESocialEventTypeEnum.EXAM_2220,
  [EnumTpEventEnum.S2240]: EmployeeESocialEventTypeEnum.RISK_2240,
};

export interface IEvent3000Props extends Omit<IEventProps, 'ideVinculo'> {
  id: string;
  infoExclusao: {
    tpEvento: EnumTpEventEnum;
    nrRecEvt: string;
    ideTrabalhador: {
      cpfTrab: string;
    };
  };
}
