import { RiskDataRepository } from './../../../../checklist/repositories/implementations/RiskDataRepository';
import { BadRequestException, Injectable } from '@nestjs/common';

import { ErrorCompanyEnum } from '../../../../../shared/constants/enum/errorMessage';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { HomoGroupRepository } from '../../../repositories/implementations/HomoGroupRepository';

@Injectable()
export class CopyHomoGroupService {
  constructor(
    private readonly homoGroupRepository: HomoGroupRepository,
    private readonly riskDataRepository: RiskDataRepository,
  ) {}

  async execute(
    actualGroupId: string,
    copyFromHomoGroupId: string,
    riskGroupId: string,
    userPayloadDto: UserPayloadDto,
  ) {
    const companyId = userPayloadDto.targetCompanyId;
    const foundHomoGroup =
      await this.homoGroupRepository.findHomoGroupByCompanyAndId(
        actualGroupId,
        companyId,
      );

    const foundCopyFromHomoGroup =
      await this.homoGroupRepository.findHomoGroupByCompanyAndId(
        copyFromHomoGroupId,
        companyId,
      );

    if (!foundHomoGroup)
      throw new BadRequestException(ErrorCompanyEnum.GHO_NOT_FOUND);

    if (!foundCopyFromHomoGroup)
      throw new BadRequestException(ErrorCompanyEnum.GHO_NOT_FOUND);

    const riskData = await this.riskDataRepository.findAllByHomogeneousGroupId(
      companyId,
      riskGroupId,
      foundCopyFromHomoGroup.id,
    );

    const risksDataMany =
      (await Promise.all(
        riskData.map(async (riskData) => {
          return await this.riskDataRepository.upsertMany({
            riskId: riskData.riskId,
            companyId,
            homogeneousGroupIds: [foundHomoGroup.id],
            riskFactorGroupDataId: riskGroupId,
            hierarchyIds: [],
            riskIds: [],
            adms: riskData.adms.map(({ id }) => id),
            engs: riskData.engs.map(({ id }) => id),
            epis: riskData.epis.map(({ id }) => id),
            recs: riskData.recs.map(({ id }) => id),
            generateSources: riskData.generateSources.map(({ id }) => id),
            probability: riskData.probability,
            probabilityAfter: riskData.probabilityAfter,
            json: riskData.json,
          });
        }),
      )) || [];

    // const hierarchies = await this.homoGroupRepository.update(homoGroup);

    // return hierarchies;
  }
}
