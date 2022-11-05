import { BadGatewayException } from '@nestjs/common';
import * as path from 'path';

export const pfxFileFilter = (req: any, file: any, callback: any) => {
  const ext = path.extname(file.originalname);
  if (ext !== '.pfx') {
    req.fileValidationError =
      'Somente arquivos com extensão .pfx são permitidos';
    return callback(
      new BadGatewayException(
        'Somente arquivos com estenxão .pfx são permitidos',
      ),
      false,
    );
  }
  return callback(null, true);
};
