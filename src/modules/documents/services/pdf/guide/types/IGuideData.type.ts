import { EmployeeEntity } from 'src/modules/company/entities/employee.entity';
import { ExamHistoryTypeEnum } from '@prisma/client';
import { ExamEntity } from '../../../../../checklist/entities/exam.entity';
import { CompanyEntity } from '../../../../../company/entities/company.entity';
export interface IGuideDataType {}

export type IClinicExamData = {
  clinic: CompanyEntity;
  exam: ExamEntity;
  doneDate: Date;
  time: string;
  type: ExamHistoryTypeEnum;
  id: string;
  isScheduled: boolean;
  scheduleRange: any;
};

export type IClinicComplementaryData = {
  clinic: CompanyEntity;
  exams: ExamEntity[];
  doneDate: Date;
  time: string;
  isScheduled: boolean;
  scheduleRange: any;
};

export type IClinicComplementaryExamData = Record<
  string,
  IClinicComplementaryData
>;

export interface IPdfGuideData extends EmployeeEntity {
  clinics: CompanyEntity[];
  exams: ExamEntity[];
  consultantCompany: CompanyEntity;
  company: CompanyEntity;
  clinicExam: IClinicExamData;
  clinicComplementaryExams: IClinicComplementaryData[];
  user: {
    email: string;
    id: string;
  };
}
