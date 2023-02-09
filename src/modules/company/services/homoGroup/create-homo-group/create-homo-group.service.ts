import { WorkspaceRepository } from './../../../repositories/implementations/WorkspaceRepository';
import { CompanyRepository } from './../../../repositories/implementations/CompanyRepository';
import { ConflictException, Injectable } from '@nestjs/common';
import { ErrorCompanyEnum } from '../../../../../shared/constants/enum/errorMessage';
import { CreateHomoGroupDto } from '../../../../../modules/company/dto/homoGroup';
import { HomoGroupRepository } from '../../../../../modules/company/repositories/implementations/HomoGroupRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class CreateHomoGroupService {
  constructor(private readonly homoGroupRepository: HomoGroupRepository, private readonly workspaceRepository: WorkspaceRepository) {}

  async execute(homoGroup: CreateHomoGroupDto, user: UserPayloadDto) {
    const hasHomoSameName = await this.homoGroupRepository.findHomoGroupByCompanyAndName(homoGroup.name, user.targetCompanyId);

    if (hasHomoSameName?.id) throw new ConflictException(ErrorCompanyEnum.HOMOGENEOUS_SAME_NAME);

    if (!homoGroup.workspaceIds) {
      const workspaces = await this.workspaceRepository.findNude({ where: { companyId: user.targetCompanyId }, select: { id: true } });
      homoGroup.workspaceIds = workspaces.map(({ id }) => id);
    }

    const homoGroups = await this.homoGroupRepository.create(homoGroup, user.targetCompanyId);

    return homoGroups;
  }
}
