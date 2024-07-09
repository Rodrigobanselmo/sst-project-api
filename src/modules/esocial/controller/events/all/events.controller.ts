import { FetchESocialBatchEventsService } from './../../../services/events/all/fetch-batch-events/fetch-batch-events.service';
import { FindESocialBatchDto } from './../../../dto/esocial-batch.dto';
import { FindESocialEventService } from './../../../services/events/all/find-events/find-events.service';
import { FindESocialEventDto } from './../../../dto/esocial-event.dto';
import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { Public } from '../../../../../shared/decorators/public.decorator';
import { User } from '../../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { pfxFileFilter } from '../../../../../shared/utils/filters/pfx.filters';
import { AddCertDto } from '../../../dto/add-cert.dto';
import { AddCertificationESocialService } from '../../../services/events/all/add-certificate/add-certificate.service';
import { SendBatchESocialService } from '../../../services/events/all/send-batch/send-batch.service';
import { FindESocialBatchService } from '../../../../../modules/esocial/services/events/all/find-batch/find-batch.service';
import { FetchOneESocialBatchEventsService } from '../../../../../modules/esocial/services/events/all/fetch-one-batch-event/fetch-one-batch-event.service';

@Controller('esocial/events/all')
export class ESocialEventController {
  constructor(
    private readonly addCertificationESocialService: AddCertificationESocialService,
    private readonly sendBatchESocialService: SendBatchESocialService,
    private readonly findESocialEventService: FindESocialEventService,
    private readonly findESocialBatchService: FindESocialBatchService,
    private readonly fetchESocialBatchEventsService: FetchESocialBatchEventsService,
    private readonly fetchOneESocialBatchEventsService: FetchOneESocialBatchEventsService,
  ) {}

  @Post('certificate')
  @UseInterceptors(FileInterceptor('file', { fileFilter: pfxFileFilter }))
  addCert(@UploadedFile() file: Express.Multer.File, @User() user: UserPayloadDto, @Body() body: AddCertDto) {
    return this.addCertificationESocialService.execute(file, body, user);
  }

  @Public()
  @Post('send-batch')
  sendBatch() {
    return this.sendBatchESocialService.execute();
  }

  @Public()
  @Post('fetch-batch')
  fetch() {
    return this.fetchESocialBatchEventsService.execute();
  }

  @Public()
  @Post('fetch-batch/:protoId')
  fetchOne(@Param('protoId') protoId: string) {
    return this.fetchOneESocialBatchEventsService.execute(protoId);
  }

  @Get('events/:companyId?')
  findEvents(@User() userPayloadDto: UserPayloadDto, @Query() query: FindESocialEventDto) {
    return this.findESocialEventService.execute(query, userPayloadDto);
  }

  @Get('batch/:companyId?')
  findBatch(@User() userPayloadDto: UserPayloadDto, @Query() query: FindESocialBatchDto) {
    return this.findESocialBatchService.execute(query, userPayloadDto);
  }
}
