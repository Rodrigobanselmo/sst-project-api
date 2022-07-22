import { CompanyGroupRepository } from './../../../repositories/implementations/CompanyGroupRepository';
import { UpsertCompanyGroupDto } from './../../../dto/company-group.dto';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpsertCompanyGroupsService {
  constructor(
    private readonly companyGroupRepository: CompanyGroupRepository,
  ) {}

  async execute(
    UpsertCompanyGroupsDto: UpsertCompanyGroupDto,
    user: UserPayloadDto,
  ) {
    const company = await this.companyGroupRepository.upsert({
      ...UpsertCompanyGroupsDto,
      companyId: user.targetCompanyId,
    });

    return company;
  }
}
