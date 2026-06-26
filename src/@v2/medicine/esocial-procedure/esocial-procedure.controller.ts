import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { MedicineRoutes } from '@/@v2/medicine/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { RoleEnum } from '@/shared/constants/enum/authorization';
import { Roles } from '@/shared/decorators/roles.decorator';
import { User } from '@/shared/decorators/user.decorator';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import {
  BrowseEsocialProceduresQuery,
  EsocialProcedureCodePath,
  EsocialProcedureIdPath,
  UpdateEsocialProcedureStatusBody,
  UpsertEsocialProcedureBody,
} from './esocial-procedure.dto';
import { EsocialProcedureService } from './esocial-procedure.service';

@Controller(MedicineRoutes.ESOCIAL_PROCEDURES.BASE)
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.MASTER)
export class EsocialProcedureController {
  constructor(private readonly service: EsocialProcedureService) {}

  @Get()
  browse(@Query() query: BrowseEsocialProceduresQuery) {
    return this.service.browse({
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      filters: {
        search: query.search,
        status: query.status,
        technicalType: query.technicalType,
        isOccupationalRelevant: query.isOccupationalRelevant,
        onlyCurated: query.onlyCurated,
      },
    });
  }

  @Get(MedicineRoutes.ESOCIAL_PROCEDURES.BY_CODE)
  getByCode(@Param() path: EsocialProcedureCodePath) {
    return this.service.getByCode(path.procedureCode);
  }

  @Put(MedicineRoutes.ESOCIAL_PROCEDURES.BY_CODE)
  upsert(
    @Param() path: EsocialProcedureCodePath,
    @Body() body: UpsertEsocialProcedureBody,
    @User() user: UserPayloadDto,
  ) {
    return this.service.upsertByCode(path.procedureCode, body, user.userId);
  }

  @Patch(MedicineRoutes.ESOCIAL_PROCEDURES.BY_ID.STATUS)
  updateStatus(
    @Param() path: EsocialProcedureIdPath,
    @Body() body: UpdateEsocialProcedureStatusBody,
  ) {
    return this.service.updateStatus(path.id, body.status);
  }

  @Delete(MedicineRoutes.ESOCIAL_PROCEDURES.BY_ID.PATH)
  softDelete(@Param() path: EsocialProcedureIdPath) {
    return this.service.softDelete(path.id);
  }
}
