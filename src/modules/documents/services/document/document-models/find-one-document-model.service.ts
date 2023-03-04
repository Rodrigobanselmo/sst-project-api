import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { DocumentModelRepository } from '../../../repositories/implementations/DocumentModelRepository';

@Injectable()
export class FindOneDocumentModelService {
  constructor(private readonly documentModelRepository: DocumentModelRepository) {}

  async execute(id: number, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;

    const model = await this.documentModelRepository.findFirstNude({
      where: { id, companyId },
      select: {
        id: true,
        status: true,
        companyId: true,
        description: true,
        name: true,
        type: true,
        created_at: true,
        updated_at: true,
        system: true,
      },
    });

    return model;
  }
}
