import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CompanyOSRepository } from './../../../repositories/implementations/CompanyOSRepository';

@Injectable()
export class DeleteCompanyOSService {
  constructor(private readonly companyOSRepository: CompanyOSRepository) {}

  async execute(id: number, user: UserPayloadDto) {
    const contact = await this.companyOSRepository.delete(id, user.targetCompanyId);

    return contact;
  }
}
