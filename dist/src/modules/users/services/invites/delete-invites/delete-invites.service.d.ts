import { DeleteInviteDto } from '../../../dto/delete-invite.dto';
import { InviteUsersRepository } from '../../../repositories/implementations/InviteUsersRepository';
export declare class DeleteInvitesService {
    private readonly inviteUsersRepository;
    constructor(inviteUsersRepository: InviteUsersRepository);
    execute({ companyId, id }: DeleteInviteDto): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
