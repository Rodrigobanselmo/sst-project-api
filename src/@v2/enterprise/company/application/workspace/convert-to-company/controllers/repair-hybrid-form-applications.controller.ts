import {
  Controller,
  Param,
  Post,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { RoleEnum } from '@/shared/constants/enum/authorization';
import { Roles } from '@/shared/decorators/roles.decorator';
import { User } from '@/shared/decorators/user.decorator';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';
import { CompanyRoutes } from '@/@v2/enterprise/company/constants/routes';
import { WorkspaceConvertService } from '../services/workspace-convert.service';

@Controller(CompanyRoutes.REPAIR_HYBRID_FORM_APPLICATIONS)
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.MASTER)
export class RepairHybridFormApplicationsController {
  constructor(
    private readonly workspaceConvertService: WorkspaceConvertService,
  ) {}

  @Post()
  execute(
    @Param('companyId') anchorCompanyId: string,
    @Query('companyGroupId', ParseIntPipe) companyGroupId: number,
    @User() user: UserPayloadDto,
  ) {
    return this.workspaceConvertService.repairHybridFormApplicationsAfterBranchConversions(
      {
        anchorCompanyId,
        companyGroupId,
        user,
      },
    );
  }
}
