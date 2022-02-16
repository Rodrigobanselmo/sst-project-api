import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Permission } from 'src/shared/constants/authorization';
import { User } from 'src/shared/decorators/user.decorator';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';

import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { CreateChecklistDto } from '../../dto/create-checklist.dto';
import { UpdateChecklistDto } from '../../dto/update-checklist.dto';
import { CreateChecklistService } from '../../services/checklist/create-checklist/create-checklist.service';
import { FindAvailableChecklistService } from '../../services/checklist/find-available-checklist/find-available-checklist.service';
import { FindChecklistDataService } from '../../services/checklist/find-checklist-data/find-checklist-data.service';
import { UpdateChecklistService } from '../../services/checklist/update-checklist/update-checklist.service';

@Controller('checklist')
export class ChecklistController {
  constructor(
    private readonly createChecklistService: CreateChecklistService,
    private readonly findAvailableChecklistService: FindAvailableChecklistService,
    private readonly findChecklistDataService: FindChecklistDataService,
    private readonly updateChecklistService: UpdateChecklistService,
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

  @Get('/:companyId')
  @Permissions({
    code: Permission.CREATE_RISK,
    isMember: true,
    isContract: true,
  })
  findAllAvailable(@Param('companyId') companyId: string) {
    return this.findAvailableChecklistService.execute(companyId);
  }

  @Get('/data/:checklistId')
  @Permissions({
    code: Permission.CREATE_RISK,
    isMember: true,
    isContract: true,
  })
  findChecklistData(@Param('checklistId') checklistId: number) {
    return this.findChecklistDataService.execute(checklistId);
  }

  @Patch('/:checklistId')
  @Permissions({
    code: Permission.CREATE_RISK,
    isMember: true,
    isContract: true,
  })
  async update(
    @Param('checklistId') checklistId: number,
    @Body() updateChecklistDto: UpdateChecklistDto,
  ) {
    delete updateChecklistDto.companyId;
    return this.updateChecklistService.execute(checklistId, updateChecklistDto);
  }
}
