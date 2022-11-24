import { EmployeeESocialEventTypeEnum } from '@prisma/client';
import { IEventProps } from './event-batch';
export declare enum EnumTpEventEnum {
    S2210 = "S-2210",
    S2220 = "S-2220",
    S2240 = "S-2240"
}
export declare const mapTpEvent: Record<EmployeeESocialEventTypeEnum, EnumTpEventEnum | null>;
export declare const mapInverseTpEvent: Record<EnumTpEventEnum, EmployeeESocialEventTypeEnum>;
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
