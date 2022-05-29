import { Address } from '.prisma/client';
import { WorkspaceEntity } from './workspace.entity';
import { StatusEnum } from '@prisma/client';
export declare class AddressEntity implements Address {
    id: string;
    number: string;
    cep: string;
    street: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: StatusEnum;
    companyId: string;
    workspaceId: string;
    workspace?: WorkspaceEntity;
    constructor(partial: Partial<AddressEntity>);
}