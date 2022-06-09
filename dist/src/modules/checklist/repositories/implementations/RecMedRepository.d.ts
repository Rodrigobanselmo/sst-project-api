import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateRecMedDto, UpdateRecMedDto } from '../../dto/rec-med.dto';
import { RecMedEntity } from '../../entities/recMed.entity';
import { IRecMedRepository } from '../IRecMedRepository.types';
export declare class RecMedRepository implements IRecMedRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(createRecMedDto: CreateRecMedDto, system: boolean): Promise<RecMedEntity>;
    update({ id, ...createRecMedDto }: UpdateRecMedDto & {
        id: string;
    }, companyId: string): Promise<RecMedEntity>;
    DeleteByIdSoft(id: string, companyId: string): Promise<RecMedEntity>;
}
