import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { CreateProfessionalResponsibleDto, FindProfessionalResponsibleDto, UpdateProfessionalResponsibleDto } from '../../dto/professional-responsible.dto';
import { ProfessionalResponsibleEntity } from '../../entities/professional-responsible.entity';
export declare class ProfessionalResponsibleRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCompanyDto: CreateProfessionalResponsibleDto): Promise<ProfessionalResponsibleEntity>;
    update({ id, ...createCompanyDto }: UpdateProfessionalResponsibleDto): Promise<ProfessionalResponsibleEntity>;
    find(query: Partial<FindProfessionalResponsibleDto>, pagination: PaginationQueryDto, options?: Prisma.ProfessionalCouncilResponsibleFindManyArgs): Promise<{
        data: ProfessionalResponsibleEntity[];
        count: number;
    }>;
    findNude(options?: Prisma.ProfessionalCouncilResponsibleFindManyArgs): Promise<ProfessionalResponsibleEntity[]>;
    findFirstNude(options?: Prisma.ProfessionalCouncilResponsibleFindFirstArgs): Promise<ProfessionalResponsibleEntity>;
    delete(id: number): Promise<ProfessionalResponsibleEntity>;
}
