import { Injectable, NotFoundException } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { RiskDocumentRepository } from '../../../repositories/implementations/RiskDocumentRepository';

@Injectable()
export class DeleteDocumentVersionService {
  constructor(private readonly riskDocumentRepository: RiskDocumentRepository) {}

  async execute(id: string, userPayloadDto: UserPayloadDto) {
    const companyId = userPayloadDto.targetCompanyId;
    const deleted = await this.riskDocumentRepository.delete(id, companyId);

    if (!deleted) throw new NotFoundException('Documento não encontrado');

    return deleted;
  }
}
