import { Body, Controller, Post } from '@nestjs/common';
import { Permission } from 'src/shared/constants/authorization';
import { User } from 'src/shared/decorators/user.decorator';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';

import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { CreateChecklistDto } from '../../dto/create-checklist.dto';
import { CreateChecklistService } from '../../services/checklist/create-checklist/create-checklist.service';

@Controller('checklist')
export class ChecklistController {
  constructor(
    private readonly createChecklistService: CreateChecklistService,
  ) {}

  @Post()
  @Permissions({
    code: Permission.CREATE_RISK,
    isMember: true,
    isContract: true,
  })
  create(
    @User() userPayloadDto: UserPayloadDto,
    @Body() createChecklistDto: CreateChecklistDto,
  ) {
    return this.createChecklistService.execute(
      createChecklistDto,
      userPayloadDto,
    );
  }
}
