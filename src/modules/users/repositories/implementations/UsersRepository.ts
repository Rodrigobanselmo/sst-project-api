/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { UserEntity } from '../../entities/user.entity';
import { IUsersRepository } from '../IUsersRepository';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: createUserDto,
    });
    return new UserEntity(user);
  }

  async update(
    id: number,
    { email, oldPassword, ...updateUserDto }: UpdateUserDto,
  ) {
    const user = await this.prisma.user.update({
      where: { id: id },
      data: updateUserDto,
    });
    if (!user) return;
    return new UserEntity(user);
  }

  async removeById(id: number) {
    const user = await this.prisma.user.delete({ where: { id: id } });
    if (!user) return;
    return new UserEntity(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => new UserEntity(user));
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return;
    return new UserEntity(user);
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return;
    return new UserEntity(user);
  }
}
