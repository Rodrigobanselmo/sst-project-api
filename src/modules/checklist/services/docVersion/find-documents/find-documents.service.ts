import { FindDocVersionDto } from '../../../dto/doc-version.dto';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';
import { RiskDocumentRepository } from '../../../repositories/implementations/RiskDocumentRepository';

@Injectable()
export class FindDocumentsService {
  constructor(
    private readonly riskDocumentRepository: RiskDocumentRepository,
  ) {}

  async execute(
    { skip, take, ...query }: FindDocVersionDto,
    user: UserPayloadDto,
  ) {
    const companyId = user.targetCompanyId;

    const riskGroupData = await this.riskDocumentRepository.find(
      {
        companyId,
        ...query,
      },
      { skip, take },
    );

    return riskGroupData;
  }
}
