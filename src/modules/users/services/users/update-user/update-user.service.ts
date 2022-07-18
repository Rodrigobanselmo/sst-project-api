import { BadRequestException, Injectable } from '@nestjs/common';

import { InviteUsersRepository } from '../../../../../modules/users/repositories/implementations/InviteUsersRepository';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { HashProvider } from '../../../../../shared/providers/HashProvider/implementations/HashProvider';
import { UpdateUserDto } from '../../../dto/update-user.dto';
import { UsersRepository } from '../../../repositories/implementations/UsersRepository';
import { FindByTokenService } from '../../invites/find-by-token/find-by-token.service';
import { getCompanyPermissionByToken } from '../create-user/create-user.service';

@Injectable()
export class UpdateUserService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly hashProvider: HashProvider,
    private readonly dateProvider: DayJSProvider,
    private readonly findByTokenService: FindByTokenService,
    private readonly inviteUsersRepository: InviteUsersRepository,
  ) {}

  async execute(
    id: number,
    { password, oldPassword, token, ...restUpdateUserDto }: UpdateUserDto,
  ) {
    if (!id) throw new BadRequestException(`Bad Request`);

    const updateUserDto: UpdateUserDto = { ...restUpdateUserDto };

    const userData = await this.userRepository.findById(id);
    if (!userData) throw new BadRequestException(`user #${id} not found`);

    if (restUpdateUserDto.googleExternalId) {
      const user = await this.userRepository.findByGoogleExternalId(
        restUpdateUserDto.googleExternalId,
      );
      if (user && user.id !== id) {
        await this.userRepository.update(user.id, {
          googleExternalId: null,
        });
      }
    }

    if (password) {
      if (!oldPassword) throw new BadRequestException(`Old password missing`);

      const passwordMatch = await this.hashProvider.compare(
        oldPassword,
        userData.password,
      );

      if (!passwordMatch) {
        throw new BadRequestException('password incorrect');
      }

      const passHash = await this.hashProvider.createHash(password);
      updateUserDto.password = passHash;
    }

    const { companies, email, companyId } = await getCompanyPermissionByToken(
      token,
      userData.email,
      this.findByTokenService,
      this.dateProvider,
    );

    const user = await this.userRepository.update(id, updateUserDto, companies);
    if (email && companyId)
      await this.inviteUsersRepository.deleteByCompanyIdAndEmail(
        companyId,
        email,
      );

    return user;
  }
}
