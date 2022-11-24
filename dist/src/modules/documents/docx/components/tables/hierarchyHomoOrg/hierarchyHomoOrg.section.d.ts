import { Footer, Header, PageOrientation, Table } from 'docx';
import { IHierarchyData, IHomoGroupMap } from '../../../converter/hierarchy.converter';
import { ConverterProps } from './hierarchyHomoOrg.converter';
export declare const hierarchyHomoOrgSection: (hierarchiesEntity: IHierarchyData, homoGroupTree: IHomoGroupMap, { showDescription, showHomogeneous, showHomogeneousDescription, type, groupIdFilter }?: ConverterProps) => {
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
    footers: {
        default: Footer;
    };
    headers: {
        default: Header;
    };
};
