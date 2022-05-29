import { PrismaService } from '../../../../prisma/prisma.service';
import { InviteUserDto } from '../../dto/invite-user.dto';
import { InviteUsersEntity } from '../../entities/invite-users.entity';
import { IInviteUsersRepository } from '../IInviteUsersRepository.types';
import { Prisma } from '.prisma/client';
export declare class InviteUsersRepository implements IInviteUsersRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(inviteUserDto: InviteUserDto, expires_date: Date): Promise<InviteUsersEntity>;
    findByCompanyIdAndEmail(companyId: string, email: string): Promise<InviteUsersEntity | undefined>;
    findById(id: string): Promise<InviteUsersEntity | undefined>;
    findAllByCompanyId(companyId: string): Promise<InviteUsersEntity[]>;
    deleteByCompanyIdAndEmail(companyId: string, email: string): Promise<Prisma.BatchPayload>;
    deleteAllOldInvites(currentDate: Date): Promise<Prisma.BatchPayload>;
}
