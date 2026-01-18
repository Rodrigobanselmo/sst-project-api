import { config } from '../../constants/config';

export function isDevelopment() {
  const nodeEnv = config.SYSTEM.NODE_ENV?.toLowerCase();
  return nodeEnv !== 'production';
}

export function isHidePhotos() {
  return false
}
