import { TransformFnParams } from 'class-transformer';
export declare function verifierDigit(numbers: string): number;
export declare function format(cnpj: string): string;
export declare const CnpjFormatTransform: (data: TransformFnParams) => string;
