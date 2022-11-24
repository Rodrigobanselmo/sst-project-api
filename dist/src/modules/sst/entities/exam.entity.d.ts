import { Exam, ExamTypeEnum, StatusEnum } from '@prisma/client';
import { HomoGroupEntity } from '../../company/entities/homoGroup.entity';
import { ExamRiskEntity } from './examRisk.entity';
import { ExamRiskDataEntity } from './examRiskData.entity';
import { ExamToClinicEntity } from './examToClinic';
export interface IExamOriginData extends Partial<ExamRiskDataEntity> {
    origin?: string;
    status?: StatusEnum;
    prioritization?: number;
    skipEmployee?: boolean;
    closeToExpired?: boolean;
    expiredDate?: Date | null;
    homogeneousGroup?: HomoGroupEntity;
    risk?: {
        name: string;
        id: string;
    };
}
export interface IExamEmployeeCheck {
    isMale?: boolean;
    isFemale?: boolean;
    fromAge?: number;
    toAge?: number;
}
export declare class ExamEntity implements Exam {
    id: number;
    name: string;
    instruction: string;
    material: string;
    companyId: string;
    obsProc: string;
    status: StatusEnum;
    type: ExamTypeEnum;
    updated_at: Date;
    created_at: Date;
    system: boolean;
    analyses: string;
    deleted_at: Date;
    examToClinic: ExamToClinicEntity[];
    isAttendance: boolean;
    esocial27Code: string;
    examsRiskData?: ExamRiskDataEntity;
    examToRiskData?: ExamRiskDataEntity[];
    examToRisk?: ExamRiskEntity[];
    constructor(partial: Partial<ExamEntity>);
}
