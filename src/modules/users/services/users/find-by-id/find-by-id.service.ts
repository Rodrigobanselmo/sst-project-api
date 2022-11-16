import { Injectable, BadRequestException } from '@nestjs/common';
import { ErrorInvitesEnum } from '../../../../../shared/constants/enum/errorMessage';
import { UsersRepository } from '../../../repositories/implementations/UsersRepository';

@Injectable()
export class FindByIdService {
  constructor(private readonly userRepository: UsersRepository) {}
  async execute(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user?.id) throw new BadRequestException(ErrorInvitesEnum.USER_NOT_FOUND);
    delete user.password;
    return user;
  }
}
