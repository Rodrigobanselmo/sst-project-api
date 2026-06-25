import { FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, BadRequestException } from '@nestjs/common';

export function createFileValidator(options: {
  required?: boolean;
  maxSize: number;
  fileType: string | RegExp;
  invalidFileTypeMessage?: string;
}) {
  const builder = new ParseFilePipe({
    fileIsRequired: options?.required ?? true,
    validators: [
      new FileTypeValidator({ fileType: options.fileType }),
      new MaxFileSizeValidator({ maxSize: options.maxSize }),
    ],
    exceptionFactory: (error) => {
      if (
        options.invalidFileTypeMessage &&
        typeof error === 'string' &&
        error.toLowerCase().includes('file type')
      ) {
        return new BadRequestException(options.invalidFileTypeMessage);
      }
      return new BadRequestException(error);
    },
  });

  return builder;
}
