import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateHomoGroupDto } from 'src/modules/company/dto/homoGroup';
import { HomoGroupRepository } from 'src/modules/company/repositories/implementations/HomoGroupRepository';
import { ErrorCompanyEnum } from 'src/shared/constants/enum/errorMessage';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';

@Injectable()
export class UpdateHomoGroupService {
  constructor(private readonly homoGroupRepository: HomoGroupRepository) {}

  async execute(homoGroup: UpdateHomoGroupDto, userPayloadDto: UserPayloadDto) {
    const foundHomoGroup =
      await this.homoGroupRepository.findHomoGroupByCompanyAndId(
        homoGroup.id,
        userPayloadDto.targetCompanyId,
      );

    if (!foundHomoGroup)
      throw new BadRequestException(ErrorCompanyEnum.GHO_NOT_FOUND);

    const hierarchies = await this.homoGroupRepository.update(homoGroup);

    return hierarchies;
  }
}
