import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HashProvider } from '../../../../shared/providers/HashProvider/implementations/HashProvider';

import { UpdateUserDto } from '../../dto/update-user.dto';
import { UsersRepository } from '../../repositories/implementations/UsersRepository';

@Injectable()
export class UpdateUserService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly hashProvider: HashProvider,
  ) {}

  async execute(
    id: number,
    { password, oldPassword, ...restUpdateUserDto }: UpdateUserDto,
  ) {
    if (!id) throw new BadRequestException(`Bad Request`);

    const updateUserDto: UpdateUserDto = { ...restUpdateUserDto };

    const userData = await this.userRepository.findById(id);
    if (!userData) throw new NotFoundException(`user #${id} not found`);

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

    const user = await this.userRepository.update(id, updateUserDto);

    return user;
  }
}
