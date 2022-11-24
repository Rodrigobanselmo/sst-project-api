import { Prisma, StatusEnum } from '@prisma/client';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { EmployeeEntity } from '../../../../company/entities/employee.entity';
import { EmployeeRepository } from '../../../../company/repositories/implementations/EmployeeRepository';
import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { FindExamHierarchyDto } from '../../../dto/exam.dto';
import { IExamOriginData, IExamEmployeeCheck } from '../../../entities/exam.entity';
import { ExamRepository } from '../../../repositories/implementations/ExamRepository';
import { RiskDataRepository } from '../../../repositories/implementations/RiskDataRepository';
export declare const getValidityInMonths: (employee: EmployeeEntity, examRisk: {
    validityInMonths?: number;
    lowValidityInMonths?: number;
}) => number;
export declare class FindExamByHierarchyService {
    private readonly employeeRepository;
    private readonly examRepository;
    private readonly riskDataRepository;
    private readonly hierarchyRepository;
    private readonly dayjs;
    private employee;
    private clinicExamCloseToExpire;
    constructor(employeeRepository: EmployeeRepository, examRepository: ExamRepository, riskDataRepository: RiskDataRepository, hierarchyRepository: HierarchyRepository, dayjs: DayJSProvider);
    execute(user: Pick<UserPayloadDto, 'targetCompanyId'>, query: FindExamHierarchyDto): Promise<{
        data: {
            exam: {
                id: string;
                name: string;
                isAttendance: boolean;
            };
            origins: IExamOriginData[];
        }[];
    }>;
    checkIfSkipEmployee(examRisk: IExamEmployeeCheck, employee: EmployeeEntity): boolean;
    checkExpiredDate(examRisk: IExamOriginData, employee: EmployeeEntity): {
        closeToExpired?: undefined;
        expiredDate?: undefined;
        status?: undefined;
    } | {
        closeToExpired: boolean;
        expiredDate: Date;
        status: StatusEnum;
    };
    checkCloseToExpiredDate(examsDataReturn: {
        exam: {
            id: string;
            name: string;
            isAttendance: boolean;
        };
        origins: IExamOriginData[];
    }[]): {
        exam: {
            id: string;
            name: string;
            isAttendance: boolean;
        };
        origins: IExamOriginData[];
    }[];
    onGetAllExams(companyId: string, options?: {
        examsTypes?: Prisma.ExamToRiskWhereInput;
        onlyAttendance?: boolean;
    }): Promise<{
        data: import("../../../entities/exam.entity").ExamEntity[];
        count: number;
    }>;
}
