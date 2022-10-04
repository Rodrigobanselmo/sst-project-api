import { FindDocumentDto } from '../../../dto/document.dto';
import { DocumentRepository } from '../../../repositories/implementations/DocumentRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindDocumentService {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async execute(
    { skip, take, ...query }: FindDocumentDto,
    user: UserPayloadDto,
  ) {
    const access = await this.documentRepository.find(
      { companyId: user.targetCompanyId, ...query },
      { skip, take },
      {
        select: {
          fileUrl: true,
          endDate: true,
          startDate: true,
          name: true,
          id: true,
          status: true,
          type: true,
          companyId: true,
        },
        where: { parentDocumentId: null },
      },
    );

    return access;
  }
}
