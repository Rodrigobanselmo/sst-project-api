import { PageOrientation, Table } from 'docx';
import { IHierarchyData, IHomoGroupMap } from '../../../converter/hierarchy.converter';
export declare const hierarchyPlanTableSection: (hierarchiesEntity: IHierarchyData, homoGroupTree: IHomoGroupMap) => {
    children: Table[];
    properties: {
        page: {
            margin: {
                left: number;
                right: number;
                top: number;
                bottom: number;
            };
            size: {
                orientation: PageOrientation;
            };
        };
    };
};
