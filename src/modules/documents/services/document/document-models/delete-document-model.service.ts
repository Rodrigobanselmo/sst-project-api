import { BadRequestException, Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { DocumentModelRepository } from '../../../repositories/implementations/DocumentModelRepository';

@Injectable()
export class DeleteDocumentModelService {
  constructor(private readonly documentModelRepository: DocumentModelRepository) {}

  async execute(id: number, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;
    const isSystem = user.isSystem;

    const found = await this.documentModelRepository.find(
      { id: [id], companyId, all: true, showInactive: true, ...(!isSystem && { system: false }) },
      { skip: 0, take: 1 },
      { select: { id: true } },
    );

    if (!found.data[0]?.id) {
      throw new BadRequestException('Modelo não encontrado ou sem permissão para excluir');
    }

    return this.documentModelRepository.delete(id, companyId);
  }
}
