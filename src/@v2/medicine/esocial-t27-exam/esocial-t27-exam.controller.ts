import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';

import { MedicineRoutes } from '@/@v2/medicine/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { User } from '@/shared/decorators/user.decorator';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import {
  MaterializeEsocialT27ExamBody,
  SearchEsocialT27ExamsQuery,
} from './esocial-t27-exam.dto';
import { EsocialT27ExamService } from './esocial-t27-exam.service';

@Controller(MedicineRoutes.EXAMS.ESOCIAL_T27.BASE)
@UseGuards(JwtAuthGuard)
export class EsocialT27ExamController {
  constructor(private readonly service: EsocialT27ExamService) {}

  @Get(MedicineRoutes.EXAMS.ESOCIAL_T27.SEARCH)
  search(@Query() query: SearchEsocialT27ExamsQuery) {
    return this.service.searchUnpublished({
      search: query.search,
      limit: query.limit,
    });
  }

  @Post(MedicineRoutes.EXAMS.ESOCIAL_T27.MATERIALIZE)
  materialize(
    @Body() body: MaterializeEsocialT27ExamBody,
    @User() user: UserPayloadDto,
  ) {
    return this.service.materialize(
      {
        esocial27Code: body.esocial27Code,
        companyId: body.companyId,
        asSystem: body.asSystem,
      },
      user,
    );
  }
}
