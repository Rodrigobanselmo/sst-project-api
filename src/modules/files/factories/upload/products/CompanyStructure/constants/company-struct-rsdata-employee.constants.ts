import { normalizeToUpperString } from '../../../../../../../shared/utils/normalizeString';
import { checkIsString } from '../../../../../../../shared/utils/validators/checkIsString';
import { checkIsValidDate } from '../../../../../../../shared/utils/validators/checkIsValidDate';
import { IColumnRuleMap, ISheetRuleMap } from '../../../types/IFileFactory.types';
import { CompanyStructHeaderEnum } from './company-struct.constants';

export const emptyHierarchy = '!!';

export enum CompanyStructRsDataEmployeeHeaderEnum {
  EMPLOYEE_CPF = 'ID',
  EMPLOYEE_NAME = 'Nome',
  EMPLOYEE_ADMISSION = 'Admissão',
  EMPLOYEE_DEMISSION = 'Demissão',
  ESOCIAL_CODE = 'Matrícula eSocial',
  EMPLOYEE_RG = 'RG',
  EMPLOYEE_BIRTH = 'Data Nasc.',
  SECTOR = 'Setor',
  OFFICE = 'Cargo',
  STATUS = 'Status',
}

export const CompanyStructRsDataEmployeeSheetMap: ISheetRuleMap = {};

export const CompanyStructRsDataEmployeeColumnMap: IColumnRuleMap<CompanyStructRsDataEmployeeHeaderEnum> = {
  [CompanyStructRsDataEmployeeHeaderEnum.EMPLOYEE_CPF]: {
    field: CompanyStructHeaderEnum.EMPLOYEE_CPF,
    checkHandler: checkIsString,
    database: 'cpf',
    required: true,
  },
  [CompanyStructRsDataEmployeeHeaderEnum.EMPLOYEE_NAME]: {
    field: CompanyStructHeaderEnum.EMPLOYEE_NAME,
    checkHandler: checkIsString,
    database: 'name',
    required: true,
    width: 50,
  },
  [CompanyStructRsDataEmployeeHeaderEnum.EMPLOYEE_ADMISSION]: {
    field: CompanyStructHeaderEnum.EMPLOYEE_ADMISSION,
    checkHandler: checkIsValidDate,
    database: 'admissionDate',
  },
  [CompanyStructRsDataEmployeeHeaderEnum.EMPLOYEE_DEMISSION]: {
    field: CompanyStructHeaderEnum.EMPLOYEE_DEMISSION,
    checkHandler: checkIsValidDate,
    database: 'demissionDate',
  },
  [CompanyStructRsDataEmployeeHeaderEnum.EMPLOYEE_BIRTH]: {
    field: CompanyStructHeaderEnum.EMPLOYEE_BIRTH,
    checkHandler: checkIsValidDate,
    database: 'birthday',
  },
  [CompanyStructRsDataEmployeeHeaderEnum.ESOCIAL_CODE]: {
    field: CompanyStructHeaderEnum.ESOCIAL_CODE,
    checkHandler: checkIsString,
    database: 'esocialCode',
  },
  [CompanyStructRsDataEmployeeHeaderEnum.EMPLOYEE_RG]: {
    field: CompanyStructHeaderEnum.EMPLOYEE_RG,
    checkHandler: checkIsString,
    database: 'rg',
  },
  [CompanyStructRsDataEmployeeHeaderEnum.SECTOR]: {
    field: CompanyStructHeaderEnum.SECTOR,
    checkHandler: checkIsString,
    transform: (v) => normalizeToUpperString(v),
    requiredIfOneExist: [
      CompanyStructRsDataEmployeeHeaderEnum.EMPLOYEE_ADMISSION,
      CompanyStructRsDataEmployeeHeaderEnum.OFFICE,
    ],
    database: 'sector',
  },
  [CompanyStructRsDataEmployeeHeaderEnum.OFFICE]: {
    field: CompanyStructHeaderEnum.OFFICE,
    checkHandler: checkIsString,
    transform: (v) => normalizeToUpperString(v),
    requiredIfOneExist: [CompanyStructRsDataEmployeeHeaderEnum.EMPLOYEE_ADMISSION],
    database: 'office',
  },
  [CompanyStructRsDataEmployeeHeaderEnum.STATUS]: {
    checkHandler: checkIsString,
    field: 'none',
    database: 'none',
  },
};
