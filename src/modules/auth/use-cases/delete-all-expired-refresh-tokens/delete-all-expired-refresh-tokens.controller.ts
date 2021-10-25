import { Controller, Delete } from '@nestjs/common';

import { DeleteAllExpiredRefreshTokensService } from './delete-all-expired-refresh-tokens.service';

@Controller('auth')
export class DeleteAllExpiredRefreshTokensController {
  constructor(
    private readonly deleteAllExpiredRefreshTokensService: DeleteAllExpiredRefreshTokensService,
  ) {}

  @Delete('expired-refresh-tokens')
  deleteAll() {
    return this.deleteAllExpiredRefreshTokensService.execute();
  }
}
