import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateHierarchyDto, UpdateHierarchyDto } from '../../dto/hierarchy';
import { HierarchyEntity } from '../../entities/hierarchy.entity';
export declare class HierarchyRepository {
    private prisma;
    constructor(prisma: PrismaService);
    upsertMany(upsertHierarchyMany: (CreateHierarchyDto & {
        id: string;
    })[], companyId: string): Promise<HierarchyEntity[]>;
    update({ companyId: _, workplaceId, parentId, id, children, ...updateHierarchy }: UpdateHierarchyDto, companyId: string): Promise<HierarchyEntity>;
    upsert({ companyId: _, id, workplaceId, parentId, children, ...upsertHierarchy }: CreateHierarchyDto & {
        id?: string;
    }, companyId: string): Promise<HierarchyEntity>;
    deleteById(id: string): Promise<void>;
    findAllHierarchyByCompanyAndId(id: string, companyId: string): Promise<HierarchyEntity>;
    findAllHierarchyByCompany(companyId: string, options?: {
        include?: Prisma.HierarchyInclude;
    }): Promise<HierarchyEntity[]>;
}
