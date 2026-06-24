import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { MedicineRoutes } from '@/@v2/medicine/constants/routes';
import { RoleEnum } from '@/shared/constants/enum/authorization';
import { Roles } from '@/shared/decorators/roles.decorator';
import { User } from '@/shared/decorators/user.decorator';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import {
  ApplyBiologicalIndicatorsBody,
  BiologicalIndicatorApplicationPreviewQuery,
} from './biological-indicator-application.dto';
import { BiologicalIndicatorApplicationService } from '../../services/biological-indicator-application.service';

@Controller(MedicineRoutes.BIOLOGICAL_INDICATORS.BASE)
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.MASTER)
export class BiologicalIndicatorApplicationController {
  constructor(
    private readonly applicationService: BiologicalIndicatorApplicationService,
  ) {}

  @Get(MedicineRoutes.BIOLOGICAL_INDICATORS.APPLICATION_PREVIEW)
  previewApplication(@Query() query: BiologicalIndicatorApplicationPreviewQuery) {
    return this.applicationService.previewApplication({
      indicatorIds: query.indicatorIds,
    });
  }

  @Post(MedicineRoutes.BIOLOGICAL_INDICATORS.APPLY)
  applyApplication(
    @Body() body: ApplyBiologicalIndicatorsBody,
    @User() user: UserPayloadDto,
  ) {
    return this.applicationService.applyApplication({
      indicatorIds: body.indicatorIds,
      confirmApply: body.confirmApply,
      userId: user.userId,
    });
  }
}
