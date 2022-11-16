import { BadRequestException, Injectable } from '@nestjs/common';
import { HomoGroupRepository } from '../../../../../modules/company/repositories/implementations/HomoGroupRepository';
import { ErrorCompanyEnum } from '../../../../../shared/constants/enum/errorMessage';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class DeleteHomoGroupService {
  constructor(private readonly homoGroupRepository: HomoGroupRepository) {}

  async execute(id: string, userPayloadDto: UserPayloadDto) {
    const foundHomoGroup = await this.homoGroupRepository.findHomoGroupByCompanyAndId(id, userPayloadDto.targetCompanyId);

    if (!foundHomoGroup?.id) throw new BadRequestException(ErrorCompanyEnum.GHO_NOT_FOUND);

    const homoGroups = await this.homoGroupRepository.deleteById(id);

    return homoGroups;
  }
}
