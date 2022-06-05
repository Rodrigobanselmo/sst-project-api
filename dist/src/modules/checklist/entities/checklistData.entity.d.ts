import { ChecklistData, Prisma } from '.prisma/client';
export declare class ChecklistDataEntity implements ChecklistData {
    checklistId: number;
    json: Prisma.JsonValue;
    constructor(partial: Partial<ChecklistDataEntity>);
    companyId: string;
}
