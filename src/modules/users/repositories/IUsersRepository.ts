import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserEntity } from '../entities/user.entity';

interface IUsersRepository {
  create(createUserDto: CreateUserDto): Promise<UserEntity>;
  update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity>;
  removeById(id: number): Promise<UserEntity>;
  findAll(): Promise<UserEntity[]>;
  findByEmail(email: string): Promise<UserEntity>;
  findById(id: number): Promise<UserEntity>;
}
export { IUsersRepository };
