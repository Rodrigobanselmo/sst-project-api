import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { UserCompanyDto } from '../../dto/user-company.dto';
import { UserEntity } from '../../entities/user.entity';
import { IUsersRepository } from '../IUsersRepository.types';
export declare class UsersRepository implements IUsersRepository {
    private prisma;
    private count;
    constructor(prisma: PrismaService);
    create(createUserDto: Omit<CreateUserDto, 'token'>, userCompanyDto: UserCompanyDto[]): Promise<UserEntity>;
    update(id: number, { oldPassword, ...updateUserDto }: UpdateUserDto, userCompanyDto?: UserCompanyDto[]): Promise<UserEntity>;
    removeById(id: number): Promise<UserEntity>;
    findAll(): Promise<UserEntity[]>;
    findByEmail(email: string): Promise<UserEntity>;
    findById(id: number): Promise<UserEntity>;
}
