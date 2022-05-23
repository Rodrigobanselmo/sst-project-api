import { InviteUserDto } from '../../dto/invite-user.dto';
import { DeleteExpiredInvitesService } from '../../services/invites/delete-expired-invites/delete-expired-invites.service';
import { DeleteInvitesService } from '../../services/invites/delete-invites/delete-invites.service';
import { InviteUsersService } from '../../services/invites/invite-users/invite-users.service';
import { DeleteInviteDto } from './../../dto/delete-invite.dto';
export declare class InvitesController {
    private readonly inviteUsersService;
    private readonly deleteInvitesService;
    private readonly deleteExpiredInvitesService;
    constructor(inviteUsersService: InviteUsersService, deleteInvitesService: DeleteInvitesService, deleteExpiredInvitesService: DeleteExpiredInvitesService);
    invite(inviteUserDto: InviteUserDto): Promise<import("../../entities/invite-users.entity").InviteUsersEntity>;
    delete(deleteInviteDto: DeleteInviteDto): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteAll(): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
