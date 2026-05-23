import { BadRequestException, Injectable } from '@nestjs/common';
import { DocumentSectionTypeEnum } from '../../../../../modules/documents/docx/builders/pgr/types/section.types';

import { DocumentModelRepository } from '../../../repositories/implementations/DocumentModelRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CreateDocumentModelDto } from '../../../dto/document-model.dto';
import { IDocumentModelData } from '../../../../../modules/documents/types/document-mode.types';
import { StatusEnum } from '@prisma/client';
import { v4 } from 'uuid';
import {
  assertValidDocumentModelClassifications,
  normalizeDocumentModelClassifications,
} from '../../../utils/document-model-classifications.util';

@Injectable()
export class CreateDocumentModelService {
  constructor(private readonly documentModelRepository: DocumentModelRepository) {}

  async execute({ copyFromId, classifications, ...body }: CreateDocumentModelDto, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;
    const system = user.isSystem;

    const normalizedClassifications = normalizeDocumentModelClassifications(classifications);
    assertValidDocumentModelClassifications(normalizedClassifications, body.type);

    const found = await this.documentModelRepository.find(
      { name: body.name, showInactive: true, companyId: user.targetCompanyId, all: true },
      { skip: 0, take: 1 },
      { select: { id: true, status: true } },
    );

    if (found.data[0]?.id) {
      const inactiveSuffix =
        found.data[0].status === StatusEnum.INACTIVE ? ' inativado' : '';
      throw new BadRequestException(
        `Modelo de documento com esse nome já existe${inactiveSuffix}`,
      );
    }

    let baseModel: IDocumentModelData = {
      variables: {},
      sections: [
        {
          data: [
            { type: DocumentSectionTypeEnum.COVER, id: v4() },
            { type: DocumentSectionTypeEnum.TOC, id: v4() },
          ],
        },
      ],
    };
    if (copyFromId) {
      const copyDataModel = await this.documentModelRepository.find(
        { companyId: user.targetCompanyId, all: true, id: [copyFromId] },
        { skip: 0, take: 1 },
        { select: { data: true } },
      );

      if (copyDataModel.data[0] && copyDataModel.data[0].dataJson && !copyDataModel.data[0].errorParse)
        baseModel = copyDataModel.data[0].dataJson;
    }

    const model = await this.documentModelRepository.create({
      data: baseModel,
      system,
      companyId,
      classifications: normalizedClassifications,
      ...body,
    });

    return model;
  }
}
