import { StatusEmployeeStepEnum } from './../../../shared/constants/enum/statusEmployeeStep.enum';
import { getEmployeeRowStatus } from './../../../shared/utils/getExpiredExamStatus.utils';
import { StatusExamEnum } from './../../../shared/constants/enum/statusExam.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Company, Employee, ExamHistoryTypeEnum, Hierarchy, SexTypeEnum, StatusEnum } from '@prisma/client';
import { EmployeePPPHistoryEntity } from './employee-ppp-history.entity';
import { CompanyEntity } from './company.entity';
import { EmployeeExamsHistoryEntity } from './employee-exam-history.entity';
import { EmployeeHierarchyHistoryEntity } from './employee-hierarchy-history.entity';
import { HierarchyEntity } from './hierarchy.entity';

import { WorkspaceEntity } from './workspace.entity';
import { CidEntity } from './cid.entity';
import dayjs from 'dayjs';
import { dismissalDate } from './../../../shared/constants/ids';

export class EmployeeEntity implements Employee {
  @ApiProperty({ description: 'The id of the Employee' })
  id: number;

  @ApiProperty({ description: 'The name of the Employee' })
  name: string;

  @ApiProperty({ description: 'The cpf name of the Employee' })
  cpf: string;

  @ApiProperty({
    description: 'The current status of the Employee',
    examples: ['ACTIVE', 'INACTIVE'],
  })
  status: StatusEnum;

  @ApiProperty({
    description: 'The company id of the employee',
  })
  companyId: string;

  @ApiProperty({ description: 'The creation date of the Employee' })
  created_at: Date;

  @ApiProperty({
    description: 'The last time that the Employee data was updated',
  })
  updated_at: Date;

  @ApiProperty({ description: 'The hierarchy id of the Employee' })
  hierarchyId: string;

  @ApiProperty({ description: 'The workspaces related to the Employee' })
  workspaces?: WorkspaceEntity[];

  @ApiProperty({ description: 'The hierarchy of the Employee' })
  hierarchy?: Partial<HierarchyEntity>;

  subOffices?: Partial<HierarchyEntity>[];
  directory?: string;
  management?: string;
  sector?: string;
  sub_sector?: string;
  office?: string;
  sub_office?: string;

  esocialCode: string;
  socialName: string;
  nickname: string;
  phone: string;
  email: string;
  isComorbidity: boolean;
  skippedDismissalExam: boolean;
  sex: SexTypeEnum;
  shiftId: number;
  normalized: string;
  birthday: Date;
  admissionDate: Date;
  lastExam: Date;
  expiredDateExam: Date;
  newExamAdded: Date;
  cbo: string;
  rg: string;
  isPCD: boolean;
  statusExam?: StatusExamEnum;
  statusStep?: StatusEmployeeStepEnum;
  // sendEvent: boolean;
  company?: CompanyEntity;
  cids?: CidEntity[];
  examsHistory?: EmployeeExamsHistoryEntity[];
  hierarchyHistory?: EmployeeHierarchyHistoryEntity[];
  pppHistory?: EmployeePPPHistoryEntity[];
  sectorHierarchy?: HierarchyEntity;
  scheduleExam?: EmployeeExamsHistoryEntity;
  lastDoneExam?: EmployeeExamsHistoryEntity;
  examType?: ExamHistoryTypeEnum;
  infoExams?: Record<
    number,
    {
      expiredDate?: Date;
      lastDoneExamDate?: Date;
      lastScheduleExamDate?: Date;
      closeToExpired?: boolean;
      examId: number;
      isAttendance: boolean;
      status?: StatusExamEnum;
      validity?: number;
      validityDateString?: string;
      isScheduled?: boolean;
    }
  >;

  constructor(
    partial: Partial<Omit<EmployeeEntity, 'company'>> & {
      hierarchy?: Hierarchy;
      company?: Partial<Company>;
    },
    options: { skipNewExamAdded?: boolean } = {},
  ) {
    Object.assign(this, partial);

    this.newExamAdded = null;
    if (!options.skipNewExamAdded && this.newExamAdded) {
      //? toda vez que um novo exame é adicionado a um funcionario ou cargo e o funcionario possui um exame expirado, ele salva a data de hoje como newExamAdded

      // if (this.examsHistory) {
      //   this.examsHistory = this.examsHistory.map((e) => {
      //     if ((e?.exam?.isAttendance || e.evaluationType == 'APTO') && e.doneDate <= this.newExamAdded) {
      //       if (e.expiredDate > this.newExamAdded) e.expiredDate = this.newExamAdded;
      //       this.expiredDateExam = this.newExamAdded;
      //     }
      //     return e;
      //   });
      // } else {
      //   if (this.expiredDateExam > this.newExamAdded) this.expiredDateExam = this.newExamAdded;
      // }

      if (this.expiredDateExam > this.newExamAdded) this.expiredDateExam = this.newExamAdded;
    }

    if (this.hierarchy) {
      this.hierarchy = new HierarchyEntity(this.hierarchy);
    }

    if (this.hierarchy?.parents) {
      this.sectorHierarchy = this.hierarchy.parents.find((p) => p?.type == 'SECTOR');
    }

    if (this.company) {
      this.company = new CompanyEntity(this.company);
    }

    if (this.examsHistory) {
      this.examsHistory = this.examsHistory.map((examsHistory) => new EmployeeExamsHistoryEntity(examsHistory));
      this.scheduleExam = this.examsHistory.find((p) => p?.status == 'PROCESSING');
      this.lastDoneExam = this.examsHistory.find((p) => p?.status == 'DONE');
      this.statusExam = getEmployeeRowStatus(this.examsHistory[0], this.expiredDateExam);
    }

    if (this.hierarchyHistory) {
      this.hierarchyHistory = this.hierarchyHistory.map((hierarchyHistory) => new EmployeeHierarchyHistoryEntity(hierarchyHistory));
      const admissionDate = this.hierarchyHistory.find((h) => h?.motive == 'ADM')?.startDate;
      if (admissionDate) this.admissionDate = admissionDate;
    }

    if (this.statusExam && this.hierarchyHistory) {
      const actualHierarchy = this.hierarchyHistory?.[0];
      const isActualHierarchyAdm = actualHierarchy?.motive == 'ADM';
      const isActualHierarchyOfficeChange = ['TRANS', 'ALOC', 'PROM', 'TRANS_PROM'].includes(actualHierarchy?.motive);

      const isLastDoneExamDem = this.lastDoneExam && this.lastDoneExam?.examType == 'DEMI';
      const isLastDoneExamAdm = this.lastDoneExam && this.lastDoneExam?.examType == 'ADMI';
      const isLastDoneExamOffice = this.lastDoneExam && this.lastDoneExam?.examType == 'OFFI';
      const isMissingLastDoneExam = !this.lastExam && !this.lastDoneExam;
      const isExpiredExam = this.expiredDateExam && this.expiredDateExam < new Date();

      if (this.hierarchyId) {
        this.statusStep = StatusEmployeeStepEnum.ADMISSION;
        const isLastExamActualHierarchyId = this.lastDoneExam?.hierarchyId && this.lastDoneExam.hierarchyId == this.hierarchyId;
        const isLastExamBeforeHierarchyStartDate = this.lastDoneExam?.doneDate < actualHierarchy?.startDate;

        if (isActualHierarchyAdm && (!isLastExamActualHierarchyId || !isLastDoneExamAdm) && isLastExamBeforeHierarchyStartDate)
          this.statusStep = StatusEmployeeStepEnum.IN_ADMISSION;

        if (isActualHierarchyAdm && (!isLastExamActualHierarchyId || !isLastDoneExamAdm) && isLastExamBeforeHierarchyStartDate)
          this.statusStep = StatusEmployeeStepEnum.IN_ADMISSION;

        if (isExpiredExam && isActualHierarchyOfficeChange && (!isLastExamActualHierarchyId || !isLastDoneExamOffice) && isLastExamBeforeHierarchyStartDate)
          this.statusStep = StatusEmployeeStepEnum.IN_TRANS;

        const isOldHistory = actualHierarchy?.startDate && Math.abs(dayjs(actualHierarchy?.startDate).diff(dayjs(), 'month')) >= 2;

        if (!isOldHistory && (isMissingLastDoneExam || isLastDoneExamDem)) this.statusStep = StatusEmployeeStepEnum.IN_ADMISSION;
      } else if (!this.hierarchyId) {
        if (this.hierarchyHistory?.[0]?.motive == 'DEM') {
          if (isLastDoneExamDem) this.statusStep = StatusEmployeeStepEnum.DEMISSION;
          else if (dayjs(dismissalDate).isSame(this.expiredDateExam)) this.statusStep = StatusEmployeeStepEnum.DEMISSION;
          else this.statusStep = StatusEmployeeStepEnum.IN_DEMISSION;
        }

        if (isActualHierarchyAdm && [StatusExamEnum.EXPIRED, StatusExamEnum.PENDING, StatusExamEnum.PROCESSING].includes(this.statusExam)) {
          if (isMissingLastDoneExam || isLastDoneExamDem) this.statusStep = StatusEmployeeStepEnum.IN_ADMISSION;
        }

        if (this.hierarchyHistory?.[0]?.motive == undefined) {
          this.statusStep = StatusEmployeeStepEnum.IN_ADMISSION;
        }
      }
    }
  }
}
