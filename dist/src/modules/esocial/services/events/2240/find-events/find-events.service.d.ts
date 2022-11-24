import { PrismaService } from './../../../../../../prisma/prisma.service';
import { ICompanyOptions } from './../../../../../../shared/providers/ESocialProvider/models/IESocialMethodProvider';
import { HomogeneousGroup } from '@prisma/client';
import { ESocialSendEnum } from '../../../../../../shared/constants/enum/esocial';
import { UserPayloadDto } from '../../../../../../shared/dto/user-payload.dto';
import { DayJSProvider } from '../../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { ESocialEventProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider';
import { ESocialMethodsProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialMethodsProvider';
import { CompanyRepository } from '../../../../../company/repositories/implementations/CompanyRepository';
import { EmployeeRepository } from '../../../../../company/repositories/implementations/EmployeeRepository';
import { FindEvents2240Dto } from '../../../../dto/event.dto';
import { CompanyEntity } from './../../../../../company/entities/company.entity';
import { HierarchyEntity } from './../../../../../company/entities/hierarchy.entity';
import { RiskFactorDataEntity } from './../../../../../sst/entities/riskData.entity';
import { RiskRepository } from './../../../../../sst/repositories/implementations/RiskRepository';
import { IBreakPointPPP, IEmployee2240Data, IPriorRiskData } from './../../../../interfaces/event-2240';
export declare class FindEvents2240ESocialService {
    private readonly eSocialEventProvider;
    private readonly eSocialMethodsProvider;
    private readonly employeeRepository;
    private readonly companyRepository;
    private readonly riskRepository;
    private readonly dayjsProvider;
    private readonly prisma;
    private end;
    private start;
    constructor(eSocialEventProvider: ESocialEventProvider, eSocialMethodsProvider: ESocialMethodsProvider, employeeRepository: EmployeeRepository, companyRepository: CompanyRepository, riskRepository: RiskRepository, dayjsProvider: DayJSProvider, prisma: PrismaService);
    execute({ skip, take, ...query }: FindEvents2240Dto, user: UserPayloadDto): Promise<{
        data: any[];
        count: number;
        error: {
            message: string;
        };
    } | {
        data: {
            doneDate: Date;
            errors: {
                message: string;
            }[];
            employee: import("../../../../../company/entities/employee.entity").EmployeeEntity;
            type: ESocialSendEnum;
            risks: string[];
            xml: string;
        }[];
        count: number;
        error?: undefined;
    }>;
    findEmployee2240(company: CompanyEntity): Promise<IEmployee2240Data[]>;
    getRiskData(company: CompanyEntity, homoTree: Record<string, HomogeneousGroup>): Promise<Record<string, RiskFactorDataEntity[]>>;
    getHomoTree(company: CompanyEntity): Promise<Record<string, HomogeneousGroup>>;
    getHierarchyTree(company: CompanyEntity): Promise<Record<string, HierarchyEntity>>;
    getEmployeesData(company: CompanyEntity, hierarchyTree: Record<string, HierarchyEntity>, homoRiskDataTree: Record<string, RiskFactorDataEntity[]>): Promise<IEmployee2240Data[]>;
    getCompany(companyId: string, options?: ICompanyOptions): Promise<{
        cert: import("../../../../entities/companyCert.entity").CompanyCertEntity;
        company: CompanyEntity;
    }>;
    onGetRisks: (riskData: RiskFactorDataEntity[]) => IPriorRiskData[];
    onGetSector: (id: string, hierarchyTree: Record<string, HierarchyEntity>) => HierarchyEntity;
    onGetDate: (date: Date | null | number) => Date;
    onGetStringDate: (date: Date | number) => string;
    isDateBetween: (date: Date | null, startDate: Date | null, endDate: Date | null) => boolean;
    isDateAfterEndDate: (testDate: Date | null, endDate: Date | null) => boolean;
    isDateBeforeStartDate: (testDate: Date | null, startDate: Date | null) => boolean;
    createTimelinePPPSnapshot: (riskData: RiskFactorDataEntity[], breakPoint: Record<string, IBreakPointPPP>) => void;
    cutTimeline: (riskData: RiskFactorDataEntity[], endDates: Date[], startDates: Date[]) => {
        timeline: RiskFactorDataEntity[];
        breakPoint: Record<string, IBreakPointPPP>;
    };
}
