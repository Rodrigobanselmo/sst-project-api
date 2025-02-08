import { FileTypeValidator, MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common';

export function createFileValidator(options: { required?: boolean; maxSize: number; fileType: string | RegExp }) {
  const builder = new ParseFilePipe({
    fileIsRequired: options?.required ?? true,
    validators: [new FileTypeValidator({ fileType: options.fileType }), new MaxFileSizeValidator({ maxSize: options.maxSize })],
  });

  return builder;
}
