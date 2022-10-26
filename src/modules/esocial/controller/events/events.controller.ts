import { Public } from './../../../../shared/decorators/public.decorator';
import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SendBatchESocialService } from '../../services/events/send-batch/send-batch.service';

import { FindAllTable27Service } from '../../services/tables/find-all-27.service';

@ApiTags('events')
@Controller('esocial/events')
export class ESocialEventController {
  constructor(
    private readonly sendBatchESocialService: SendBatchESocialService,
    private readonly findAllTable27Service: FindAllTable27Service,
  ) {}

  @Post()
  find() {
    return this.findAllTable27Service.execute();
  }

  @Public()
  @Post('send-batch')
  sendBatch() {
    return this.sendBatchESocialService.execute();
  }
}
