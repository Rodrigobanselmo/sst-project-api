import { CompanyEntity } from './../../company/entities/company.entity';
import { UserEntity } from './../../users/entities/user.entity';
import { EmployeeESocialBatch, StatusEnum, EmployeeESocialEventTypeEnum } from '@prisma/client';
import { EmployeeESocialEventEntity } from './employeeEsocialEvent.entity';
export declare class EmployeeESocialBatchEntity implements EmployeeESocialBatch {
    id: number;
    created_at: Date;
    updated_at: Date;
    environment: number;
    status: StatusEnum;
    userTransmissionId: number;
    companyId: string;
    protocolId: string;
    type: EmployeeESocialEventTypeEnum;
    company?: CompanyEntity;
    userTransmission?: UserEntity;
    events?: EmployeeESocialEventEntity[];
    response: any;
    constructor(partial: Partial<EmployeeESocialBatchEntity>);
}
