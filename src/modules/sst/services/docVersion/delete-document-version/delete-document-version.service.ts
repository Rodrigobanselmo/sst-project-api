import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { isOfficialDocumentVersion } from '@/@v2/documents/domain/functions/is-revision-controlled-version.func';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { RiskDocumentRepository } from '../../../repositories/implementations/RiskDocumentRepository';

@Injectable()
export class DeleteDocumentVersionService {
  constructor(private readonly riskDocumentRepository: RiskDocumentRepository) {}

  async execute(id: string, userPayloadDto: UserPayloadDto) {
    const companyId = userPayloadDto.targetCompanyId;
    const existing = await this.riskDocumentRepository.findById(id, companyId);

    if (!existing) throw new NotFoundException('Documento não encontrado');

    if (isOfficialDocumentVersion(existing.version)) {
      throw new BadRequestException(
        'Versões oficiais não podem ser excluídas.',
      );
    }

    const deleted = await this.riskDocumentRepository.delete(id, companyId);

    if (!deleted) throw new NotFoundException('Documento não encontrado');

    return deleted;
  }
}
