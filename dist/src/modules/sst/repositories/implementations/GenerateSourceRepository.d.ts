import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateGenerateSourceDto, UpdateGenerateSourceDto } from '../../dto/generate-source.dto';
import { GenerateSourceEntity } from '../../entities/generateSource.entity';
import { IGenerateSourceRepository } from '../IGenerateSourceRepository.types';
export declare class GenerateSourceRepository implements IGenerateSourceRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create({ recMeds, ...createGenerateSourceDto }: CreateGenerateSourceDto, system: boolean): Promise<GenerateSourceEntity>;
    update({ id, recMeds, riskId, ...createGenerateSourceDto }: UpdateGenerateSourceDto & {
        id: string;
        riskId?: string;
    }, system: boolean, companyId: string): Promise<GenerateSourceEntity>;
    findById(id: string, companyId: string): Promise<GenerateSourceEntity>;
    DeleteByCompanyAndIdSoft(id: string, companyId: string): Promise<GenerateSourceEntity>;
    DeleteByIdSoft(id: string): Promise<GenerateSourceEntity>;
}
