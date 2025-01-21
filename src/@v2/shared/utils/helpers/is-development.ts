import { config } from '../../constants/config';

export function isDevelopmentGetter() {
  const nodeEnv = config.SYSTEM.NODE_ENV?.toLowerCase();
  return nodeEnv !== 'production';
}
