export const KeysOfEnum = (enums: unknown) => {
  return Object.keys(enums)
    .filter((x) => !(parseInt(x) >= 0))
    .join(', ');
};
