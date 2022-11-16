import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorMessageEnum } from '../../../../../shared/constants/enum/errorMessage';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { DocumentRepository } from '../../../repositories/implementations/DocumentRepository';

@Injectable()
export class FindByIdDocumentService {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async execute(id: number, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;
    const documentFound = await this.documentRepository.findFirstNude({
      where: {
        id,
        companyId,
      },
      include: { oldDocuments: true },
    });

    if (!documentFound?.id) throw new BadRequestException(ErrorMessageEnum.DOCUMENT_NOT_FOUND);

    return documentFound;
  }
}
