import { Injectable } from '@nestjs/common';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';
import { WorkspaceConvertService } from '../services/workspace-convert.service';

@Injectable()
export class PreviewConvertWorkspaceToCompanyUseCase {
  constructor(private readonly workspaceConvertService: WorkspaceConvertService) {}

  execute(params: {
    companyId: string;
    workspaceId: string;
    companyGroupId: number;
    user: UserPayloadDto;
  }) {
    return this.workspaceConvertService.preview(params);
  }
}
