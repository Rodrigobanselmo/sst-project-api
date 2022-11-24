import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateExamsRiskDto, FindExamRiskDto, UpdateExamRiskDto, UpsertManyExamsRiskDto } from '../../dto/exam-risk.dto';
import { ExamRiskEntity } from '../../entities/examRisk.entity';
export declare class ExamRiskRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create({ ...createExamsRiskDto }: CreateExamsRiskDto): Promise<ExamRiskEntity>;
    update({ id, companyId, ...createExamsRiskDto }: UpdateExamRiskDto): Promise<ExamRiskEntity>;
    find(query: Partial<FindExamRiskDto>, pagination: PaginationQueryDto, options?: Prisma.ExamToRiskFindManyArgs): Promise<{
        data: ExamRiskEntity[];
        count: number;
    }>;
    createMany({ companyId, data }: UpsertManyExamsRiskDto): Promise<void>;
    upsertMany({ companyId, data }: UpsertManyExamsRiskDto): Promise<ExamRiskEntity[]>;
    findNude(options?: Prisma.ExamToRiskFindManyArgs): Promise<ExamRiskEntity[]>;
}
