import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FindAllTable27Service } from '../../services/tables/find-all-27.service';

@ApiTags('events')
@Controller('esocial/events')
export class ESocialEventController {
  constructor(private readonly findAllTable27Service: FindAllTable27Service) {}

  @Post()
  find() {
    return this.findAllTable27Service.execute();
  }
}
