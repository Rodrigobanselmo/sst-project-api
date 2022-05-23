import { StatusEnum } from '@prisma/client';
import { AddressDto } from './address.dto';
export declare class WorkspaceDto {
    id?: string;
    abbreviation?: string;
    name: string;
    status: StatusEnum;
    readonly address: AddressDto;
}
