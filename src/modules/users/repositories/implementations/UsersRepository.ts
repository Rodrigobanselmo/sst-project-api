/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { UserCompanyDto } from '../../dto/user-company.dto';
import { UserEntity } from '../../entities/user.entity';
import { IUsersRepository } from '../IUsersRepository.types';

@Injectable()
export class UsersRepository implements IUsersRepository {
  private count = 0;
  constructor(private prisma: PrismaService) {}

  async create(
    createUserDto: Omit<CreateUserDto, 'token'>,
    userCompanyDto: UserCompanyDto[],
  ) {
    const user = await this.prisma.user.create({
      data: { ...createUserDto, companies: { create: userCompanyDto } },
      include: { companies: true },
    });

    return new UserEntity(user);
  }

  async update(
    id: number,
    { oldPassword, ...updateUserDto }: UpdateUserDto,
    userCompanyDto: UserCompanyDto[] = [],
  ) {
    const user = await this.prisma.user.update({
      where: { id: id },
      data: { ...updateUserDto, companies: { create: userCompanyDto } },
      include: { companies: true },
    });
    if (!user) return;
    return new UserEntity(user);
  }

  async removeById(id: number) {
    const user = await this.prisma.user.delete({ where: { id: id } });
    if (!user) return;
    return new UserEntity(user);
  }

  async findAllByCompany(companyId?: string) {
    const users = await this.prisma.user.findMany({
      where: { companies: { some: { companyId } } },
      include: { companies: true },
    });
    return users.map((user) => new UserEntity(user));
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { companies: true },
    });
    if (!user) return;
    return new UserEntity(user);
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { companies: true },
    });
    if (!user) return;
    return new UserEntity(user);
  }

  async findByGoogleExternalId(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { googleExternalId: id },
      include: { companies: true },
    });
    if (!user) return;
    return new UserEntity(user);
  }
}
