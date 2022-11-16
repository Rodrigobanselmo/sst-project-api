import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateChecklistDto } from '../../dto/create-checklist.dto';
import { UpdateChecklistDto } from '../../dto/update-checklist.dto';
import { CreateChecklistService } from '../../services/checklist/create-checklist/create-checklist.service';
import { FindAvailableChecklistService } from '../../services/checklist/find-available-checklist/find-available-checklist.service';
import { FindChecklistDataService } from '../../services/checklist/find-checklist-data/find-checklist-data.service';
import { UpdateChecklistService } from '../../services/checklist/update-checklist/update-checklist.service';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { PermissionEnum } from '../../../../shared/constants/enum/authorization';

@Controller('checklist')
export class ChecklistController {
  constructor(
    private readonly createChecklistService: CreateChecklistService,
    private readonly findAvailableChecklistService: FindAvailableChecklistService,
    private readonly findChecklistDataService: FindChecklistDataService,
    private readonly updateChecklistService: UpdateChecklistService,
  ) {}

  @Post()
  create(@User() userPayloadDto: UserPayloadDto, @Body() createChecklistDto: CreateChecklistDto) {
    return this.createChecklistService.execute(createChecklistDto, userPayloadDto);
  }

  @Get('/:companyId?')
  findAllAvailable(@User() userPayloadDto: UserPayloadDto) {
    return this.findAvailableChecklistService.execute(userPayloadDto);
  }

  @Get('/data/:checklistId/:companyId?')
  findChecklistData(@Param('checklistId') checklistId: number, @User() userPayloadDto: UserPayloadDto) {
    return this.findChecklistDataService.execute(checklistId, userPayloadDto);
  }

  @Patch('/:checklistId')
  async update(@Param('checklistId') checklistId: number, @Body() updateChecklistDto: UpdateChecklistDto) {
    return this.updateChecklistService.execute(checklistId, updateChecklistDto);
  }
}
