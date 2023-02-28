import { Injectable } from '@nestjs/common';

import { UploadDocumentDto } from '../../../dto/document.dto';
import { DocumentPGRFactory } from '../../../factories/document/products/PGR/DocumentPGRFactory';

@Injectable()
export class PcmsoUploadService {
  constructor(private readonly documentPGRFactory: DocumentPGRFactory) {}
  async execute(body: UploadDocumentDto) {
    return await this.documentPGRFactory.execute(body as any);
  }
}
