import { Logger } from '@nestjs/common';

export function captureException(params: any) {
  const logger = new Logger('CaptureException');
  logger.error(params);
}
