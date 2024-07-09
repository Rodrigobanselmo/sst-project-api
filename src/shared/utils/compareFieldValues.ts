import { UpdateEmployeeExamHistoryDto } from './../../modules/company/dto/employee-exam-history';
export const compareFieldValues = (
  object1: any,
  object2: any,
  options?: {
    fields?: string[];
    ignoreFields?: string[];
    skipUndefined?: boolean;
  },
): boolean => {
  const fieldCheck = Object.keys({ ...object1, ...object2 })
    .map((fieldName) => {
      if (options?.fields) {
        const include = options?.fields.includes(fieldName);
        if (!include) return null;
      }
      if (options?.ignoreFields) {
        const include = options?.ignoreFields.includes(fieldName);
        if (include) return null;
      }
      const obj1 = object1[fieldName];
      const obj2 = object2[fieldName];

      if (options?.skipUndefined) {
        const skip = obj1 === undefined || obj2 === undefined;
        if (skip) return null;
      }

      const equal = String(obj1) == String(obj2);

      return equal;
    })
    .filter((i) => i !== null);

  const isEqual = fieldCheck.every((field) => field);

  return isEqual;
};

export const checkExamFields: (keyof UpdateEmployeeExamHistoryDto)[] = [
  'doctorId',
  'doneDate',
  'evaluationType',
  'examId',
  'examType',
  'status',
];
