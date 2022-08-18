import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import {
  CreateExamsRiskDto,
  FindExamRiskDto,
  UpdateExamRiskDto,
} from '../../dto/exam-risk.dto';
import { CreateExamRiskService } from '../../services/examToRisk/create-exam/create-exam.service';
import { FindExamRiskService } from '../../services/examToRisk/find-exam/find-exam.service';
import { UpdateExamRiskService } from '../../services/examToRisk/update-exam/update-exam.service';

@Controller('exam/risk')
export class ExamRiskController {
  constructor(
    private readonly createExamService: CreateExamRiskService,
    private readonly findExamService: FindExamRiskService,
    private readonly updateExamService: UpdateExamRiskService,
  ) {}

  @Permissions({
    code: PermissionEnum.EXAM_RISK,
    crud: true,
    isMember: true,
    isContract: true,
  })
  @Post()
  create(
    @User() userPayloadDto: UserPayloadDto,
    @Body() createExamDto: CreateExamsRiskDto,
  ) {
    return this.createExamService.execute(createExamDto, userPayloadDto);
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

  @Get('/:companyId?')
  findAllAvailable(
    @User() userPayloadDto: UserPayloadDto,
    @Query() query: FindExamRiskDto,
  ) {
    return this.findExamService.execute(query, userPayloadDto);
  }
}
