import { Injectable, NotFoundException } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { DocumentCoverRepository } from '../../../repositories/implementations/DocumentCoverRepository';

@Injectable()
export class DeleteDocumentCoverService {
  constructor(private readonly documentCoverRepository: DocumentCoverRepository) {}

  async execute(id: number, userPayloadDto: UserPayloadDto): Promise<void> {
    const companyId = userPayloadDto.targetCompanyId;

    const cover = await this.documentCoverRepository.findById(companyId, id);
    if (!cover) {
      throw new NotFoundException('Document cover not found');
    }

    await this.documentCoverRepository.delete(companyId, id);
  }
}

