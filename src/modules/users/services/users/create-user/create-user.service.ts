import { BadRequestException, Injectable } from '@nestjs/common';
import { InviteUsersRepository } from '../../../../../modules/users/repositories/implementations/InviteUsersRepository';
import {
  ErrorAuthEnum,
  ErrorInvitesEnum,
} from '../../../../../shared/constants/enum/errorMessage';

import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { HashProvider } from '../../../../../shared/providers/HashProvider/implementations/HashProvider';
import { CreateUserDto } from '../../../dto/create-user.dto';
import { UserCompanyDto } from '../../../dto/user-company.dto';
import { UsersRepository } from '../../../repositories/implementations/UsersRepository';
import { FindByTokenService } from '../../invites/find-by-token/find-by-token.service';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly findByTokenService: FindByTokenService,
    private readonly dateProvider: DayJSProvider,
    private readonly hashProvider: HashProvider,
    private readonly inviteUsersRepository: InviteUsersRepository,
  ) {}

  async execute({ token, password, ...restCreateUserDto }: CreateUserDto) {
    const passHash = await this.hashProvider.createHash(password);
    const userAlreadyExist = await this.userRepository.findByEmail(
      restCreateUserDto.email,
    );

    if (userAlreadyExist)
      throw new BadRequestException(ErrorAuthEnum.USER_ALREADY_EXIST);

    const { companies, email, companyId } = await getCompanyPermissionByToken(
      token,
      restCreateUserDto.email,
      this.findByTokenService,
      this.dateProvider,
    );

    const userData = {
      ...restCreateUserDto,
      password: passHash,
    };

    const user = await this.userRepository.create(userData, companies);
    if (email && companyId)
      await this.inviteUsersRepository.deleteByCompanyIdAndEmail(
        companyId,
        email,
      );

    delete user.password;
    return user;
  }
}

export const getCompanyPermissionByToken = async (
  token: string,
  email: string,
  findByTokenService: FindByTokenService,
  dateProvider: DayJSProvider,
) => {
  if (!token) return { companies: [] };

  const invite = await findByTokenService.execute(token);

  const currentDate = dateProvider.dateNow();
  const expires_date = new Date(dateProvider.convertToUTC(invite.expires_date));

  if (invite.email !== email)
    throw new BadRequestException(ErrorInvitesEnum.TOKEN_NOT_VALID_EMAIL);

  if (currentDate > expires_date)
    throw new BadRequestException(ErrorInvitesEnum.TOKEN_EXPIRES);

  const companies: UserCompanyDto[] = [
    {
      permissions: invite.permissions,
      roles: invite.roles,
      companyId: invite.companyId,
    },
  ];

  return { companies, email: invite.email, companyId: invite.companyId };
};
