import { config } from '../../constants/config';

export function isDevelopmentGetter() {
  return false;
  const nodeEnv = config.SYSTEM.NODE_ENV?.toLowerCase();
  return nodeEnv !== 'production';
}
