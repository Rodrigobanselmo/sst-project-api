import { FindHomogeneousGroupDto } from './../../../dto/homoGroup';
import { Injectable } from '@nestjs/common';
import { HomoGroupRepository } from '../../../../../modules/company/repositories/implementations/HomoGroupRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class FindHomogenousGroupService {
  constructor(private readonly homoGroupRepository: HomoGroupRepository) {}

  async execute(
    { skip, take, ...query }: FindHomogeneousGroupDto,
    user: UserPayloadDto,
  ) {
    const homo = await this.homoGroupRepository.find(
      { ...query, companyId: user.targetCompanyId },
      { skip, take },
    );

    return homo;
  }
}
