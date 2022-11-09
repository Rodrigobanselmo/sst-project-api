import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FindEvents2220ESocialService } from '../../../../../modules/esocial/services/events/2220/find-events/find-events.service';
import { User } from '../../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from './../../../../../shared/dto/user-payload.dto';
import { Event2220Dto, FindEvents2220Dto } from './../../../dto/event.dto';
import { SendEvents2220ESocialService } from './../../../services/events/2220/send-events/send-events.service';

@ApiTags('events-2220')
@Controller('esocial/events/2220')
export class ESocialEvent2220Controller {
  constructor(
    private readonly sendEvents2220ESocialService: SendEvents2220ESocialService,
    private readonly findEvents2220ESocialService: FindEvents2220ESocialService,
  ) {}

  // @Permissions({
  //   code: PermissionEnum.ESOCIAL,
  //   isContract: true,
  //   isMember: true,
  //   crud: true,
  // })
  @Get(':companyId?')
  find(
    @Query() query: FindEvents2220Dto,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.findEvents2220ESocialService.execute(query, userPayloadDto);
  }

  // @Permissions({
  //   code: PermissionEnum.ESOCIAL,
  //   isContract: true,
  //   isMember: true,
  //   crud: true,
  // })
  @Post()
  async sendBatch(
    @Res() res,
    @Body() body: Event2220Dto,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    // return this.sendEvents2220ESocialService.execute(body, userPayloadDto);
    const { fileStream, fileName } =
      await this.sendEvents2220ESocialService.execute(body, userPayloadDto);

    if (!fileStream) return res.status(200).send('Lotes enviados com sucessos');

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${fileName}.zip`,
    );
    fileStream.on('error', function (e) {
      res.status(500).send(e);
    });

    fileStream.pipe(res);
  }
}
