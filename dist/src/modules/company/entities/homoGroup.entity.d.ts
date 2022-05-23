import { HomogeneousGroup, StatusEnum } from '@prisma/client';
import { HierarchyEntity } from './hierarchy.entity';
export declare class HomoGroupEntity implements HomogeneousGroup {
    id: string;
    name: string;
    description: string;
    status: StatusEnum;
    companyId: string;
    created_at: Date;
    hierarchies?: HierarchyEntity[];
    constructor(partial: Partial<HomoGroupEntity>);
}
