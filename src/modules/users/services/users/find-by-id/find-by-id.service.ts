import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersRepository } from '../../../repositories/implementations/UsersRepository';

@Injectable()
export class FindByIdService {
  constructor(private readonly userRepository: UsersRepository) {}
  async execute(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new BadRequestException(`user with id ${id} not found`);
    delete user.password;
    return user;
  }
}
