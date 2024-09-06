
export type IExamRequirementVO = {
  fromAge: number | null;
  toAge: number | null;
  isAdmission: boolean;
  isChange: boolean;
  isDismissal: boolean;
  isFemale: boolean;
  isMale: boolean;
  isPeriodic: boolean;
  isReturn: boolean;
  validityInMonths: number | null;
  lowValidityInMonths: number | null;
  considerBetweenDays: number | null;
}

export class ExamRequirementVO {
  fromAge: number | null;
  toAge: number | null;
  isAdmission: boolean;
  isChange: boolean;
  isDismissal: boolean;
  isFemale: boolean;
  isMale: boolean;
  isPeriodic: boolean;
  isReturn: boolean;
  validityInMonths: number | null;
  lowValidityInMonths: number | null;
  considerBetweenDays: number | null;

  constructor(params: IExamRequirementVO) {
    this.fromAge = params.fromAge;
    this.toAge = params.toAge;
    this.isAdmission = params.isAdmission;
    this.isChange = params.isChange;
    this.isDismissal = params.isDismissal;
    this.isFemale = params.isFemale;
    this.isMale = params.isMale;
    this.isPeriodic = params.isPeriodic;
    this.isReturn = params.isReturn;
    this.validityInMonths = params.validityInMonths;
    this.lowValidityInMonths = params.lowValidityInMonths;
    this.considerBetweenDays = params.considerBetweenDays;
  }
}
