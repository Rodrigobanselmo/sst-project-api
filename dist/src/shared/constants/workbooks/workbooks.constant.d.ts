import { WorkbooksEnum } from '../../../shared/constants/workbooks/workbooks.enum';
export declare const workbooksConstant: {
    0: {
        name: string;
        id: WorkbooksEnum;
        sheets: Record<import("./sheets/risk/riskSheet.enum").RiskSheetEnum, import("./sheets/risk/riskSheet.constant").IRiskSheet>;
        path: string;
    };
    2: {
        name: string;
        id: WorkbooksEnum;
        sheets: Record<import("./sheets/company/companySheet.enum").CompanySheetEnum, import("./sheets/company/companySheet.constant").ICompanySheet>;
        path: string;
    };
    3: {
        name: string;
        id: WorkbooksEnum;
        sheets: Record<import("./sheets/companyUnique/companyUniqueSheet.enum").CompanyUniqueSheetEnum, import("./sheets/companyUnique/companyUniqueSheet.constant").ICompanyUniqueSheet>;
    };
    1: {
        name: string;
        id: WorkbooksEnum;
        sheets: Record<import("./sheets/epi/epiSheet.enum").EpiSheetEnum, import("./sheets/epi/epiSheet.constant").IEpiSheet>;
        path: string;
    };
    4: {
        name: string;
        id: WorkbooksEnum;
        sheets: Record<import("./sheets/employees/employees.enum").EmployeesUniqueSheetEnum, import("./sheets/employees/employeesSheet.constant").IEmployeeSheet>;
        path: string;
    };
};