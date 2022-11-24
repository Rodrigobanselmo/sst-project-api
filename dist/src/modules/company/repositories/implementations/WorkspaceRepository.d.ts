import { PrismaService } from '../../../../prisma/prisma.service';
import { WorkspaceDto } from '../../dto/workspace.dto';
import { WorkspaceEntity } from '../../entities/workspace.entity';
interface IWorkspaceCompany extends WorkspaceDto {
    companyId?: string;
}
export declare class WorkspaceRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create({ address, companyId, ...workspaceDto }: IWorkspaceCompany): Promise<WorkspaceEntity>;
    findById(id: string): Promise<WorkspaceEntity>;
    findByCompany(companyId: string): Promise<WorkspaceEntity[]>;
}
export {};
