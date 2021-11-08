import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

// example because in core library already have ParseIntPipe

@Injectable()
export class ValidateEmailPipe implements PipeTransform {
  transform(value: string) {
    if (!value) throw new BadRequestException(`Email is required`);

    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value))
      return value;

    throw new BadRequestException(
      `Validation failed. "${value}" is not an valid email.`,
    );
  }
}
