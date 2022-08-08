import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateExamDto, FindExamDto, UpdateExamDto } from '../../dto/exam.dto';
import { CreateExamService } from '../../services/exam/create-exam/create-exam.service';
import { DeleteSoftExamService } from '../../services/exam/delete-soft-exam/delete-soft-exam.service';
import { UpdateExamService } from '../../services/exam/update-exam/update-exam.service';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { FindExamService } from '../../services/exam/find-exam/find-exam.service';

@Controller('exam')
export class ExamController {
  constructor(
    private readonly createExamService: CreateExamService,
    private readonly findExamService: FindExamService,
    private readonly updateExamService: UpdateExamService,
    private readonly deleteSoftExamService: DeleteSoftExamService,
  ) {}

  @Permissions({
    code: PermissionEnum.EXAM,
    crud: true,
    isMember: true,
  })
  @Post()
  create(
    @User() userPayloadDto: UserPayloadDto,
    @Body() createExamDto: CreateExamDto,
  ) {
    return this.createExamService.execute(createExamDto, userPayloadDto);
  }

  @Get('/:companyId?')
  findAllAvailable(
    @User() userPayloadDto: UserPayloadDto,
    @Query() query: FindExamDto,
  ) {
    return this.findExamService.execute(query, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.EXAM,
    crud: true,
    isMember: true,
  })
  @Patch('/:id/:companyId')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @User() userPayloadDto: UserPayloadDto,
    @Body() updateRiskDto: UpdateExamDto,
  ) {
    return this.updateExamService.execute(id, updateRiskDto, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.EXAM,
    crud: true,
    isMember: true,
  })
  @Delete('/:id/:companyId')
  async deleteSoft(
    @Param('id', ParseIntPipe) id: number,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.deleteSoftExamService.execute(id, userPayloadDto);
  }
}
