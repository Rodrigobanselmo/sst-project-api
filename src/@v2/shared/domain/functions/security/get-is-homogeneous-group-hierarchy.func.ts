import { HomoTypeEnum } from "../../enum/security/homo-type.enum";

export const getIsHomogeneousGroupHierarchy = ({ type }: {
    type: HomoTypeEnum;
}) => {
    return type === HomoTypeEnum.HIERARCHY

};