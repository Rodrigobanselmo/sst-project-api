import { StatusEnum } from '@prisma/client';
export declare class UpsertRiskGroupDataDto {
    id?: string;
    name: string;
    status?: StatusEnum;
    companyId: string;
    source: string;
    elaboratedBy: string;
    approvedBy: string;
    revisionBy: string;
    coordinatorBy: string;
    workspaceId?: string;
    isQ5?: boolean;
    hasEmergencyPlan?: boolean;
    complementarySystems?: string[];
    complementaryDocs: string[];
    visitDate: Date;
    validityEnd?: Date;
    validityStart?: Date;
    users?: UsersToRiskDataGroupDto[];
    professionals?: ProfessionalToRiskDataGroupDto[];
}
export declare class UsersToRiskDataGroupDto {
    riskFactorGroupDataId: string;
    userId: number;
    isSigner: boolean;
    isElaborator: boolean;
}
export declare class ProfessionalToRiskDataGroupDto {
    riskFactorGroupDataId: string;
    professionalId: number;
    isSigner: boolean;
    isElaborator: boolean;
}
