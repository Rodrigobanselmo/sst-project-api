import { Injectable } from '@nestjs/common';

import { UpsertManyRiskDataDto } from '../../../dto/risk-data.dto';
import { RiskDataRepository } from '../../../repositories/implementations/RiskDataRepository';

@Injectable()
export class UpsertManyRiskDataService {
  constructor(private readonly riskDataRepository: RiskDataRepository) {}

  async execute(upsertRiskDataDto: UpsertManyRiskDataDto) {
    const risksDataMany =
      (await Promise.all(
        upsertRiskDataDto.riskIds.map(
          async (riskId) =>
            await this.riskDataRepository.upsertMany({
              ...upsertRiskDataDto,
              riskId,
            }),
        ),
      )) || [];

    if (upsertRiskDataDto.riskId)
      risksDataMany.push(
        await this.riskDataRepository.upsertMany(upsertRiskDataDto),
      );

    // const emptyRiskDataIds = risksDataMany.reduce((acc, riskDataSlice) => {
    //   return [
    //     ...acc,
    //     ...riskDataSlice
    //       .map((riskData) => {
    //         const isEmpty =
    //           riskData.adms.length === 0 &&
    //           riskData.recs.length === 0 &&
    //           riskData.engs.length === 0 &&
    //           riskData.epis.length === 0 &&
    //           riskData.generateSources.length === 0 &&
    //           !riskData.probability;

    //         if (isEmpty) {
    //           return riskData.id;
    //         }
    //         return;
    //       })
    //       .filter((id) => id),
    //   ];
    // }, [] as string[]);

    // await this.riskDataRepository.deleteByIds(emptyRiskDataIds);

    return risksDataMany;
  }
}
