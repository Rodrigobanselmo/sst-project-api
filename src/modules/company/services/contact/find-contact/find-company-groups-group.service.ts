import { FindContactDto } from './../../../dto/contact.dto';
import { ContactRepository } from '../../../repositories/implementations/ContactRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindContactsService {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute({ skip, take, ...query }: FindContactDto, user: UserPayloadDto) {
    const access = await this.contactRepository.findAllByCompany({ companyId: user.targetCompanyId, ...query }, { skip, take });

    return access;
  }
}
