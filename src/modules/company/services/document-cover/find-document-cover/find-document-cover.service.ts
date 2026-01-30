import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { DocumentCoverRepository } from '../../../repositories/implementations/DocumentCoverRepository';
import { DocumentCoverEntity } from '../../../entities/document-cover.entity';

@Injectable()
export class FindDocumentCoverService {
  constructor(private readonly documentCoverRepository: DocumentCoverRepository) {}

  async execute(userPayloadDto: UserPayloadDto): Promise<DocumentCoverEntity[]> {
    const companyId = userPayloadDto.targetCompanyId;
    return this.documentCoverRepository.findByCompany(companyId);
  }
}

