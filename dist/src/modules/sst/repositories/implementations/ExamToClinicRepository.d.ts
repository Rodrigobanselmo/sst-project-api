import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { FindExamToClinicDto, UpsertExamToClinicDto, UpsertManyExamToClinicDto } from '../../dto/exam-to-clinic.dto';
import { ExamToClinicEntity } from '../../entities/examToClinic';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
export declare class ExamToClinicRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create({ ...createExamToClinicDto }: UpsertExamToClinicDto): Promise<ExamToClinicEntity>;
    update({ id, ...createExamToClinicDto }: UpsertExamToClinicDto & {
        id: number;
        endDate?: Date;
    }): Promise<ExamToClinicEntity>;
    upsert({ examId, companyId, startDate, groupId, ...createExamToClinicDto }: UpsertExamToClinicDto): Promise<ExamToClinicEntity>;
    createMany({ companyId, data }: UpsertManyExamToClinicDto): Promise<void>;
    findNude(options: Prisma.ExamToClinicFindManyArgs): Promise<ExamToClinicEntity[]>;
    find(query: Partial<FindExamToClinicDto>, pagination: PaginationQueryDto, options?: Prisma.ExamToClinicFindManyArgs): Promise<{
        data: ExamToClinicEntity[];
        count: number;
    }>;
}
