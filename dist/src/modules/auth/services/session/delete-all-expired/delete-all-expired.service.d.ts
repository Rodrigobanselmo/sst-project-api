import { RefreshTokensRepository } from '../../../repositories/implementations/RefreshTokensRepository';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
export declare class DeleteAllExpiredService {
    private readonly refreshTokensRepository;
    private readonly dateProvider;
    constructor(refreshTokensRepository: RefreshTokensRepository, dateProvider: DayJSProvider);
    execute(): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
