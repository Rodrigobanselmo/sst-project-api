import { CompanyGroupRepository } from './../../../repositories/implementations/CompanyGroupRepository';
import { FindCompanyGroupDto } from './../../../dto/company-group.dto';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindAvailableCompanyGroupsService {
  constructor(
    private readonly companyGroupRepository: CompanyGroupRepository,
  ) {}

  async execute(
    { skip, take, ...query }: FindCompanyGroupDto,
    user: UserPayloadDto,
  ) {
    const access = await this.companyGroupRepository.findAvailable(
      user.targetCompanyId,
      { ...query },
      { skip, take },
    );

    return access;
  }
}
