import { Body, Controller, Post, Res } from '@nestjs/common';

import { PermissionEnum } from '../../../shared/constants/enum/authorization';
import { Permissions } from '../../../shared/decorators/permissions.decorator';
import { User } from '../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../shared/dto/user-payload.dto';
import { UploadPgrActionPlanDto } from '../dto/document.dto';
import { PgrActionPlanUploadTableService } from '../services/document/action-plan/upload-action-plan-table.service';

@Controller('documents/pgr')
export class DocumentsPgrController {
  constructor(private readonly pgrActionPlanUploadTableService: PgrActionPlanUploadTableService) {}

  @Permissions(
    {
      code: PermissionEnum.PGR,
      isMember: true,
      isContract: true,
      crud: true,
    },
    {
      code: PermissionEnum.ACTION_PLAN,
      isMember: true,
      isContract: true,
    },
  )
  @Post('action-plan')
  async uploadPGRActionPlanDoc(@Res() res, @User() userPayloadDto: UserPayloadDto, @Body() upsertPgrDto: UploadPgrActionPlanDto) {
    const { buffer: file, fileName } = await this.pgrActionPlanUploadTableService.execute(upsertPgrDto, userPayloadDto);

    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(file);
  }
}
