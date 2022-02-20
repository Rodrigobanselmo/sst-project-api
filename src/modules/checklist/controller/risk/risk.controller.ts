import { CreateRiskDto } from './../../dto/create-risk.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateRiskService } from '../../services/risk/create-risk/create-risk.service';
import { User } from 'src/shared/decorators/user.decorator';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { Permission } from 'src/shared/constants/enum/authorization';

@Controller('risk')
export class RiskController {
  constructor(private readonly createRiskService: CreateRiskService) {}

  @Post()
  @Permissions({
    code: Permission.CREATE_RISK,
    isMember: true,
    isContract: true,
  })
  create(
    @User() userPayloadDto: UserPayloadDto,
    @Body() createRiskDto: CreateRiskDto,
  ) {
    return this.createRiskService.execute(createRiskDto, userPayloadDto);
  }
}
