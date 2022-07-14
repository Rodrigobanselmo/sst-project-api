import { Injectable } from '@nestjs/common';

import { CompanyRepository } from '../../../../../modules/company/repositories/implementations/CompanyRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class FindCompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(user: UserPayloadDto) {
    return await this.companyRepository.findById(user.targetCompanyId, {
      include: {
        workspace: true,
        primary_activity: true,
        secondary_activity: true,
      },
    });
  }
}
