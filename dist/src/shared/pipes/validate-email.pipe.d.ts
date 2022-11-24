import { PipeTransform } from '@nestjs/common';
export declare class ValidateEmailPipe implements PipeTransform {
    transform(value: string): string;
}
