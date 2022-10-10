import { FindDocPgrDto } from './../../../dto/doc-pgr.dto';
import { UserPayloadDto } from './../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';
import { RiskDocumentRepository } from '../../../repositories/implementations/RiskDocumentRepository';

@Injectable()
export class FindDocumentsService {
  constructor(
    private readonly riskDocumentRepository: RiskDocumentRepository,
  ) {}

  async execute(
    riskGroupId: string,
    { skip, take, ...query }: FindDocPgrDto,
    user: UserPayloadDto,
  ) {
    const companyId = user.targetCompanyId;

    const riskGroupData = await this.riskDocumentRepository.find(
      {
        riskGroupId,
        companyId,
        ...query,
      },
      { skip, take },
    );

    return riskGroupData;
  }
}
