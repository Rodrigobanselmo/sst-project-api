import { StatusEmployeeStepEnum } from './../../../shared/constants/enum/statusEmployeeStep.enum';
import { getEmployeeRowStatus } from './../../../shared/utils/getExpiredExamStatus.utils';
import { StatusExamEnum } from 'src/shared/constants/enum/statusExam.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Company, Employee, Hierarchy, SexTypeEnum, StatusEnum } from '@prisma/client';
import { EmployeePPPHistoryEntity } from './employee-ppp-history.entity';
import { CompanyEntity } from './company.entity';
import { EmployeeExamsHistoryEntity } from './employee-exam-history.entity';
import { EmployeeHierarchyHistoryEntity } from './employee-hierarchy-history.entity';
import { HierarchyEntity } from './hierarchy.entity';

import { WorkspaceEntity } from './workspace.entity';
import { CidEntity } from './cid.entity';

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

  constructor(
    partial: Partial<Omit<EmployeeEntity, 'company'>> & {
      hierarchy?: Hierarchy;
      company?: Partial<Company>;
    },
    options: { skipNewExamAdded?: boolean } = {},
  ) {
    Object.assign(this, partial);

    if (!options.skipNewExamAdded && this.newExamAdded) {
      //? toda vez que um novo exame é adicionado a um funcionario ou cargo e o funcionario possui um exame expirado, ele salva a data de hoje como newExamAdded
      if (!this.expiredDateExam) this.expiredDateExam = this.newExamAdded;
      if (this.expiredDateExam > this.newExamAdded) this.expiredDateExam = this.newExamAdded;

      if (this.examsHistory) {
        this.examsHistory = this.examsHistory.map((e) => {
          if ((e?.exam?.isAttendance || e.evaluationType == 'APTO') && e.doneDate <= this.newExamAdded) {
            if (!e.expiredDate) e.expiredDate = this.newExamAdded;
            if (e.expiredDate > this.newExamAdded) e.expiredDate = this.newExamAdded;
          }
          return e;
        });
      }
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
      this.statusExam = getEmployeeRowStatus(this as EmployeeEntity);
    }

    if (this.hierarchyHistory) {
      this.hierarchyHistory = this.hierarchyHistory.map((hierarchyHistory) => new EmployeeHierarchyHistoryEntity(hierarchyHistory));
      const admissionDate = this.hierarchyHistory.find((h) => h?.motive == 'ADM')?.startDate;
      if (admissionDate) this.admissionDate = admissionDate;
    }

    if (this.statusExam && this.hierarchyHistory) {
      if (this.hierarchyId) {
        this.statusStep = StatusEmployeeStepEnum.ADMISSION;

        if ((!this.lastExam && !this.lastDoneExam) || this.lastDoneExam?.examType == 'DEMI') this.statusStep = StatusEmployeeStepEnum.IN_ADMISSION;
        if (this.hierarchyHistory?.[0]?.motive == 'ADM' && this.lastDoneExam?.examType == 'DEMI') this.statusStep = StatusEmployeeStepEnum.IN_ADMISSION;
      } else if (!this.hierarchyId) {
        if (this.hierarchyHistory?.[0]?.motive == 'DEM') {
          if (this.lastDoneExam?.examType == 'DEMI') this.statusStep = StatusEmployeeStepEnum.DEMISSION;
          else this.statusStep = StatusEmployeeStepEnum.IN_DEMISSION;
        }

        if (this.hierarchyHistory?.[0]?.motive == 'ADM' && [StatusExamEnum.EXPIRED, StatusExamEnum.PENDING, StatusExamEnum.PROCESSING].includes(this.statusExam)) {
          if ((!this.lastExam && !this.lastDoneExam) || this.lastDoneExam?.examType == 'DEMI') this.statusStep = StatusEmployeeStepEnum.IN_ADMISSION;
        }

        if (this.hierarchyHistory?.[0]?.motive == undefined) {
          this.statusStep = StatusEmployeeStepEnum.IN_ADMISSION;
        }
      }
    }
  }
}
