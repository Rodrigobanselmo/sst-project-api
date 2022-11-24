import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';
import { PrismaService } from './../../../../../prisma/prisma.service';
import { RiskGroupDataRepository } from '../../../../sst/repositories/implementations/RiskGroupDataRepository';
import { HierarchyEntity } from './../../../entities/hierarchy.entity';
import { WorkspaceEntity } from './../../../entities/workspace.entity';
import { HierarchyRepository } from './../../../repositories/implementations/HierarchyRepository';
import { HomoGroupRepository } from './../../../repositories/implementations/HomoGroupRepository';
export declare class CopyCompanyService {
    private readonly companyRepository;
    private readonly prisma;
    private readonly hierarchyRepository;
    private readonly homoGroupRepository;
    private readonly riskGroupDataRepository;
    constructor(companyRepository: CompanyRepository, prisma: PrismaService, hierarchyRepository: HierarchyRepository, homoGroupRepository: HomoGroupRepository, riskGroupDataRepository: RiskGroupDataRepository);
    execute(companyCopyFromId: string, riskGroupFromId: string, user: UserPayloadDto): Promise<{}>;
    getCommonHierarchy(targetHierarchies: HierarchyEntity[], fromHierarchies: HierarchyEntity[]): Promise<{
        equalHierarchy: Record<string, HierarchyEntity[]>;
        equalWorkspace: Record<string, WorkspaceEntity>;
    }>;
}
