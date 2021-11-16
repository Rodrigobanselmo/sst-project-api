import { Injectable, NotFoundException } from '@nestjs/common';
import { DayJSProvider } from '../../../../shared/providers/DateProvider/implementations/DayJSProvider';

import { HashProvider } from '../../../../shared/providers/HashProvider/implementations/HashProvider';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UserCompanyDto } from '../../dto/user-company.dto';
import { InviteUsersRepository } from '../../repositories/implementations/InviteUsersRepository';
import { UsersRepository } from '../../repositories/implementations/UsersRepository';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly inviteUsersRepository: InviteUsersRepository,
    private readonly hashProvider: HashProvider,
    private readonly dateProvider: DayJSProvider,
  ) {}

  async execute({ token, password, ...restCreateUserDto }: CreateUserDto) {
    const passHash = await this.hashProvider.createHash(password);

    const companies: UserCompanyDto[] = await getCompanyByToken(
      token,
      restCreateUserDto.email,
      this.inviteUsersRepository,
      this.dateProvider,
    );

    const userData = {
      ...restCreateUserDto,
      password: passHash,
    };

    const user = await this.userRepository.create(userData, companies);

    return user;
  }
}

export const getCompanyByToken = async (
  token: string,
  email: string,
  inviteUsersRepository: InviteUsersRepository,
  dateProvider: DayJSProvider,
) => {
  if (!token) return [];
  const invite = await inviteUsersRepository.findById(token);

  if (!invite) throw new NotFoundException('Invite token not found');

  const currentDate = dateProvider.dateNow();
  const expires_date = new Date(dateProvider.convertToUTC(invite.expires_date));

  if (invite.email !== email)
    throw new NotFoundException('Invite token not valid for this email');

  if (currentDate > expires_date)
    throw new NotFoundException('Invite token is expired');

  const companies: UserCompanyDto[] = [
    {
      permissions: invite.permissions,
      roles: invite.roles,
      companyId: invite.companyId,
    },
  ];

  return companies;
};
