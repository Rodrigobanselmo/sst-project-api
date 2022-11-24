import { ExamEntity } from '../../entities/exam.entity';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateExamDto, FindExamDto, UpdateExamDto, UpsertExamDto } from '../../dto/exam.dto';
import { Prisma } from '@prisma/client';
export declare class ExamRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create({ ...createExamDto }: CreateExamDto & {
        system: boolean;
    }): Promise<ExamEntity>;
    update({ id, companyId, ...createExamDto }: UpdateExamDto & {
        id: number;
    }): Promise<ExamEntity>;
    upsertMany(upsertDtoMany: UpsertExamDto[]): Promise<ExamEntity[]>;
    find(query: Partial<FindExamDto>, pagination: PaginationQueryDto, options?: Prisma.ExamFindManyArgs): Promise<{
        data: ExamEntity[];
        count: number;
    }>;
    findNude(options?: Prisma.ExamFindManyArgs): Promise<{
        data: ExamEntity[];
        count: number;
    }>;
    findAll(): Promise<ExamEntity[]>;
    DeleteByIdSoft(id: number): Promise<ExamEntity>;
    DeleteByCompanyAndIdSoft(id: number, companyId: string): Promise<ExamEntity>;
}
