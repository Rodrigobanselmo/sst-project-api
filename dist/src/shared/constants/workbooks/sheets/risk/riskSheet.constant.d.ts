import { RiskFactorsEnum } from '@prisma/client';
import { ITableSchema } from '../../../../../shared/providers/ExcelProvider/models/IExcelProvider.types';
import { RiskSheetEnum } from './riskSheet.enum';
export interface IRiskSheet {
    name: string;
    id: RiskSheetEnum;
    columns: ITableSchema[];
    type: RiskFactorsEnum;
}
export declare const riskSheetConstant: Record<RiskSheetEnum, IRiskSheet>;
