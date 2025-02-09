import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { resolve } from 'path';
import { RoleEnum } from './../../../../../shared/constants/enum/authorization';
import { UserPayloadDto } from './../../../../../shared/dto/user-payload.dto';
import { AuthGroupRepository } from './../../../../auth/repositories/implementations/AuthGroupRepository';
import { CompanyEntity } from './../../../../company/entities/company.entity';
import { CompanyRepository } from './../../../../company/repositories/implementations/CompanyRepository';

import { v4 } from 'uuid';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { NodeMailProvider } from '../../../../../shared/providers/MailProvider/implementations/NodeMail/NodeMailProvider';
import { InviteUserDto } from '../../../dto/invite-user.dto';
import { InviteUsersEntity } from '../../../entities/invite-users.entity';
import { InviteUsersRepository } from '../../../repositories/implementations/InviteUsersRepository';
import { UsersRepository } from '../../../repositories/implementations/UsersRepository';
import { ErrorInvitesEnum } from './../../../../../shared/constants/enum/errorMessage';
import { EmailPathEnum } from '@/templates/@v1/email';

@Injectable()
export class InviteUsersService {
  constructor(
    private readonly inviteUsersRepository: InviteUsersRepository,
    private readonly usersRepository: UsersRepository,
    private readonly authGroupRepository: AuthGroupRepository,
    private readonly dateProvider: DayJSProvider,
    private readonly companyRepository: CompanyRepository,
    private readonly mailProvider: NodeMailProvider,
  ) {}

  async execute(inviteUserDto: InviteUserDto, userPayloadDto: UserPayloadDto) {
    const userRoles = userPayloadDto.roles || [];
    const userPermissions = userPayloadDto.permissions || [];

    const userToAdd = await this.usersRepository.findByEmail(inviteUserDto.email);

    const company = await this.companyRepository.findById(inviteUserDto.companyId);

    const isConsulting = company.isConsulting;

    if (!isConsulting) inviteUserDto.companiesIds = [];

    const addRoles: string[] = [...(inviteUserDto.roles || [])];
    const addPermissions: string[] = [...(inviteUserDto.permissions || [])];

    if (inviteUserDto.groupId) {
      const authGroup = await this.authGroupRepository.findById(inviteUserDto.groupId, userPayloadDto.companyId);

      if (!authGroup?.id) throw new BadRequestException(ErrorInvitesEnum.AUTH_GROUP_NOT_FOUND);

      addPermissions.push(...authGroup.permissions);
      addRoles.push(...authGroup.roles);
    }

    if (!userRoles.includes(RoleEnum.MASTER)) {
      const hasAllRoles = addRoles.every((role) => userRoles.includes(role));
      const hasAllPermissions = addPermissions.every((addPermission) =>
        userPermissions.some(
          (userPermission) =>
            userPermission.split('-')[0] === addPermission.split('-')[0] && Array.from(addPermission.split('-')[1] || '').every((crud) => (userPermission.split('-')[1] || '').includes(crud)),
        ),
      );

      if (!hasAllRoles || !hasAllPermissions) throw new ForbiddenException(ErrorInvitesEnum.FORBIDDEN_INSUFFICIENT_PERMISSIONS);
    }

    if (userToAdd) {
      let userAlreadyAdded = userToAdd.companies.some((company) => company.companyId === inviteUserDto.companyId);

      if (isConsulting) userAlreadyAdded = userToAdd.companies.some((company) => inviteUserDto.companiesIds.includes(company.companyId));

      if (userAlreadyAdded) throw new BadRequestException(ErrorInvitesEnum.USER_ALREADY_EXIST);
    }

    let companies = {} as {
      data: CompanyEntity[];
      count: number;
    };

    if (!userRoles.includes(RoleEnum.MASTER))
      companies = await this.companyRepository.findAllRelatedByCompanyId(
        inviteUserDto.companyId,
        { companiesIds: inviteUserDto?.companiesIds || [] },
        { skip: 0, take: 100 },
        { select: { id: true } },
      );

    if (userRoles.includes(RoleEnum.MASTER)) companies = await this.companyRepository.findAll({ companiesIds: inviteUserDto?.companiesIds || [] }, { skip: 0, take: 100 }, { select: { id: true } });

    const expires_date = this.dateProvider.addDay(new Date(), 365);

    await this.inviteUsersRepository.deleteByCompanyIdAndEmail(inviteUserDto.companyId, inviteUserDto.email);

    const invite = await this.inviteUsersRepository.create(
      {
        email: v4(),
        ...inviteUserDto,
        companiesIds: companies.data.map((company) => company.id),
      },
      expires_date,
    );

    if (invite.email) await inviteNewUser(this.mailProvider, invite);

    return invite;
  }
}

export const inviteNewUser = async (mailProvider: NodeMailProvider, invite: InviteUsersEntity) => {
  const templatePath = EmailPathEnum.INVITE_USER;

  if (!invite.email) {
    throw new BadRequestException('Email não informado ou inválido');
  }

  // Todo: add company name
  const variables = {
    company: invite.companyName,
    link: `${process.env.APP_HOST}/cadastro/?token=${invite.id}&email=${invite.email}`,
  };

  await mailProvider.sendMail({
    path: templatePath,
    subject: 'Convite para se tornar membro',
    to: invite.email,
    variables,
  });
};
