import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../../../repositories/implementations/UsersRepository';

@Injectable()
export class FindMeService {
  constructor(private readonly userRepository: UsersRepository) {}
  async execute(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException(`user with id ${id} not found`);
    return user;
  }
}
