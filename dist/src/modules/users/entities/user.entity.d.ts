import { User } from '.prisma/client';
import { UserCompanyEntity } from './userCompany.entity';
export declare class UserEntity implements User {
    id: number;
    email: string;
    password: string;
    updated_at: Date;
    created_at: Date;
    companies?: UserCompanyEntity[];
    constructor(partial: Partial<UserEntity>);
}
