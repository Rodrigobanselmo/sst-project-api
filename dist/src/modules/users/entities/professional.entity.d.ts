import { ProfessionalPCMSOEntity, ProfessionalRiskGroupEntity } from '../../sst/entities/usersRiskGroup';
import { Professional, ProfessionalTypeEnum, StatusEnum } from '@prisma/client';
import { UserEntity } from './user.entity';
import { InviteUsersEntity } from './invite-users.entity';
import { ProfessionalCouncilEntity } from './council.entity';
export declare class ProfessionalEntity implements Professional {
    id: number;
    name: string;
    email: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    companyId: string;
    formation: string[];
    certifications: string[];
    cpf: string;
    phone: string;
    type: ProfessionalTypeEnum;
    status: StatusEnum;
    user?: UserEntity;
    userId: number;
    invite: InviteUsersEntity;
    inviteId: string;
    councils?: ProfessionalCouncilEntity[];
    professionalPgrSignature?: ProfessionalRiskGroupEntity;
    professionalsPgrSignatures?: ProfessionalRiskGroupEntity[];
    professionalPcmsoSignature?: ProfessionalPCMSOEntity;
    professionalsPcmsoSignatures?: ProfessionalPCMSOEntity[];
    professionalId?: number;
    professional?: Partial<ProfessionalEntity>;
    councilType: string;
    councilUF: string;
    councilId: string;
    constructor(partial: Partial<ProfessionalEntity & {
        councils: any;
    }>);
}
