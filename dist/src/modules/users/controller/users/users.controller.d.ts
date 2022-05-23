import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateUserDto } from '../../dto/create-user.dto';
import { ResetPasswordDto } from '../../dto/reset-pass';
import { UpdateUserCompanyDto } from '../../dto/update-user-company.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { CreateUserService } from '../../services/users/create-user/create-user.service';
import { FindByEmailService } from '../../services/users/find-by-email/find-by-email.service';
import { FindByIdService } from '../../services/users/find-by-id/find-by-id.service';
import { FindMeService } from '../../services/users/find-me/find-me.service';
import { ResetPasswordService } from '../../services/users/reset-password/reset-password.service';
import { UpdatePermissionsRolesService } from '../../services/users/update-permissions-roles/update-permissions-roles.service';
import { UpdateUserService } from '../../services/users/update-user/update-user.service';
export declare class UsersController {
    private readonly createUserService;
    private readonly resetPasswordService;
    private readonly updateUserService;
    private readonly findMeService;
    private readonly findByEmailService;
    private readonly findByIdService;
    private readonly updatePermissionsRolesService;
    constructor(createUserService: CreateUserService, resetPasswordService: ResetPasswordService, updateUserService: UpdateUserService, findMeService: FindMeService, findByEmailService: FindByEmailService, findByIdService: FindByIdService, updatePermissionsRolesService: UpdatePermissionsRolesService);
    findMe(userPayloadDto: UserPayloadDto): Promise<{
        companyId: string;
        permissions: string[];
        roles: string[];
        id: number;
        email: string;
        password: string;
        updated_at: Date;
        created_at: Date;
        companies?: import("../../entities/userCompany.entity").UserCompanyEntity[];
    }>;
    findId(id: number): Promise<import("../../entities/user.entity").UserEntity>;
    findEmail(email: string): Promise<import("../../entities/user.entity").UserEntity>;
    create(createUserDto: CreateUserDto): Promise<import("../../entities/user.entity").UserEntity>;
    update(updateUserDto: UpdateUserDto, { userId }: UserPayloadDto): Promise<import("../../entities/user.entity").UserEntity>;
    updatePermissionsRoles(updateUserCompanyDto: UpdateUserCompanyDto): Promise<import("../../entities/userCompany.entity").UserCompanyEntity>;
    reset(resetPasswordDto: ResetPasswordDto): Promise<import("../../entities/user.entity").UserEntity>;
}
