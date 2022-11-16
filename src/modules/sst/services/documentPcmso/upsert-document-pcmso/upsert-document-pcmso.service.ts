import { Injectable } from '@nestjs/common';

import { UpsertDocumentPCMSODto } from '../../../dto/document-pcmso.dto';
import { DocumentPCMSORepository } from '../../../repositories/implementations/DocumentPCMSORepository';

@Injectable()
export class UpsertDocumentPCMSOService {
  constructor(private readonly documentPCMSORepository: DocumentPCMSORepository) {}

  async execute(dto: UpsertDocumentPCMSODto) {
    const riskData = await this.documentPCMSORepository.upsert(dto);

    return riskData;
  }
}
