import { Injectable } from '@nestjs/common';

import { DayJSProvider } from '../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { RefreshTokensRepository } from '../../repositories/implementations/RefreshTokensRepository';

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
