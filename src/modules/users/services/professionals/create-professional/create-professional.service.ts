import { UsersRepository } from './../../../repositories/implementations/UsersRepository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PermissionEnum, RoleEnum } from '../../../../../shared/constants/enum/authorization';

import { UserCompanyDto, UserPayloadDto } from './../../../../../shared/dto/user-payload.dto';
import { CreateProfessionalDto } from './../../../dto/professional.dto';
import { ProfessionalRepository } from './../../../repositories/implementations/ProfessionalRepository';
import { ProfessionalTypeEnum } from '@prisma/client';
import { inviteNewUser } from '../../invites/invite-users/invite-users.service';
import { NodeMailProvider } from '../../../../../shared/providers/MailProvider/implementations/NodeMail/NodeMailProvider';

@Injectable()
export class CreateProfessionalService {
  constructor(
    private readonly professionalRepository: ProfessionalRepository,
    private readonly userRepository: UsersRepository,
    private readonly mailProvider: NodeMailProvider,
  ) {}

  async execute({ ...createDataDto }: CreateProfessionalDto, user: UserPayloadDto) {
    const professionalFound = await this.professionalRepository.findFirstNude({
      where: {
        companyId: user.targetCompanyId,
        OR: [
          { cpf: createDataDto.cpf || 'not-found' },
          { user: { email: createDataDto.email || 'not-found' } },
          ...createDataDto.councils.map((council) => ({
            councils: {
              some: {
                councilId: council.councilId || 'not-found',
                councilType: council.councilType || 'not-found',
                councilUF: council.councilUF || 'not-found',
              },
            },
          })),
        ],
      },
    });

    const permissions: string[] = [];
    const roles: string[] = [];

    if (
      ([ProfessionalTypeEnum.DOCTOR, ProfessionalTypeEnum.NURSE] as ProfessionalTypeEnum[]).includes(createDataDto.type)
    ) {
      roles.push(RoleEnum.DOCTOR);
    }

    if (professionalFound?.id) throw new BadRequestException('Professional já cadastrado');
    if (createDataDto.userId) {
      const useCompany: UserCompanyDto[] = [
        {
          permissions,
          roles,
          companyId: user.targetCompanyId,
        },
      ];

      const userPayload = await this.userRepository.update(
        createDataDto.userId,
        {
          type: createDataDto.type || undefined,
          phone: createDataDto.phone || undefined,
        },
        useCompany,
      );

      return userPayload.professional;
    }

    const sendEmail = createDataDto.sendEmail;

    delete createDataDto.userId;
    delete createDataDto.sendEmail;

    const professional = await this.professionalRepository.create({ ...createDataDto, roles }, user.targetCompanyId);

    if (sendEmail) await inviteNewUser(this.mailProvider, professional.invite);

    return professional;
  }
}
