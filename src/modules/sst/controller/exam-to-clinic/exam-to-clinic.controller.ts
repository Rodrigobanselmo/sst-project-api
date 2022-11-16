import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CopyExamsToClinicDto, FindExamToClinicDto, UpsertExamToClinicDto } from '../../dto/exam-to-clinic.dto';
import { CopyExamToClinicService } from '../../services/examToClinic/copy-exam-to-clinic/copy-exam-to-clinic.service';
import { FindExamToClinicService } from '../../services/examToClinic/find-exam-to-clinic/find-exam-to-clinic.service';
import { UpsertExamToClinicService } from '../../services/examToClinic/upsert-exam-to-clinic/upsert-exam-to-clinic.service';

@Controller('/clinic-exam')
export class ExamToClinicController {
  constructor(
    private readonly upsertExamToClinicService: UpsertExamToClinicService,
    private readonly findExamToClinicService: FindExamToClinicService,
    private readonly copyExamToClinicService: CopyExamToClinicService,
  ) {}

  @Permissions({
    code: PermissionEnum.EXAM_CLINIC,
    crud: true,
    isMember: true,
    isContract: true,
  })
  @Post()
  create(@User() userPayloadDto: UserPayloadDto, @Body() upsertDataDto: UpsertExamToClinicDto) {
    return this.upsertExamToClinicService.execute(upsertDataDto, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.EXAM_CLINIC,
    crud: true,
    isMember: true,
    isContract: true,
  })
  @Post('copy')
  copy(@User() userPayloadDto: UserPayloadDto, @Body() createExamDto: CopyExamsToClinicDto) {
    return this.copyExamToClinicService.execute(createExamDto, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.EXAM_CLINIC,
    crud: true,
    isMember: true,
    isContract: true,
  })
  @Get('/:companyId?')
  findAllAvailable(@User() userPayloadDto: UserPayloadDto, @Query() query: FindExamToClinicDto) {
    return this.findExamToClinicService.execute(query, userPayloadDto);
  }
}
