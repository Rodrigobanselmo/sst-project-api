import { VariablesPGREnum } from '../../../builders/pgr/enums/variables.enum';
import { IDocVariables } from '../../../builders/pgr/types/section.types';

export const BulletTextConverter = (data: string[]): IDocVariables[] => {
  return data
    .map((doc) => ({
      [VariablesPGREnum.BULLET_TEXT]: doc || '',
    }))
    .sort((a, b) => a[VariablesPGREnum.BULLET_TEXT].localeCompare(b[VariablesPGREnum.BULLET_TEXT]));
};
