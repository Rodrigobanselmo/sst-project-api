import { PaginationQueryDto } from './../../../../shared/dto/pagination.dto';
import { PrismaService } from '../../../../prisma/prisma.service';
import { FindInvitesDto, InviteUserDto } from '../../dto/invite-user.dto';
import { InviteUsersEntity } from '../../entities/invite-users.entity';
import { IInviteUsersRepository } from '../IInviteUsersRepository.types';
import { Prisma } from '.prisma/client';
export declare class InviteUsersRepository implements IInviteUsersRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(inviteUserDto: InviteUserDto, expires_date: Date): Promise<InviteUsersEntity>;
    findByCompanyIdAndEmail(companyId: string, email: string): Promise<InviteUsersEntity | undefined>;
    findById(id: string, options?: Partial<Prisma.InviteUsersFindUniqueArgs>): Promise<InviteUsersEntity | undefined>;
    findAllByCompanyId(companyId: string): Promise<InviteUsersEntity[]>;
    findAllByEmail(email: string): Promise<InviteUsersEntity[]>;
    find(query: Partial<FindInvitesDto>, pagination: PaginationQueryDto, options?: Prisma.InviteUsersFindManyArgs): Promise<{
        data: InviteUsersEntity[];
        count: number;
    }>;
    deleteById(companyId: string, id: string): Promise<Prisma.BatchPayload>;
    deleteByCompanyIdAndEmail(companyId: string, email: string): Promise<Prisma.BatchPayload>;
    deleteAllOldInvites(currentDate: Date): Promise<Prisma.BatchPayload>;
}
