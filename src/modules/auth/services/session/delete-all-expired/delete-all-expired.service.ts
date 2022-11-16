import { Injectable } from '@nestjs/common';

import { RefreshTokensRepository } from '../../../repositories/implementations/RefreshTokensRepository';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';

@Injectable()
export class DeleteAllExpiredService {
  constructor(private readonly refreshTokensRepository: RefreshTokensRepository, private readonly dateProvider: DayJSProvider) {}

  async execute() {
    const currentDate = this.dateProvider.dateNow();
    return this.refreshTokensRepository.deleteAllOldTokens(currentDate);
  }
}
