import { ISheetHeaderList } from '../../../../types/IFileFactory.types';
import { CompanyStructColumnMap, CompanyStructHeaderEnum } from '../company-struct.constants';

export const EmployeeColumnList: (opt: { workspaceLength: number }) => ISheetHeaderList = ({ workspaceLength }) => {
  return [
    ...(workspaceLength > 1 ? [{ group: [{ ...CompanyStructColumnMap[CompanyStructHeaderEnum.WORKSPACE], required: true }], name: 'Identifição Estabelecimento' }] : []),
    {
      group: [
        { ...CompanyStructColumnMap[CompanyStructHeaderEnum.EMPLOYEE_CPF], required: true },
        CompanyStructColumnMap[CompanyStructHeaderEnum.EMPLOYEE_NAME],
        CompanyStructColumnMap[CompanyStructHeaderEnum.EMPLOYEE_SEX],
        CompanyStructColumnMap[CompanyStructHeaderEnum.EMPLOYEE_BIRTH],
        CompanyStructColumnMap[CompanyStructHeaderEnum.EMPLOYEE_RG],
        CompanyStructColumnMap[CompanyStructHeaderEnum.EMPLOYEE_SOCIAL_NAME],
        CompanyStructColumnMap[CompanyStructHeaderEnum.EMPLOYEE_EMAIL],
        CompanyStructColumnMap[CompanyStructHeaderEnum.EMPLOYEE_PHONE],
        CompanyStructColumnMap[CompanyStructHeaderEnum.EMPLOYEE_IS_PCD],
        CompanyStructColumnMap[CompanyStructHeaderEnum.EMPLOYEE_ADMISSION],
        CompanyStructColumnMap[CompanyStructHeaderEnum.EMPLOYEE_DEMISSION],
        CompanyStructColumnMap[CompanyStructHeaderEnum.ESOCIAL_CODE],
        CompanyStructColumnMap[CompanyStructHeaderEnum.LAST_EXAM],
      ],
      name: 'Dados do Funcionário',
    },
    {
      group: [
        CompanyStructColumnMap[CompanyStructHeaderEnum.DIRECTORY],
        CompanyStructColumnMap[CompanyStructHeaderEnum.MANAGEMENT],
        CompanyStructColumnMap[CompanyStructHeaderEnum.SECTOR],
        CompanyStructColumnMap[CompanyStructHeaderEnum.SUB_SECTOR],
        CompanyStructColumnMap[CompanyStructHeaderEnum.OFFICE],
        CompanyStructColumnMap[CompanyStructHeaderEnum.SUB_OFFICE],
        CompanyStructColumnMap[CompanyStructHeaderEnum.CBO],
        CompanyStructColumnMap[CompanyStructHeaderEnum.OFFICE_DESCRIPTION],
        CompanyStructColumnMap[CompanyStructHeaderEnum.OFFICE_REAL_DESCRIPTION],
      ],
      name: 'Identificação do Cargo',
    },
    {
      group: [CompanyStructColumnMap[CompanyStructHeaderEnum.GHO], CompanyStructColumnMap[CompanyStructHeaderEnum.GHO_DESCRIPTION]],
      name: 'Grupo Similar de Exposição ao cargo',
    },
  ];
};
