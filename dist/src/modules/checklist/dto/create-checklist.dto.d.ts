import { StatusEnum } from '@prisma/client';
import { ChecklistDataDto } from './checklist-data';
export declare class CreateChecklistDto {
    name: string;
    companyId: string;
    status?: StatusEnum;
    data?: ChecklistDataDto;
}
