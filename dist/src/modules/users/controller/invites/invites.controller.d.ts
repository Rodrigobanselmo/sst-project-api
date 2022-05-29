import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';
import { InviteUserDto } from '../../dto/invite-user.dto';
import { DeleteExpiredInvitesService } from '../../services/invites/delete-expired-invites/delete-expired-invites.service';
import { DeleteInvitesService } from '../../services/invites/delete-invites/delete-invites.service';
import { FindAllByCompanyIdService } from '../../services/invites/find-by-companyId/find-by-companyId.service';
import { InviteUsersService } from '../../services/invites/invite-users/invite-users.service';
import { DeleteInviteDto } from './../../dto/delete-invite.dto';
export declare class InvitesController {
    private readonly inviteUsersService;
    private readonly findAllByCompanyIdService;
    private readonly deleteInvitesService;
    private readonly deleteExpiredInvitesService;
    constructor(inviteUsersService: InviteUsersService, findAllByCompanyIdService: FindAllByCompanyIdService, deleteInvitesService: DeleteInvitesService, deleteExpiredInvitesService: DeleteExpiredInvitesService);
    findAllByCompany(user: UserPayloadDto): Promise<import("../../entities/invite-users.entity").InviteUsersEntity[]>;
    invite(inviteUserDto: InviteUserDto): Promise<import("../../entities/invite-users.entity").InviteUsersEntity>;
    delete(deleteInviteDto: DeleteInviteDto): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteAll(): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
