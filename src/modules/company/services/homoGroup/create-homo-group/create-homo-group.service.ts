import { Injectable } from '@nestjs/common';
import { CreateHomoGroupDto } from 'src/modules/company/dto/homoGroup';
import { HomoGroupRepository } from 'src/modules/company/repositories/implementations/HomoGroupRepository';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';

@Injectable()
export class CreateHomoGroupService {
  constructor(private readonly homoGroupRepository: HomoGroupRepository) {}

  async execute(homoGroup: CreateHomoGroupDto, user: UserPayloadDto) {
    const homoGroups = await this.homoGroupRepository.create(
      homoGroup,
      user.targetCompanyId,
    );

    return homoGroups;
  }
}
