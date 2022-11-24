import { PaginationQueryDto } from './../../../../shared/dto/pagination.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateProfessionalDto, FindProfessionalsDto, UpdateProfessionalDto } from '../../dto/professional.dto';
import { ProfessionalEntity } from '../../entities/professional.entity';
export declare class ProfessionalRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create({ inviteId, roles, councils, ...data }: Omit<CreateProfessionalDto & {
        roles?: string[];
    }, 'sendEmail' | 'userId'>, companyId: string, options?: Partial<Prisma.ProfessionalCreateArgs>): Promise<ProfessionalEntity>;
    update({ id, inviteId, councils, ...data }: Omit<UpdateProfessionalDto, 'sendEmail' | 'userId'>, options?: Partial<Prisma.ProfessionalUpdateArgs>): Promise<ProfessionalEntity>;
    findByCompanyId(query: Partial<FindProfessionalsDto>, pagination: PaginationQueryDto, options?: Prisma.ProfessionalFindManyArgs): Promise<{
        data: ProfessionalEntity[];
        count: number;
    }>;
    findCouncilByCompanyId(query: Partial<FindProfessionalsDto>, pagination: PaginationQueryDto, options?: Prisma.ProfessionalFindManyArgs): Promise<{
        data: ProfessionalEntity[];
        count: number;
    }>;
    findFirstNude(options?: Prisma.ProfessionalFindFirstArgs): Promise<ProfessionalEntity>;
}
