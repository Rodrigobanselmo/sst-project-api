import { UsersRepository } from '../../../../users/repositories/implementations/UsersRepository';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { SendGridProvider } from '../../../../../shared/providers/MailProvider/implementations/SendGrid/SendGridProvider';
import { RefreshTokensRepository } from '../../../repositories/implementations/RefreshTokensRepository';
export declare class SendForgotPassMailService {
    private readonly usersRepository;
    private readonly refreshTokensRepository;
    private readonly mailProvider;
    private readonly dateProvider;
    constructor(usersRepository: UsersRepository, refreshTokensRepository: RefreshTokensRepository, mailProvider: SendGridProvider, dateProvider: DayJSProvider);
    execute(email: string): Promise<void>;
}
