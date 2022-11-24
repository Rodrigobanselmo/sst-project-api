import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { FindInvitesDto, InviteUserDto } from '../../dto/invite-user.dto';
import { DeleteExpiredInvitesService } from '../../services/invites/delete-expired-invites/delete-expired-invites.service';
import { DeleteInvitesService } from '../../services/invites/delete-invites/delete-invites.service';
import { FindAvailableService } from '../../services/invites/find-available/find-available.service';
import { FindAllByCompanyIdService } from '../../services/invites/find-by-companyId/find-by-companyId.service';
import { FindAllByEmailService } from '../../services/invites/find-by-email/find-by-email.service';
import { FindByTokenService } from '../../services/invites/find-by-token/find-by-token.service';
import { InviteUsersService } from '../../services/invites/invite-users/invite-users.service';
export declare class InvitesController {
    private readonly inviteUsersService;
    private readonly findAllByCompanyIdService;
    private readonly findAllByEmailService;
    private readonly findAvailableService;
    private readonly findByTokenService;
    private readonly deleteInvitesService;
    private readonly deleteExpiredInvitesService;
    constructor(inviteUsersService: InviteUsersService, findAllByCompanyIdService: FindAllByCompanyIdService, findAllByEmailService: FindAllByEmailService, findAvailableService: FindAvailableService, findByTokenService: FindByTokenService, deleteInvitesService: DeleteInvitesService, deleteExpiredInvitesService: DeleteExpiredInvitesService);
    findAllByCompany(user: UserPayloadDto): Promise<import("../../entities/invite-users.entity").InviteUsersEntity[]>;
    findAllByEmail(email: string, user: UserPayloadDto): Promise<import("../../entities/invite-users.entity").InviteUsersEntity[]>;
    findByToken(tokenId: string): Promise<import("../../entities/invite-users.entity").InviteUsersEntity>;
    find(user: UserPayloadDto, query: FindInvitesDto): Promise<{
        data: import("../../entities/invite-users.entity").InviteUsersEntity[];
        count: number;
    }>;
    invite(inviteUserDto: InviteUserDto, user: UserPayloadDto): Promise<import("../../entities/invite-users.entity").InviteUsersEntity>;
    delete(id: string, user: UserPayloadDto): Promise<string>;
    deleteAll(): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
