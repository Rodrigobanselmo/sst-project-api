import { StatusEnum } from '@prisma/client';
export declare class UpsertDocumentPCMSODto {
    id?: string;
    name: string;
    status?: StatusEnum;
    companyId: string;
    elaboratedBy: string;
    approvedBy: string;
    revisionBy: string;
    coordinatorBy: string;
    workspaceId?: string;
    validityEnd?: Date;
    validityStart?: Date;
    professionals?: ProfessionalDocumentPCMSODto[];
}
export declare class ProfessionalDocumentPCMSODto {
    documentPCMSOId: string;
    professionalId: number;
    isSigner: boolean;
    isElaborator: boolean;
}
