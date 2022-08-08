import { UpdateContactDto } from '../../../dto/contact.dto';
import { ContactRepository } from '../../../repositories/implementations/ContactRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateContactsService {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(UpsertContactsDto: UpdateContactDto, user: UserPayloadDto) {
    const contact = await this.contactRepository.update({
      ...UpsertContactsDto,
      companyId: user.targetCompanyId,
    });

    return contact;
  }
}
