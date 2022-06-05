import { CompanyTypesEnum, StatusEnum } from '@prisma/client';
import { ActivityDto } from './activity.dto';
import { AddressDto } from './address.dto';
import { LicenseDto } from './license.dto';
import { WorkspaceDto } from './workspace.dto';
export declare class CreateCompanyDto {
    cnpj: string;
    name: string;
    fantasy: string;
    status: StatusEnum;
    type: CompanyTypesEnum;
    isConsulting: boolean;
    license?: LicenseDto;
    address?: AddressDto;
    readonly workspace: WorkspaceDto[];
    readonly primary_activity: ActivityDto[];
    readonly secondary_activity: ActivityDto[];
    size: string;
    phone: string;
    legal_nature: string;
    cadastral_situation: string;
    activity_start_date: string;
    cadastral_situation_date: string;
    legal_nature_code: string;
    cadastral_situation_description: string;
}
