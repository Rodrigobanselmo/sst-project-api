import { SetMetadata } from '@nestjs/common';
/**
 * @deprecated - Use from backend v2
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * @deprecated - Use from backend v2
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
