import { Injectable } from '@nestjs/common';

import { UploadDocumentDto } from '../../../dto/document.dto';
import { DocumentPCMSOFactory } from '../../../factories/document/products/PGR/DocumentPCMSOFactory';

@Injectable()
export class PcmsoUploadService {
  constructor(private readonly documentPCMSOFactory: DocumentPCMSOFactory) {}
  async execute(body: UploadDocumentDto) {
    return await this.documentPCMSOFactory.execute(body as any);
  }
}
