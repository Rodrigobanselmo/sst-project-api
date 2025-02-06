import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { DocumentControlFileReadModelMapper, IDocumentControlFileReadModelMapper } from '../../mappers/models/document-control-file/document-control-read.mapper';
import { IDocumentControlFileDAO } from './document-control-file.types';

@Injectable()
export class DocumentControlFileDAO {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async read(params: IDocumentControlFileDAO.ReadParams) {
    const documentControl = await this.prisma.$queryRaw<IDocumentControlFileReadModelMapper>`
      SELECT
        document_control_file."id" as id
        ,document_control_file."name" as name
        ,document_control_file."description" as description
        ,document_control_file."end_date" as end_date
        ,document_control_file."start_date" as start_date
        ,system_file."url" as file_url
        ,system_file."bucket" as file_bucket
        ,system_file."key" as file_key
        ,system_file."name" as file_name
      FROM
        "DocumentControlFile" document_control_file
      LEFT JOIN 
        "SystemFile" system_file ON system_file."id" = document_control_file.file_id
      WHERE 
        document_control_file."id" = ${params.id}
        AND document_control_file."company_id" = ${params.companyId}
    `;

    return DocumentControlFileReadModelMapper.toModel(documentControl);
  }
}
