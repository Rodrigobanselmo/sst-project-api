export declare class FilesController {
    findAllTables(): ({
        name: string;
        id: import("../../../shared/constants/workbooks/workbooks.enum").WorkbooksEnum;
        sheets: Record<import("../../../shared/constants/workbooks/sheets/risk/riskSheet.enum").RiskSheetEnum, import("../../../shared/constants/workbooks/sheets/risk/riskSheet.constant").IRiskSheet>;
        path: string;
    } | {
        name: string;
        id: import("../../../shared/constants/workbooks/workbooks.enum").WorkbooksEnum;
        sheets: Record<import("../../../shared/constants/workbooks/sheets/company/companySheet.enum").CompanySheetEnum, import("../../../shared/constants/workbooks/sheets/company/companySheet.constant").ICompanySheet>;
        path: string;
    } | {
        name: string;
        id: import("../../../shared/constants/workbooks/workbooks.enum").WorkbooksEnum;
        sheets: Record<import("../../../shared/constants/workbooks/sheets/companyUnique/companyUniqueSheet.enum").CompanyUniqueSheetEnum, import("../../../shared/constants/workbooks/sheets/companyUnique/companyUniqueSheet.constant").ICompanyUniqueSheet>;
    } | {
        name: string;
        id: import("../../../shared/constants/workbooks/workbooks.enum").WorkbooksEnum;
        sheets: Record<import("../../../shared/constants/workbooks/sheets/epi/epiSheet.enum").EpiSheetEnum, import("../../../shared/constants/workbooks/sheets/epi/epiSheet.constant").IEpiSheet>;
        path: string;
    } | {
        name: string;
        id: import("../../../shared/constants/workbooks/workbooks.enum").WorkbooksEnum;
        sheets: Record<import("../../../shared/constants/workbooks/sheets/employees/employees.enum").EmployeesUniqueSheetEnum, import("../../../shared/constants/workbooks/sheets/employees/employeesSheet.constant").IEmployeeSheet>;
        path: string;
    } | {
        name: string;
        id: import("../../../shared/constants/workbooks/workbooks.enum").WorkbooksEnum;
        sheets: Record<import("../../../shared/constants/workbooks/sheets/hierarchies/hierarchies.enum").HierarchiesSheetEnum, import("../../../shared/constants/workbooks/sheets/hierarchies/hierarchiesSheet.constant").IEmployeeSheet>;
        path: string;
    })[];
}
