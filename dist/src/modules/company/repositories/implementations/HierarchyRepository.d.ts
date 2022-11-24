import { PaginationQueryDto } from './../../../../shared/dto/pagination.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateHierarchyDto, FindHierarchyDto, UpdateHierarchyDto, UpdateSimpleManyHierarchyDto } from '../../dto/hierarchy';
import { HierarchyEntity } from '../../entities/hierarchy.entity';
export declare class HierarchyRepository {
    private prisma;
    constructor(prisma: PrismaService);
    upsertMany(upsertHierarchyMany: (CreateHierarchyDto & {
        id: string;
        workspaceIds: string[];
    })[], companyId: string, ghoNames?: Record<string, string>): Promise<HierarchyEntity[]>;
    updateSimpleMany(upsertHierarchyMany: (UpdateSimpleManyHierarchyDto & {
        id: string;
    })[], companyId: string): Promise<HierarchyEntity[]>;
    update({ companyId: _, workspaceIds, parentId, id, children, name, employeesIds, ...updateHierarchy }: UpdateHierarchyDto, companyId: string): Promise<HierarchyEntity>;
    upsert({ companyId: _, id, workspaceIds, parentId, children, name, employeesIds, ...upsertHierarchy }: CreateHierarchyDto & {
        id?: string;
    }, companyId: string): Promise<HierarchyEntity>;
    upsertSubOffice({ companyId, id, workspaceIds, parentId, name, employeesIds, historyIds, ...upsertHierarchy }: Omit<CreateHierarchyDto, 'children' | 'ghoName'> & {
        id?: string;
        historyIds?: number[];
    }): Promise<HierarchyEntity>;
    deleteById(id: string): Promise<void>;
    findAllHierarchyByCompanyAndId(id: string, companyId: string): Promise<HierarchyEntity>;
    findAllHierarchyByCompany(companyId: string, { returnWorkspace, ...options }?: {
        include?: Prisma.HierarchyInclude;
        returnWorkspace?: boolean;
    }): Promise<HierarchyEntity[]>;
    findAllDataHierarchyByCompany(companyId: string, workspaceId: string, options?: {
        include?: Prisma.HierarchyInclude;
    }): Promise<HierarchyEntity[]>;
    findById(id: string, companyId: string): Promise<HierarchyEntity>;
    findByIdWithParent(id: string, companyId: string): Promise<HierarchyEntity>;
    find(query: Partial<FindHierarchyDto>, pagination: PaginationQueryDto, options?: Prisma.HierarchyFindManyArgs): Promise<{
        data: HierarchyEntity[];
        count: number;
    }>;
    findFirstNude(options?: Prisma.HierarchyFindFirstArgs): Promise<HierarchyEntity>;
}
