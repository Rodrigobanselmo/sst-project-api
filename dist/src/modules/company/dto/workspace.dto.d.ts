import { Prisma, StatusEnum } from '@prisma/client';
import { AddressDto } from './address.dto';
export declare class WorkspaceDto {
    id?: string;
    abbreviation?: string;
    description?: string;
    cnpj?: string;
    isOwner?: boolean;
    companyJson?: Prisma.JsonValue;
    name: string;
    status: StatusEnum;
    readonly address: AddressDto;
}
