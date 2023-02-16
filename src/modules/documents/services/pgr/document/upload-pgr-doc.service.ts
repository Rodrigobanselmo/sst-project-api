import { Injectable } from '@nestjs/common';

import { UpsertPgrDocumentDto } from '../../../dto/pgr.dto';
import { DocumentPGRFactory } from './../../../factories/document/products/PGR/DocumentPGRFactory';

@Injectable()
export class PgrUploadService {
  constructor(private readonly documentPGRFactory: DocumentPGRFactory) {}
  async execute(body: UpsertPgrDocumentDto) {
    return await this.documentPGRFactory.execute(body);
  }
}
