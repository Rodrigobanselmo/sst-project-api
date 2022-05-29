import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { InviteUsersRepository } from '../../../repositories/implementations/InviteUsersRepository';
export declare class DeleteExpiredInvitesService {
    private readonly inviteUsersRepository;
    private readonly dateProvider;
    constructor(inviteUsersRepository: InviteUsersRepository, dateProvider: DayJSProvider);
    execute(): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
