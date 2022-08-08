import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { UpsertExamToClinicDto } from '../../dto/exam-to-clinic.dto';
import { FindExamDto } from '../../dto/exam.dto';
import { FindExamToClinicService } from '../../services/examToClinic/find-exam-to-clinic/find-exam-to-clinic.service';
import { UpsertExamToClinicService } from '../../services/examToClinic/upsert-exam-to-clinic/upsert-exam-to-clinic.service';

@Controller('clinic-exam')
export class ExamController {
  constructor(
    private readonly upsertExamToClinicService: UpsertExamToClinicService,
    private readonly findExamToClinicService: FindExamToClinicService,
  ) {}

  @Permissions({
    code: PermissionEnum.EXAM,
    crud: true,
    isMember: true,
  })
  @Post()
  create(
    @User() userPayloadDto: UserPayloadDto,
    @Body() upsertDataDto: UpsertExamToClinicDto,
  ) {
    return this.upsertExamToClinicService.execute(
      upsertDataDto,
      userPayloadDto,
    );
  }

  @Permissions({
    code: PermissionEnum.EXAM,
    crud: true,
    isMember: true,
  })
  @Get('/:companyId?')
  findAllAvailable(
    @User() userPayloadDto: UserPayloadDto,
    @Query() query: FindExamDto,
  ) {
    return this.findExamToClinicService.execute(query, userPayloadDto);
  }
}
