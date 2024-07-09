import { Exam, ExamTypeEnum, StatusEnum } from '@prisma/client';

import { HomoGroupEntity } from '../../company/entities/homoGroup.entity';
import { ExamRiskEntity } from './examRisk.entity';
import { ExamRiskDataEntity } from './examRiskData.entity';
import { ExamToClinicEntity } from './examToClinic';
import { RiskFactorsEntity } from './risk.entity';

export interface IExamOriginData extends Partial<ExamRiskDataEntity> {
  origin?: string;
  status?: StatusEnum;
  prioritization?: number;
  skipEmployee?: boolean;
  closeToExpired?: boolean;
  expiredDate?: Date | null;
  doneDate?: Date | null;
  homogeneousGroup?: HomoGroupEntity;
  risk?: RiskFactorsEntity;
}

export interface IExamEmployeeCheck {
  isMale?: boolean;
  isFemale?: boolean;
  fromAge?: number;
  toAge?: number;
}

export interface IExamOrigins {
  exam: {
    id: string;
    name: string;
    isAttendance: boolean;
  };
  origins: IExamOriginData[];
}

export type IRiskExamMap = Record<string, { riskName: string; exams: Record<string, { name: string; id: string }> }>

export class ExamEntity implements Exam {
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
  isAvaliation: boolean;
  esocial27Code: string;
  examsRiskData?: ExamRiskDataEntity;
  examToRiskData?: ExamRiskDataEntity[];
  examToRisk?: ExamRiskEntity[];
  // origins?: IExamOriginData[];

  constructor(partial: Partial<ExamEntity>) {
    Object.assign(this, partial);

    // if (this?.examToRiskData) {
    //   this.examToRiskData = this.examToRiskData.map(
    //     (d) => new ExamRiskDataEntity(d),
    //   );
    // }

    // if (this?.examToRisk) {
    //   this.examToRisk = this.examToRisk.map((examToRisk) => {
    //     const examToRiskCopy = {} as any;
    //     Object.entries(examToRisk).forEach(([key, value]) => {
    //       if (typeof value !== 'object') examToRiskCopy[key] = value;
    //     });

    //     if (examToRisk?.risk) {
    //       const riskFactorCopy = {
    //         name: examToRisk.risk.name,
    //         id: examToRisk.risk.id,
    //       } as any;

    //       if (examToRisk.risk?.riskFactorData) {
    //         examToRisk.risk.riskFactorData = examToRisk.risk.riskFactorData.map(
    //           (riskData) => {
    //             riskData.riskFactor = riskFactorCopy;

    //             riskData.riskFactor.examToRisk = [examToRiskCopy];
    //             return new RiskFactorDataEntity(riskData);
    //           },
    //         );
    //       }
    //     }

    //     return examToRisk;
    //   });
    //   // this.examToRisk = this.examToRisk.map((d) => new ExamRiskDataEntity(d));
    // }

    // const origins: IExamOriginData[] = [];

    // if (this?.examToRisk) {
    //   this?.examToRisk.map((examToRisk) => {
    //     if (examToRisk?.risk) {
    //       if (examToRisk.risk?.representAll) {
    //         origins.push({
    //           isAdmission: examToRisk.isAdmission,
    //           isChange: examToRisk.isChange,
    //           isDismissal: examToRisk.isDismissal,
    //           isFemale: examToRisk.isFemale,
    //           isMale: examToRisk.isMale,
    //           isPeriodic: examToRisk.isPeriodic,
    //           isReturn: examToRisk.isReturn,
    //           lowValidityInMonths: examToRisk.lowValidityInMonths,
    //           validityInMonths: examToRisk.validityInMonths,
    //           toAge: examToRisk.toAge,
    //           fromAge: examToRisk.fromAge,
    //         });
    //       }
    //     }
    //   });
    // }
  }

  static getRiskExams(exams: IExamOrigins[]) {
    const riskExamMap: IRiskExamMap = {};

    if (!exams) return riskExamMap;

    exams.forEach((exam) => {
      exam.origins.forEach((origin) => {
        if (!riskExamMap[origin.risk?.id]) {
          riskExamMap[origin.risk?.id] = { riskName: origin.risk?.name, exams: {} };
        }

        riskExamMap[origin.risk?.id].exams[exam.exam.id] = { name: exam.exam.name, id: exam.exam.id };
      });
    });

    return riskExamMap
  }
}
