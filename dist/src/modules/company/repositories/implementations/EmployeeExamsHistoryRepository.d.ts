import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { DayJSProvider } from '../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { CreateEmployeeExamHistoryDto, FindEmployeeExamHistoryDto, UpdateEmployeeExamHistoryDto, UpdateManyScheduleExamDto } from '../../dto/employee-exam-history';
import { EmployeeExamsHistoryEntity } from '../../entities/employee-exam-history.entity';
export declare class EmployeeExamsHistoryRepository {
    private prisma;
    private dayjs;
    constructor(prisma: PrismaService, dayjs: DayJSProvider);
    create({ examsData, hierarchyId, ...createData }: CreateEmployeeExamHistoryDto & {
        userDoneId?: number;
        userScheduleId?: number;
    }): Promise<Prisma.BatchPayload>;
    update({ id, examsData, hierarchyId, ...updateData }: UpdateEmployeeExamHistoryDto & {
        fileUrl?: string;
        sendEvent?: boolean;
    }): Promise<EmployeeExamsHistoryEntity>;
    updateMany(updateManyDto: Pick<UpdateManyScheduleExamDto, 'data'>): Promise<EmployeeExamsHistoryEntity[]>;
    updateManyNude(options: Prisma.EmployeeExamsHistoryUpdateManyArgs): Promise<void>;
    updateByIds(options: Prisma.EmployeeExamsHistoryUpdateManyArgs): Promise<void>;
    find(query: Partial<FindEmployeeExamHistoryDto> & {
        userCompany?: string;
    }, pagination: PaginationQueryDto, { where: whereOptions, ...options }?: Prisma.EmployeeExamsHistoryFindManyArgs): Promise<{
        data: EmployeeExamsHistoryEntity[];
        count: number;
    }>;
    findNude(options?: Prisma.EmployeeExamsHistoryFindManyArgs): Promise<EmployeeExamsHistoryEntity[]>;
    countNude(options?: Prisma.EmployeeExamsHistoryCountArgs): Promise<number>;
    findFirstNude(options?: Prisma.EmployeeExamsHistoryFindFirstArgs): Promise<EmployeeExamsHistoryEntity>;
    findUniqueNude(options: Prisma.EmployeeExamsHistoryFindUniqueArgs): Promise<EmployeeExamsHistoryEntity>;
    delete(id: number): Promise<EmployeeExamsHistoryEntity>;
}
