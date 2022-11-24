import { EsocialTable24, RiskFactorsEnum } from '@prisma/client';
export declare class EsocialTable24Entity implements EsocialTable24 {
    id: string;
    name: string;
    group: string;
    type: RiskFactorsEnum;
    isQuantity: boolean;
    constructor(partial: Partial<EsocialTable24Entity>);
}
