import { IExamOriginData } from './../../../../../../sst/entities/exam.entity';
import clone from 'clone';
import { getIsTodosRisk } from './../../../../../../../shared/utils/getIsTodosRisk';

export const getX = (isSelected: boolean) => {
  return {
    text: isSelected ? 'X' : '',
    size: 1,
    fontSize: 15,
  };
};

export const getIsAll = (riskId: string, riskName?: string) => {
  const isAll = getIsTodosRisk({ riskId }) || !riskName;
  return isAll;
};

export const removeExamsDuplicated = (
  hierarchyExamsMap: Record<string, Record<string, { name: string; origin?: IExamOriginData }[]>>,
) => {
  const hierarchyExamsUniqueMap = clone(hierarchyExamsMap);

  Object.values(hierarchyExamsUniqueMap).forEach((hierarchy) => {
    Object.values(hierarchy).forEach((exams) => {
      const examsClone = clone(exams);
      let count = 0;

      examsClone.forEach((exam, index) => {
        const examIndex = examsClone.findIndex((e) => {
          return (
            e.origin?.isMale === exam.origin?.isMale &&
            e.origin?.isFemale === exam.origin?.isFemale &&
            e.origin?.isPeriodic === exam.origin?.isPeriodic &&
            e.origin?.isChange === exam.origin?.isChange &&
            e.origin?.isAdmission === exam.origin?.isAdmission &&
            e.origin?.isReturn === exam.origin?.isReturn &&
            e.origin?.isDismissal === exam.origin?.isDismissal &&
            e.origin?.validityInMonths === exam.origin?.validityInMonths &&
            e.origin?.lowValidityInMonths === exam.origin?.lowValidityInMonths &&
            e.origin?.fromAge === exam.origin?.fromAge &&
            e.origin?.toAge === exam.origin?.toAge
          );
        });

        if (examIndex !== index) {
          exams.splice(index - count, 1);
          count++;
        }
      });
    });
  });

  return hierarchyExamsUniqueMap;
};
