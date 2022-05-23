import { UsersRepository } from '../../../../modules/users/repositories/implementations/UsersRepository';
import { DayJSProvider } from '../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { EtherealMailProvider } from '../../../../shared/providers/MailProvider/implementations/Ethereal/EtherealMailProvider';
import { RefreshTokensRepository } from '../../repositories/implementations/RefreshTokensRepository';
export declare class SendForgotPassMailService {
    private readonly usersRepository;
    private readonly refreshTokensRepository;
    private readonly mailProvider;
    private readonly dateProvider;
    constructor(usersRepository: UsersRepository, refreshTokensRepository: RefreshTokensRepository, mailProvider: EtherealMailProvider, dateProvider: DayJSProvider);
    execute(email: string): Promise<void>;
}
