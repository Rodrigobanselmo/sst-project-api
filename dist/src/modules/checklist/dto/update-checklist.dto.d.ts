import { StatusEnum } from '@prisma/client';
import { ChecklistDataDto } from './checklist-data';
export declare class UpdateChecklistDto {
    name: string;
    companyId: string;
    status?: StatusEnum;
    data: ChecklistDataDto;
}
