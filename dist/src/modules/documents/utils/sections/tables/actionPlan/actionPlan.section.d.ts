import { PageOrientation, Table } from 'docx';
import { RiskFactorGroupDataEntity } from '../../../../../checklist/entities/riskGroupData.entity';
export declare const actionPlanTableSection: (riskFactorGroupData: RiskFactorGroupDataEntity) => {
    children: Table[];
    properties: {
        page: {
            margin: {
                left: number;
                right: number;
                top: number;
                bottom: number;
            };
            size: {
                orientation: PageOrientation;
            };
        };
    };
};
