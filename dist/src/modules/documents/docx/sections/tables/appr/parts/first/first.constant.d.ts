import { bodyTableProps } from '../../elements/body';
export declare enum FirstRiskInventoryColumnEnum {
    SOURCE = 0,
    REVIEW = 1,
    ELABORATION_BY = 2,
    APPROVE_BY = 3,
    DATA = 4,
    UNIT = 5
}
export declare const firstRiskInventoryHeader: bodyTableProps[];
export declare const hierarchyMap: Record<string, {
    text: string;
    index: number;
}>;
