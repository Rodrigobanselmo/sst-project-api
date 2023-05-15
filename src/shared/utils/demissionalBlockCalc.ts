import { CompanyEntity } from '../../modules/company/entities/company.entity';
import { dayjs } from '../providers/DateProvider/implementations/DayJSProvider';

export const isShouldDemissionBlock = (
  company: CompanyEntity,
  {
    expiredDate,
    validityInMonths,
    doneDate: doneDateProp,
    dismissalDate,
  }: {
    expiredDate?: Date;
    doneDate?: Date;
    dismissalDate?: Date;
    validityInMonths?: number;
  },
) => {
  if (!company?.blockResignationExam || !doneDateProp) return false;

  const doneDate = doneDateProp ? dayjs(doneDateProp) : dayjs(expiredDate).add(-(validityInMonths || 0), 'months');
  const riskDegreeDays = getRiskDegreeBlockDays(company);
  const diff = doneDate ? Math.abs(doneDate.diff(dayjs(), 'day')) ?? 1000 : 1000;

  if (diff > riskDegreeDays) {
    return false;
  }
  return true;
};

export const getRiskDegreeBlockDays = (company: CompanyEntity) => {
  const riskDegreeDays = (company?.riskDegree ?? 1) >= 3 ? 135 : 90;
  return riskDegreeDays;
};
