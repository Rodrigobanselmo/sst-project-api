import { PrismaService } from '../../../../prisma/prisma.service';
import { CompanyEntity } from '../../entities/company.entity';
import { WorkspaceDto } from '../../dto/workspace.dto';
import { WorkspaceEntity } from '../../entities/workspace.entity';
interface IWorkspaceCompany extends WorkspaceDto {
    companyId?: string;
}
export declare class WorkspaceRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create({ address, companyId, ...workspaceDto }: IWorkspaceCompany): Promise<CompanyEntity>;
    findByCompany(companyId: string): Promise<WorkspaceEntity[]>;
}
export {};
