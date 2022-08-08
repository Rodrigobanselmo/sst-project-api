import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FindAllTable27Service } from '../../services/tables/find-all-27';

@ApiTags('tables')
@Controller('esocial/table-27')
export class TablesController {
  constructor(private readonly findAllTable27Service: FindAllTable27Service) {}

  @Get()
  find() {
    return this.findAllTable27Service.execute();
  }
}
