import { UpdateChecklistDto } from './../../dto/update-checklist.dto';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateChecklistDto } from '../../dto/create-checklist.dto';
import { ChecklistEntity } from '../../entities/checklist.entity';
import { IChecklistRepository } from '../IChecklistRepository.types';
export declare class ChecklistRepository implements IChecklistRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create({ data, ...createChecklistDto }: CreateChecklistDto, system: boolean): Promise<ChecklistEntity>;
    findAllAvailable(companyId?: string): Promise<ChecklistEntity[]>;
    findChecklistData(id: number): Promise<ChecklistEntity>;
    update(id: number, { data: { json }, companyId, ...updateChecklistDto }: UpdateChecklistDto): Promise<ChecklistEntity>;
}
