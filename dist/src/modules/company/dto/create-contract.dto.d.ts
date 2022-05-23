import { CreateCompanyDto } from './create-company.dto';
export declare class CreateContractDto extends CreateCompanyDto {
    readonly license?: undefined;
    companyId: string;
}
