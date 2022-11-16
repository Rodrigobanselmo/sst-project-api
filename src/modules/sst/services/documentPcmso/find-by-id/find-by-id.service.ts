import { Injectable } from '@nestjs/common';
import { DocumentPCMSORepository } from '../../../repositories/implementations/DocumentPCMSORepository';

@Injectable()
export class FindByIdDocumentPCMSOService {
  constructor(private readonly documentPCMSORepository: DocumentPCMSORepository) {}

  async execute(companyId: string) {
    const riskGroupData = await this.documentPCMSORepository.findById(companyId, {
      include: {
        // usersSignatures: { include: { user: true } },
        professionalsSignatures: {
          include: { professional: { include: { professional: true } } },
        },
      },
    });

    return riskGroupData;
  }
}
