import { HierarchyEnum } from "@prisma/client";
import { CompanyStructRSDataNRHeaderEnum } from "../constants/company-struct-rsdata-nr.constants";

export const hierarchyMap: Record<string, { database: string; databaseRsData: string }> = {
    [HierarchyEnum.DIRECTORY]: { database: 'directory', databaseRsData: '' },
    [HierarchyEnum.MANAGEMENT]: { database: 'management', databaseRsData: '' },
    [HierarchyEnum.SECTOR]: { database: 'sector', databaseRsData: CompanyStructRSDataNRHeaderEnum.SETOR },
    [HierarchyEnum.SUB_SECTOR]: { database: 'subSector', databaseRsData: CompanyStructRSDataNRHeaderEnum.SETOR_D },
    [HierarchyEnum.OFFICE]: { database: 'office', databaseRsData: CompanyStructRSDataNRHeaderEnum.CARGO },
    [HierarchyEnum.SUB_OFFICE]: { database: 'subOffice', databaseRsData: CompanyStructRSDataNRHeaderEnum.CARGO_D },
};