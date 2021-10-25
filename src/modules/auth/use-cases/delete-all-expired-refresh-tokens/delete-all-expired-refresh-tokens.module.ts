import { Module } from '@nestjs/common';

import { DayJSProvider } from '../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { RefreshTokensRepository } from './../../repositories/implementations/RefreshTokensRepository';
import { DeleteAllExpiredRefreshTokensController } from './controller/delete-all-expired-refresh-tokens.controller';
import { DeleteAllExpiredRefreshTokensService } from './service/delete-all-expired-refresh-tokens.service';

@Module({
  imports: [],
  controllers: [DeleteAllExpiredRefreshTokensController],
  providers: [
    DayJSProvider,
    DeleteAllExpiredRefreshTokensService,
    RefreshTokensRepository,
  ],
})
export class DeleteAllExpiredRefreshTokensModule {}
