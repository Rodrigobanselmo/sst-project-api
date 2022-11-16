import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FindEvents2240ESocialService } from '../../../services/events/2240/find-events/find-events.service';
import { User } from '../../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { Event2240Dto, FindEvents2240Dto } from '../../../dto/event.dto';
import { SendEvents2220ESocialService } from '../../../services/events/2220/send-events/send-events.service';

@ApiTags('events-2240')
@Controller('esocial/events/2240')
export class ESocialEvent2240Controller {
  constructor(private readonly sendEvents2220ESocialService: SendEvents2220ESocialService, private readonly findEvents2240ESocialService: FindEvents2240ESocialService) {}

  // @Permissions({
  //   code: PermissionEnum.ESOCIAL,
  //   isContract: true,
  //   isMember: true,
  //   crud: true,
  // })
  @Get(':companyId?')
  find(@Query() query: FindEvents2240Dto, @User() userPayloadDto: UserPayloadDto) {
    return this.findEvents2240ESocialService.execute(query, userPayloadDto);
  }

  // @Permissions({
  //   code: PermissionEnum.ESOCIAL,
  //   isContract: true,
  //   isMember: true,
  //   crud: true,
  // })
  @Post()
  async sendBatch(@Res() res, @Body() body: Event2240Dto, @User() userPayloadDto: UserPayloadDto) {
    // return this.sendEvents2220ESocialService.execute(body, userPayloadDto);
    const { fileStream, fileName } = await this.sendEvents2220ESocialService.execute(body, userPayloadDto);

    if (!fileStream) return res.status(200).send('Lotes enviados com sucessos');

    res.setHeader('Content-Disposition', `attachment; filename=${fileName}.zip`);
    fileStream.on('error', function (e) {
      res.status(500).send(e);
    });

    fileStream.pipe(res);
  }
}
