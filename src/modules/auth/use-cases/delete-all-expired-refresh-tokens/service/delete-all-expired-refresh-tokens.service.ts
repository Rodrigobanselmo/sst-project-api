import { Injectable } from '@nestjs/common';
import { RefreshTokensRepository } from 'src/modules/auth/repositories/implementations/RefreshTokensRepository';
import { DayJSProvider } from 'src/shared/providers/DateProvider/implementations/DayJSProvider';

@Injectable()
export class DeleteAllExpiredRefreshTokensService {
  constructor(
    private readonly refreshTokensRepository: RefreshTokensRepository,
    private readonly dateProvider: DayJSProvider,
  ) {}

  async execute() {
    const currentDate = this.dateProvider.dateNow();
    return this.refreshTokensRepository.deleteAllOldTokens(currentDate);
  }
}
