import { Table } from 'docx';
import { IHierarchyData, IHomoGroupMap } from '../../../converter/hierarchy.converter';
import { ConverterProps } from './hierarchyHomoOrg.converter';
export declare const hierarchyHomoOrgTable: (hierarchiesEntity: IHierarchyData, homoGroupTree: IHomoGroupMap, { showDescription, showHomogeneous, showHomogeneousDescription, type, groupIdFilter }?: ConverterProps) => {
    table: Table;
    missingBody: boolean;
};
