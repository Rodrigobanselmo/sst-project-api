import { HierarchyEntity } from './../../../../../../../company/entities/hierarchy.entity';
import { Table } from 'docx';
import { HierarchyMapData } from '../../../../../converter/hierarchy.converter';
export declare const officeRiskInventoryTableSection: (hierarchyData: HierarchyMapData & {
    hierarchies: HierarchyEntity[];
}) => (import("docx").Paragraph | Table)[];
