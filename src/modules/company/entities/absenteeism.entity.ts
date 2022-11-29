import { ProfessionalEntity } from './../../users/entities/professional.entity';
import { Absenteeism, AbsenteeismMotive, DateUnitEnum, EsocialTable18Mot, ProfessionalCouncil, SexTypeEnum, StatusEnum } from '@prisma/client';
import { CidEntity } from './cid.entity';
import { EmployeeEntity } from './employee.entity';

export class AbsenteeismEntity implements Absenteeism {
  id: number;

  startDate: Date;
  endDate: Date;
  startTime: number;
  endTime: number;
  timeSpent: number;
  timeUnit: DateUnitEnum;
  isJustified: boolean;
  isExtern: boolean;
  docId: number;
  local: string;
  status: StatusEnum;

  observation: string;
  sameAsBefore: boolean;
  traffic: number;
  vacationStartDate: Date;
  vacationEndDate: Date;
  cnpjSind: string;
  infOnusRemun: number;
  cnpjMandElet: string;
  origRetif: number;
  tpProc: number;
  nrProc: number;
  motiveId: number;
  esocial18Motive: number;
  cidId: string;
  employeeId: number;

  cid?: CidEntity;
  employee?: EmployeeEntity;
  motive?: AbsenteeismMotive;
  esocial18?: EsocialTable18Mot;
  doc?: ProfessionalEntity;

  constructor(partial: Partial<AbsenteeismEntity>) {
    Object.assign(this, partial);
  }
}
