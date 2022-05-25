import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { AwsSesProvider } from '../../../../../shared/providers/MailProvider/implementations/AwsSes/AwsSesProvider';
import { InviteUserDto } from '../../../dto/invite-user.dto';
import { InviteUsersEntity } from '../../../entities/invite-users.entity';
import { InviteUsersRepository } from '../../../repositories/implementations/InviteUsersRepository';
import { UsersRepository } from '../../../repositories/implementations/UsersRepository';
export declare class InviteUsersService {
    private readonly inviteUsersRepository;
    private readonly usersRepository;
    private readonly dateProvider;
    private readonly mailProvider;
    constructor(inviteUsersRepository: InviteUsersRepository, usersRepository: UsersRepository, dateProvider: DayJSProvider, mailProvider: AwsSesProvider);
    execute(inviteUserDto: InviteUserDto): Promise<InviteUsersEntity>;
}
