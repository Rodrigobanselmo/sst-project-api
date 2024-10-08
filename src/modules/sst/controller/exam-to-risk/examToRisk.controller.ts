import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CopyExamsRiskDto, CreateExamsRiskDto, FindExamRiskDto, UpdateExamRiskDto } from '../../dto/exam-risk.dto';
import { CopyExamRiskService } from '../../services/examToRisk/copy-exam/copy-exam.service';
import { CreateExamRiskService } from '../../services/examToRisk/create-exam/create-exam.service';
import { DeleteSoftExamRiskService } from '../../services/examToRisk/delete-soft-exam-risk/delete-soft-exam-risk.service';
import { FindExamRiskService } from '../../services/examToRisk/find-exam/find-exam.service';
import { UpdateExamRiskService } from '../../services/examToRisk/update-exam/update-exam.service';

@Controller('exam/risk')
export class ExamRiskController {
  constructor(
    private readonly createExamService: CreateExamRiskService,
    private readonly findExamService: FindExamRiskService,
    private readonly updateExamService: UpdateExamRiskService,
    private readonly copyExamRiskService: CopyExamRiskService,
    private readonly deleteSoftExamRiskService: DeleteSoftExamRiskService,
  ) {}

  @Permissions({
    code: PermissionEnum.EXAM_RISK,
    crud: true,
    isMember: true,
    isContract: true,
  })
  @Post()
  create(@User() userPayloadDto: UserPayloadDto, @Body() createExamDto: CreateExamsRiskDto) {
    return this.createExamService.execute(createExamDto, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.EXAM_RISK,
    crud: true,
    isMember: true,
    isContract: true,
  })
  @Post('copy')
  copy(@User() userPayloadDto: UserPayloadDto, @Body() createExamDto: CopyExamsRiskDto) {
    return this.copyExamRiskService.execute(createExamDto, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.EXAM_RISK,
    crud: true,
    isMember: true,
    isContract: true,
  })
  @Patch('/:id/:companyId')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @User() userPayloadDto: UserPayloadDto,
    @Body() updateRiskDto: UpdateExamRiskDto,
  ) {
    return this.updateExamService.execute(id, updateRiskDto, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.EXAM_RISK,
    isMember: true,
    isContract: true,
  })
  @Get('/:companyId?')
  findAllAvailable(@User() userPayloadDto: UserPayloadDto, @Query() query: FindExamRiskDto) {
    return this.findExamService.execute(query, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.EXAM_RISK,
    crud: true,
    isMember: true,
    isContract: true,
  })
  @Delete('/:id/:companyId')
  async delete(@Param('id', ParseIntPipe) id: number, @User() userPayloadDto: UserPayloadDto) {
    return this.deleteSoftExamRiskService.execute(id, userPayloadDto);
  }
}
