import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { AlertDto, AlertSendDto } from '../../dto/alert.dto';
import { DeleteAlertService } from '../../services/alert/delete-alert/delete-alert.service';
import { FindOneAlertService } from '../../services/alert/find-alert/find-alert.service';
import { FindAlertsByTimeService } from '../../services/alert/find-alerts-by-time/find-alerts-by-time.service';
import { SendAlertService } from '../../services/alert/send-alert/send-alert.service';
import { UpsertAlertService } from '../../services/alert/upsert-alert/upsert-alert.service';

@ApiTags('alert')
@Controller('alert/:companyId')
export class AlertController {
  constructor(
    private readonly upsertAlertService: UpsertAlertService,
    private readonly sendAlertService: SendAlertService,
    private readonly findOneAlertService: FindOneAlertService,
    private readonly deleteAlertService: DeleteAlertService,
    private readonly findAlertsByTimeService: FindAlertsByTimeService,
  ) {}

  @Permissions({
    code: PermissionEnum.ALERT,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Get()
  find(@User() userPayloadDto: UserPayloadDto) {
    return this.findOneAlertService.execute(userPayloadDto.targetCompanyId);
  }

  @Permissions({
    code: PermissionEnum.ALERT,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Post()
  upsert(@Body() body: AlertDto, @User() userPayloadDto: UserPayloadDto) {
    return this.upsertAlertService.execute(body, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.ALERT,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Post('send')
  send(@Body() body: AlertSendDto, @User() userPayloadDto: UserPayloadDto) {
    return this.sendAlertService.execute(body, userPayloadDto.targetCompanyId);
  }

  // @Permissions({
  //   code: PermissionEnum.ALERT,
  //   isContract: true,
  //   isMember: true,
  //   crud: true,
  // })
  @Post('run-cron')
  sendCron() {
    return this.findAlertsByTimeService.execute();
  }

  @Permissions({
    code: PermissionEnum.ALERT,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Delete('/:id')
  delete(@User() userPayloadDto: UserPayloadDto, @Param('id', ParseIntPipe) id: number) {
    return this.deleteAlertService.execute(id, userPayloadDto);
  }
}
