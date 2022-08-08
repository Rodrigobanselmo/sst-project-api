import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CreateContactDto } from '../../../dto/contact.dto';
import { ContactRepository } from '../../../repositories/implementations/ContactRepository';

@Injectable()
export class CreateContactsService {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(UpsertContactsDto: CreateContactDto, user: UserPayloadDto) {
    const contact = await this.contactRepository.create({
      ...UpsertContactsDto,
      companyId: user.targetCompanyId,
    });

    return contact;
  }
}
