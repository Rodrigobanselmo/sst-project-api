import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateHomoGroupDto, UpdateHomoGroupDto } from '../../dto/homoGroup';
import { HomoGroupEntity } from '../../entities/homoGroup.entity';
export declare class HomoGroupRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create({ hierarchies, ...updateHomoGroup }: CreateHomoGroupDto, companyId: string): Promise<HomoGroupEntity>;
    update({ id, hierarchies, ...updateHomoGroup }: UpdateHomoGroupDto): Promise<HomoGroupEntity>;
    deleteById(id: string): Promise<void>;
    findHomoGroupByCompanyAndId(id: string, companyId: string): Promise<HomoGroupEntity>;
    findHomoGroupByCompany(companyId: string): Promise<HomoGroupEntity[]>;
}
