import { Controller, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';

import { DeleteAllExpiredRefreshTokensService } from '../service/delete-all-expired-refresh-tokens.service';

@Controller('auth')
export class DeleteAllExpiredRefreshTokensController {
  constructor(
    private readonly deleteAllExpiredRefreshTokensService: DeleteAllExpiredRefreshTokensService,
  ) {}

  @ApiBearerAuth()
  @Delete('expired-refresh-tokens')
  @ApiOkResponse()
  deleteAll() {
    return this.deleteAllExpiredRefreshTokensService.execute();
  }
}
