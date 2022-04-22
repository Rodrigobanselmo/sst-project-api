import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';

import { CreateRiskDto, UpdateRiskDto } from '../../dto/risk.dto';
import { CreateRiskService } from '../../services/risk/create-risk/create-risk.service';
import { FindAllAvailableRiskService } from '../../services/risk/find-all-available-risk/find-all-available-risk.service';
import { UpdateRiskService } from '../../services/risk/update-risk/update-risk.service';

@Controller('risk')
export class RiskController {
  constructor(
    private readonly createRiskService: CreateRiskService,
    private readonly updateRiskService: UpdateRiskService,
    private readonly findAllAvailableRiskService: FindAllAvailableRiskService,
  ) {}

  @Post()
  create(
    @User() userPayloadDto: UserPayloadDto,
    @Body() createRiskDto: CreateRiskDto,
  ) {
    return this.createRiskService.execute(createRiskDto, userPayloadDto);
  }

  @Patch('/:riskId')
  async update(
    @Param('riskId') riskId: number,
    @User() userPayloadDto: UserPayloadDto,
    @Body() updateRiskDto: UpdateRiskDto,
  ) {
    return this.updateRiskService.execute(
      riskId,
      updateRiskDto,
      userPayloadDto,
    );
  }

  @Get('/:companyId?')
  findAllAvailable(@User() userPayloadDto: UserPayloadDto) {
    const companyId = userPayloadDto.targetCompanyId;
    return this.findAllAvailableRiskService.execute(companyId);
  }
}
