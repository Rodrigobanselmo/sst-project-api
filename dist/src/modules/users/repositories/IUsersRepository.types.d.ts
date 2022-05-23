import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserCompanyDto } from '../dto/user-company.dto';
import { UserEntity } from '../entities/user.entity';
interface IUsersRepository {
    create(createUserDto: CreateUserDto, userCompanyDto: UserCompanyDto[]): Promise<UserEntity>;
    update(id: number, updateUserDto: UpdateUserDto, userCompanyDto: UserCompanyDto[]): Promise<UserEntity>;
    removeById(id: number): Promise<UserEntity>;
    findAll(): Promise<UserEntity[]>;
    findByEmail(email: string): Promise<UserEntity>;
    findById(id: number): Promise<UserEntity>;
}
export { IUsersRepository };
