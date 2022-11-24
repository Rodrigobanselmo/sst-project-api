import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateHomoGroupDto, FindHomogeneousGroupDto, UpdateHierarchyHomoGroupDto, UpdateHomoGroupDto } from '../../dto/homoGroup';
import { HomoGroupEntity } from '../../entities/homoGroup.entity';
export declare class HomoGroupRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create({ hierarchies, endDate, startDate, ...createHomoGroupDto }: CreateHomoGroupDto, companyId: string): Promise<HomoGroupEntity>;
    update({ id, hierarchies, endDate, startDate, ...updateHomoGroup }: UpdateHomoGroupDto): Promise<HomoGroupEntity>;
    updateHierarchyHomo({ ids, workspaceId, endDate, startDate }: UpdateHierarchyHomoGroupDto): Promise<Prisma.BatchPayload>;
    findHomoGroupByCompanyAndId(id: string, companyId: string, options?: Prisma.HomogeneousGroupFindFirstArgs): Promise<HomoGroupEntity>;
    find(query: Partial<FindHomogeneousGroupDto>, pagination: PaginationQueryDto, options?: Prisma.HomogeneousGroupFindManyArgs): Promise<{
        data: HomoGroupEntity[];
        count: number;
    }>;
    findFirstNude(options?: Prisma.HomogeneousGroupFindFirstArgs): Promise<HomoGroupEntity>;
    findById(id: string, companyId: string, options?: Prisma.HomogeneousGroupFindFirstArgs): Promise<HomoGroupEntity>;
    findHomoGroupByCompanyAndName(name: string, companyId: string): Promise<HomoGroupEntity>;
    findHomoGroupByCompany(companyId: string, options?: {
        include?: Prisma.HomogeneousGroupInclude;
        where?: Prisma.HomogeneousGroupWhereInput;
    }): Promise<HomoGroupEntity[]>;
    private getHomoGroupData;
    deleteById(id: string): Promise<void>;
}
