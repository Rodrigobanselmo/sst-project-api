import { CreateRiskDto } from './../../dto/create-risk.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateRiskService } from '../../services/risk/create-risk/create-risk.service';
import { User } from 'src/shared/decorators/user.decorator';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';
// import { Permissions } from '../../../../shared/decorators/permissions.decorator';
// import { Permission } from 'src/shared/constants/enum/authorization';
import { FindAllAvailableRiskService } from '../../services/risk/find-all-available-risk/find-all-available-risk.service';

@Controller('risk')
export class RiskController {
  constructor(
    private readonly createRiskService: CreateRiskService,
    private readonly findAllAvailableRiskService: FindAllAvailableRiskService,
  ) {}

  @Post()
  create(
    @User() userPayloadDto: UserPayloadDto,
    @Body() createRiskDto: CreateRiskDto,
  ) {
    return this.createRiskService.execute(createRiskDto, userPayloadDto);
  }

  @Get('/companyId?')
  findAllAvailable(@User() userPayloadDto: UserPayloadDto) {
    const companyId = userPayloadDto.targetCompanyId;
    return this.findAllAvailableRiskService.execute(companyId);
  }
}
