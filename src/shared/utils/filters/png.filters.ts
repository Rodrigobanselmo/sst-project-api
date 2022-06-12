import { BadGatewayException } from '@nestjs/common';
import * as path from 'path';

export const pngFileFilter = (req: any, file: any, callback: any) => {
  const ext = path.extname(file.originalname);
  if (ext !== '.png') {
    req.fileValidationError = 'Invalid file type';
    return callback(new BadGatewayException('Invalid file type'), false);
  }
  return callback(null, true);
};
