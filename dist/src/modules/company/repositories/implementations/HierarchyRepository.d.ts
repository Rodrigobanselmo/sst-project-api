import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateHierarchyDto, UpdateHierarchyDto } from '../../dto/hierarchy';
import { HierarchyEntity } from '../../entities/hierarchy.entity';
export declare class HierarchyRepository {
    private prisma;
    constructor(prisma: PrismaService);
    upsertMany(upsertHierarchyMany: (CreateHierarchyDto & {
        id: string;
    })[], companyId: string, ghoNames?: Record<string, string>): Promise<HierarchyEntity[]>;
    update({ companyId: _, workspaceIds, parentId, id, children, ...updateHierarchy }: UpdateHierarchyDto, companyId: string): Promise<HierarchyEntity>;
    upsert({ companyId: _, id, workspaceIds, parentId, children, ...upsertHierarchy }: CreateHierarchyDto & {
        id?: string;
    }, companyId: string): Promise<HierarchyEntity>;
    deleteById(id: string): Promise<void>;
    findAllHierarchyByCompanyAndId(id: string, companyId: string): Promise<HierarchyEntity>;
    findAllHierarchyByCompany(companyId: string, options?: {
        include?: Prisma.HierarchyInclude;
    }): Promise<HierarchyEntity[]>;
    findAllDataHierarchyByCompany(companyId: string, workspaceId: string, options?: {
        include?: Prisma.HierarchyInclude;
    }): Promise<HierarchyEntity[]>;
}
