import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { FindDocumentModelDto } from '../../../dto/document-model.dto';
import { DocumentModelRepository } from '../../../repositories/implementations/DocumentModelRepository';

@Injectable()
export class FindDocumentModelService {
  constructor(private readonly documentModelRepository: DocumentModelRepository) {}

  async execute({ skip, take, ...query }: FindDocumentModelDto, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;

    const model = await this.documentModelRepository.find(
      {
        companyId,
        ...query,
      },
      { skip, take },
    );

    return model;
  }
}
