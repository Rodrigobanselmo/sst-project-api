import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorMessageEnum } from '../../../../../shared/constants/enum/errorMessage';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ContactRepository } from '../../../repositories/implementations/ContactRepository';

@Injectable()
export class DeleteContactsService {
  constructor(private readonly contactRepository: ContactRepository) {}

  async execute(id: number, user: UserPayloadDto) {
    const contactFound = await this.contactRepository.findFirstNude({
      where: {
        id,
        companyId: user.targetCompanyId,
      },
    });

    if (!contactFound?.id)
      throw new BadRequestException(ErrorMessageEnum.CONTACT_NOT_FOUND);
    if (contactFound?.isPrincipal)
      throw new BadRequestException(ErrorMessageEnum.CONTACT_IS_PRINCIPAL);

    const contact = await this.contactRepository.delete(
      id,
      user.targetCompanyId,
    );

    return contact;
  }
}
