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
    constructor(partial: Partial<GenerateSourceEntity>);
}
