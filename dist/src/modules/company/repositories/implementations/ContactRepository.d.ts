import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PaginationQueryDto } from '../../../../shared/dto/pagination.dto';
import { CreateContactDto, FindContactDto, UpdateContactDto } from '../../dto/contact.dto';
import { ContactEntity } from '../../entities/contact.entity';
export declare class ContactRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCompanyDto: CreateContactDto): Promise<ContactEntity>;
    update({ id, companyId, ...createCompanyDto }: UpdateContactDto): Promise<ContactEntity>;
    findAllByCompany(query: Partial<FindContactDto>, pagination: PaginationQueryDto, options?: Prisma.ContactFindManyArgs): Promise<{
        data: ContactEntity[];
        count: number;
    }>;
    findNude(options?: Prisma.ContactFindManyArgs): Promise<ContactEntity[]>;
    findFirstNude(options?: Prisma.ContactFindFirstArgs): Promise<ContactEntity>;
    delete(id: number, companyId: string): Promise<ContactEntity>;
}
