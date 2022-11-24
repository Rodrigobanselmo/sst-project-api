import { CompanyRepository } from './../../../../company/repositories/implementations/CompanyRepository';
import { UserPayloadDto } from './../../../../../shared/dto/user-payload.dto';
import { AuthGroupRepository } from './../../../../auth/repositories/implementations/AuthGroupRepository';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { SendGridProvider } from '../../../../../shared/providers/MailProvider/implementations/SendGrid/SendGridProvider';
import { InviteUserDto } from '../../../dto/invite-user.dto';
import { InviteUsersEntity } from '../../../entities/invite-users.entity';
import { InviteUsersRepository } from '../../../repositories/implementations/InviteUsersRepository';
import { UsersRepository } from '../../../repositories/implementations/UsersRepository';
export declare class InviteUsersService {
    private readonly inviteUsersRepository;
    private readonly usersRepository;
    private readonly authGroupRepository;
    private readonly dateProvider;
    private readonly companyRepository;
    private readonly mailProvider;
    constructor(inviteUsersRepository: InviteUsersRepository, usersRepository: UsersRepository, authGroupRepository: AuthGroupRepository, dateProvider: DayJSProvider, companyRepository: CompanyRepository, mailProvider: SendGridProvider);
    execute(inviteUserDto: InviteUserDto, userPayloadDto: UserPayloadDto): Promise<InviteUsersEntity>;
}
export declare const inviteNewUser: (mailProvider: SendGridProvider, invite: InviteUsersEntity) => Promise<void>;
