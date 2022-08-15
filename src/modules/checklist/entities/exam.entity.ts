import { ApiProperty } from '@nestjs/swagger';
import { Exam, ExamTypeEnum, StatusEnum } from '@prisma/client';
import { ExamRiskDataEntity } from './examRiskData.entity';
import { ExamToClinicEntity } from './examToClinic';

export class ExamEntity implements Exam {
  @ApiProperty({ description: 'The id of the Company' })
  id: number;
  name: string;
  instruction: string;
  material: string;
  companyId: string;
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
  // examToRisk: ExamToRiskEntity[]
  examsRiskData: ExamRiskDataEntity;

  constructor(partial: Partial<ExamEntity>) {
    Object.assign(this, partial);
  }
}
