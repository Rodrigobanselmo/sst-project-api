import { hierarchyCreateHomo } from './../../../../sst/services/risk-data/upsert-risk-data/upsert-risk.service';
import { EmployeePPPHistoryRepository } from './../../../repositories/implementations/EmployeePPPHistoryRepository';
import { BadRequestException, Injectable } from '@nestjs/common';

import { ErrorCompanyEnum } from '../../../../../shared/constants/enum/errorMessage';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { HomoGroupRepository } from '../../../repositories/implementations/HomoGroupRepository';
import { asyncEach } from './../../../../../shared/utils/asyncEach';
import { RiskFactorDataEntity } from '../../../../sst/entities/riskData.entity';
import { RiskDataRepository } from '../../../../sst/repositories/implementations/RiskDataRepository';
import { UpsertManyRiskDataService } from '../../../../sst/services/risk-data/upsert-many-risk-data/upsert-many-risk-data.service';
import { CopyHomogeneousGroupDto } from './../../../dto/homoGroup';
import { HierarchyRepository } from './../../../repositories/implementations/HierarchyRepository';
import { HomoTypeEnum } from '@prisma/client';

@Injectable()
export class CopyHomoGroupService {
  constructor(
    private readonly employeePPPHistoryRepository: EmployeePPPHistoryRepository,
    private readonly homoGroupRepository: HomoGroupRepository,
    private readonly riskDataRepository: RiskDataRepository,
    private readonly hierarchyRepository: HierarchyRepository,
    private readonly upsertManyRiskDataService: UpsertManyRiskDataService,
  ) {}

  async execute(
    { actualGroupId, riskGroupId, copyFromHomoGroupId, riskGroupIdFrom, companyIdFrom, hierarchyId, ...rest }: CopyHomogeneousGroupDto,
    userPayloadDto: UserPayloadDto,
  ) {
    const companyId = userPayloadDto.targetCompanyId;

    const getRiskData = async () => {
      if (actualGroupId) {
        const foundCopyFromHomoGroup = await this.homoGroupRepository.findHomoGroupByCompanyAndId(copyFromHomoGroupId, companyIdFrom);

        if (!foundCopyFromHomoGroup?.id) throw new BadRequestException(ErrorCompanyEnum.GHO_NOT_FOUND);

        return this.riskDataRepository.findAllByHomogeneousGroupId(companyIdFrom, riskGroupIdFrom, foundCopyFromHomoGroup.id);
      }

      if (hierarchyId) {
        return this.riskDataRepository.findAllByHierarchyId(
          companyIdFrom,
          // riskGroupIdFrom,
          hierarchyId,
        );
      }
    };

    const foundHomoGroup = await this.homoGroupRepository.findHomoGroupByCompanyAndId(actualGroupId, companyId);
    if (!foundHomoGroup.type) {
      // get al risk data from homogeneous group with ALL RISK combined
    }

    if (!foundHomoGroup.id)
      await hierarchyCreateHomo({
        homogeneousGroupId: actualGroupId,
        companyId,
        homoGroupRepository: this.homoGroupRepository,
        hierarchyRepository: this.hierarchyRepository,
      });

    const save = async (riskData: RiskFactorDataEntity, index: number) => {
      const data = {
        riskId: riskData.riskId,
        companyId,
        homogeneousGroupIds: [actualGroupId],
        riskFactorGroupDataId: riskGroupId,
        hierarchyIds: [],
        riskIds: [],
        adms: !(riskData?.adms?.length > 0) ? undefined : riskData.adms.map(({ id }) => id),
        engs: !(riskData?.engsToRiskFactorData?.length > 0) ? undefined : riskData.engsToRiskFactorData.map(({ recMed, ...rest }) => rest),
        epis: !(riskData?.epiToRiskFactorData?.length > 0) ? undefined : riskData.epiToRiskFactorData.map(({ epi, ...rest }) => rest),
        recs: !(riskData?.recs?.length > 0) ? undefined : riskData.recs.map(({ id }) => id),
        generateSources: !(riskData?.generateSources?.length > 0) ? undefined : riskData.generateSources.map(({ id }) => id),
        probability: riskData.probability || undefined,
        probabilityAfter: riskData.probabilityAfter || undefined,
        json: riskData.json || undefined,
        ...rest,
      };
      if (!foundHomoGroup?.id && index === 0) return this.upsertManyRiskDataService.execute(data);
      delete data.type;
      return this.riskDataRepository.upsertMany(data);
    };

    const riskData = await getRiskData();

    await asyncEach(
      riskData.filter((r) => r.endDate == null),
      save,
    );

    this.employeePPPHistoryRepository.updateManyNude({
      data: { sendEvent: true },
      where: {
        employee: {
          companyId: userPayloadDto.targetCompanyId,
          hierarchyHistory: { some: { hierarchy: { hierarchyOnHomogeneous: { some: { homogeneousGroupId: foundHomoGroup.id } } } } },
        },
      },
    });
  }
}
