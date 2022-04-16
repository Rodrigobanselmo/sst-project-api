import { Controller, Get } from '@nestjs/common';
import { User } from 'src/shared/decorators/user.decorator';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';

import { FindAllHierarchyService } from '../../services/hierarchy/find-all-hierarchies/find-all-hierarchies.service';

@Controller('hierarchy')
export class HierarchyController {
  constructor(
    private readonly findAllHierarchyService: FindAllHierarchyService,
  ) {}

  @Get('/:companyId?')
  FindAllAvailable(@User() userPayloadDto: UserPayloadDto) {
    return this.findAllHierarchyService.execute(userPayloadDto);
  }
}
