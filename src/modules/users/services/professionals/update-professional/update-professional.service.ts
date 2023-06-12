import { ErrorMessageEnum } from './../../../../../shared/constants/enum/errorMessage';
import { ForbiddenException, Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { UpdateProfessionalDto } from '../../../dto/professional.dto';
import { ProfessionalRepository } from '../../../repositories/implementations/ProfessionalRepository';
import { inviteNewUser } from '../../invites/invite-users/invite-users.service';
import { NodeMailProvider } from './../../../../../shared/providers/MailProvider/implementations/NodeMail/NodeMailProvider';

@Injectable()
export class UpdateProfessionalService {
  constructor(private readonly mailProvider: NodeMailProvider, private readonly professionalRepository: ProfessionalRepository) { }

  async execute({ ...updateDataDto }: UpdateProfessionalDto, user: UserPayloadDto) {
    await this.checkIfCanUpdateProfessional(updateDataDto.id, user);

    const sendEmail = updateDataDto.sendEmail;

    delete updateDataDto.userId;
    delete updateDataDto.sendEmail;
    const professional = await this.professionalRepository.update(updateDataDto, { include: { invite: true } });

    if (sendEmail) await inviteNewUser(this.mailProvider, professional.invite);

    return professional;
  }

  async checkIfCanUpdateProfessional(id: number, user: UserPayloadDto, councilIds?: number[]) {
    if (!user.isMaster) {
      const foundProfessional = await this.professionalRepository.findFirstNude({
        where: {
          AND: [
            { id: id },
            {
              OR: [
                {
                  user: {
                    companies: {
                      some: {
                        companyId: {
                          in: [user.companyId, user.targetCompanyId],
                        },
                      },
                    },
                  },
                },
                { companyId: { in: [user.companyId, user.targetCompanyId] } },
              ],
            },
          ],
        },
        select: { userId: true, id: true, councils: { select: { id: true } } },
      });

      if (councilIds) {
        const foundCouncilIds = foundProfessional?.councils.map((council) => council.id);
        const notFoundCouncils = councilIds.filter((councilId) => !foundCouncilIds?.includes(councilId));

        if (notFoundCouncils.length) throw new ForbiddenException(ErrorMessageEnum.PROFESSIONAL_NOT_FOUND);
      }

      if (!foundProfessional?.id) {
        throw new ForbiddenException(ErrorMessageEnum.PROFESSIONAL_NOT_FOUND);
      }

      return foundProfessional;
    }
  }
}
