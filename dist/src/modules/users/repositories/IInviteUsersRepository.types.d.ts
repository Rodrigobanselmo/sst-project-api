import { InviteUsersEntity } from '../entities/invite-users.entity';
import { Prisma } from '.prisma/client';
import { InviteUserDto } from '../dto/invite-user.dto';
interface IInviteUsersRepository {
    create(inviteUserDto: InviteUserDto, expires_date: Date): Promise<InviteUsersEntity>;
    findByCompanyIdAndEmail(companyId: string, email: string): Promise<InviteUsersEntity | undefined>;
    findById(id: string): Promise<InviteUsersEntity | undefined>;
    deleteByCompanyIdAndEmail(companyId: string, email: string): Promise<Prisma.BatchPayload>;
    deleteAllOldInvites(currentDate: Date): Promise<Prisma.BatchPayload>;
}
export { IInviteUsersRepository };
