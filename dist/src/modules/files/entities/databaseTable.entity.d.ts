import { CompanyEntity } from './../../company/entities/company.entity';
import { DatabaseTable, StatusEnum } from '@prisma/client';
export declare class DatabaseTableEntity implements DatabaseTable {
    id: number;
    name: string;
    version: number;
    companyId: string;
    system: boolean;
    status: StatusEnum;
    created_at: Date;
    updated_at: Date;
    company?: Partial<CompanyEntity>;
    constructor(partial: Partial<DatabaseTableEntity>);
}
