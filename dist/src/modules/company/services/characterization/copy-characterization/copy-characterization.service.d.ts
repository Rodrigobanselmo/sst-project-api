import { CopyCharacterizationDto } from './../../../dto/characterization.dto';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { HierarchyEntity } from '../../../entities/hierarchy.entity';
import { WorkspaceEntity } from '../../../entities/workspace.entity';
import { HomoGroupRepository } from '../../../repositories/implementations/HomoGroupRepository';
export declare class CopyCharacterizationService {
    private readonly prisma;
    private readonly homoGroupRepository;
    constructor(prisma: PrismaService, homoGroupRepository: HomoGroupRepository);
    execute({ companyCopyFromId, workspaceId, characterizationIds }: CopyCharacterizationDto, user: UserPayloadDto): Promise<{}>;
    getCommonHierarchy(targetHierarchies: HierarchyEntity[], fromHierarchies: HierarchyEntity[]): Promise<{
        equalHierarchy: Record<string, HierarchyEntity[]>;
        equalWorkspace: Record<string, WorkspaceEntity>;
    }>;
}
