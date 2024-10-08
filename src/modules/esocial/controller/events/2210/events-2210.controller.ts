import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';

import { FindEvents2220ESocialService } from '../../../services/events/2220/find-events/find-events.service';
import { User } from '../../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { Event2210Dto, Event2220Dto, FindEvents2210Dto, FindEvents2220Dto } from '../../../dto/event.dto';
import { SendEvents2220ESocialService } from '../../../services/events/2220/send-events/send-events.service';
import { FindEvents2210ESocialService } from '../../../../../modules/esocial/services/events/2210/find-events/find-events-2210.service';
import { SendEvents2210ESocialService } from '../../../../../modules/esocial/services/events/2210/send-events/send-events-2210.service';
import { Permissions } from '../../../../../shared/decorators/permissions.decorator';
import { PermissionEnum } from '../../../../../shared/constants/enum/authorization';

@Controller('esocial/events/2210')
export class ESocialEvent2210Controller {
  constructor(
    private readonly sendEvents2210ESocialService: SendEvents2210ESocialService,
    private readonly findEvents2210ESocialService: FindEvents2210ESocialService,
  ) {}

  @Permissions({
    code: PermissionEnum.ESOCIAL,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Get(':companyId?')
  find(@Query() query: FindEvents2210Dto, @User() userPayloadDto: UserPayloadDto) {
    return this.findEvents2210ESocialService.execute(query, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.ESOCIAL,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Post()
  async sendBatch(@Res() res, @Body() body: Event2210Dto, @User() userPayloadDto: UserPayloadDto) {
    const { fileStream, fileName } = await this.sendEvents2210ESocialService.execute(body, userPayloadDto);

    if (!fileStream) return res.status(200).send('Lotes enviados com sucessos');

    res.setHeader('Content-Disposition', `attachment; filename=${fileName}.zip`);
    fileStream.on('error', function (e) {
      res.status(500).send(e);
    });

    fileStream.pipe(res);
  }
}
