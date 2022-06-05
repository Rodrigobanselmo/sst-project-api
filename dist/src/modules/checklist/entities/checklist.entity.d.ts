import { Checklist, StatusEnum } from '.prisma/client';
import { ChecklistDataEntity } from './checklistData.entity';
export declare class ChecklistEntity implements Checklist {
    id: number;
    name: string;
    companyId: string;
    system: boolean;
    created_at: Date;
    checklistData?: ChecklistDataEntity;
    status: StatusEnum;
    constructor(partial: Partial<ChecklistEntity>);
}
