import { BadRequestException, Injectable } from '@nestjs/common';
import { StatusEnum } from '@prisma/client';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { UpdateDocumentModelDto } from '../../../dto/document-model.dto';
import { DocumentModelRepository } from '../../../repositories/implementations/DocumentModelRepository';

@Injectable()
export class UpdateDocumentModelService {
  constructor(private readonly documentModelRepository: DocumentModelRepository) {}

  async execute(body: UpdateDocumentModelDto, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;

    if (body.name) {
      const found = await this.documentModelRepository.find(
        { name: body.name, showInactive: true, companyId: user.targetCompanyId, all: true },
        { skip: 0, take: 1 },
        { select: { id: true, status: true } },
      );

      if (found.data[0]?.id && found.data[0]?.id != body.id) {
        const msg = 'Modelo de documento com esse nome já existe';
        const ext = found.data[0].status === StatusEnum.INACTIVE ? ' inativado' : '';
        throw new BadRequestException(msg + ext);
      }
    }

    const model = await this.documentModelRepository.update({
      companyId,
      ...body,
    });

    return model;
  }
}
