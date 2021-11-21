import { Injectable, BadRequestException } from '@nestjs/common';

import { UsersRepository } from '../../../repositories/implementations/UsersRepository';

@Injectable()
export class FindByEmailService {
  constructor(private readonly userRepository: UsersRepository) {}
  async execute(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user)
      throw new BadRequestException(`user with email ${email} not found`);
    return user;
  }
}
