import { Injectable } from '@nestjs/common';
import { CompanyRepository } from 'src/modules/company/repositories/implementations/CompanyRepository';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';

@Injectable()
export class FindCompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(user: UserPayloadDto) {
    return await this.companyRepository.findById(user.companyId, {
      include: { workspace: true },
    });
  }
}
