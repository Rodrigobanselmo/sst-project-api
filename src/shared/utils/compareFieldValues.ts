export const compareFieldValues = (
  object1: any,
  object2: any,
  options?: {
    fields?: string[];
    skipUndefined?: boolean;
  },
): boolean => {
  const fieldCheck = Object.keys({ ...object1, ...object2 })
    .map((fieldName) => {
      if (options?.fields) {
        const include = options?.fields.includes(fieldName);
        if (!include) return null;
      }
      const obj1 = object1[fieldName];
      const obj2 = object2[fieldName];

      if (options?.skipUndefined) {
        const skip = obj1 === undefined || obj2 === undefined;
        if (skip) return null;
      }

      const equal = obj1 == obj2;

      return equal;
    })
    .filter((i) => i !== null);

  const isEqual = fieldCheck.every((field) => field);

  return isEqual;
};
