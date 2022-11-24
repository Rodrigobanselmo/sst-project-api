import { GenerateSource } from '.prisma/client';
import { StatusEnum } from '@prisma/client';
export declare class GenerateSourceEntity implements GenerateSource {
    id: string;
    riskId: string;
    name: string;
    companyId: string;
    system: boolean;
    status: StatusEnum;
    created_at: Date;
    deleted_at: Date | null;
    constructor(partial: Partial<GenerateSourceEntity>);
}
