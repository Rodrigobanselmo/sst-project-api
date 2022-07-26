import { RiskFactorDataEntity } from './../../../../checklist/entities/riskData.entity';
import { asyncEach } from './../../../../../shared/utils/asyncEach';
import { UpsertManyRiskDataService } from './../../../../checklist/services/risk-data/upsert-many-risk-data/upsert-many-risk-data.service';
import { CopyHomogeneousGroupDto } from './../../../dto/homoGroup';
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
    private readonly upsertManyRiskDataService: UpsertManyRiskDataService,
  ) {}

  async execute(
    {
      actualGroupId,
      riskGroupId,
      copyFromHomoGroupId,
      riskGroupIdFrom,
      companyIdFrom,
      ...rest
    }: CopyHomogeneousGroupDto,
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
        companyIdFrom,
      );

    if (!foundCopyFromHomoGroup?.id)
      throw new BadRequestException(ErrorCompanyEnum.GHO_NOT_FOUND);

    const riskData = await this.riskDataRepository.findAllByHomogeneousGroupId(
      companyId,
      riskGroupIdFrom,
      foundCopyFromHomoGroup.id,
    );

    const save = async (riskData: RiskFactorDataEntity, index: number) => {
      const data = {
        riskId: riskData.riskId,
        companyId,
        homogeneousGroupIds: [actualGroupId],
        riskFactorGroupDataId: riskGroupId,
        hierarchyIds: [],
        riskIds: [],
        adms: !(riskData?.adms?.length > 0)
          ? undefined
          : riskData.adms.map(({ id }) => id),
        engs: !(riskData?.engs?.length > 0)
          ? undefined
          : riskData.engs.map(({ id }) => id),
        epis: !(riskData?.epis?.length > 0)
          ? undefined
          : riskData.epis.map(({ id }) => id),
        recs: !(riskData?.recs?.length > 0)
          ? undefined
          : riskData.recs.map(({ id }) => id),
        generateSources: !(riskData?.generateSources?.length > 0)
          ? undefined
          : riskData.generateSources.map(({ id }) => id),
        probability: riskData.probability || undefined,
        probabilityAfter: riskData.probabilityAfter || undefined,
        json: riskData.json || undefined,
        ...rest,
      };
      if (!foundHomoGroup?.id && index === 0)
        return this.upsertManyRiskDataService.execute(data);
      delete data.type;
      delete data.workspaceId;
      return this.riskDataRepository.upsertMany(data);
    };

    await asyncEach(riskData, save);
  }
}
