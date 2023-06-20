
import { UserHistory } from '.prisma/client';
import { UserEntity } from './user.entity';
import { getUserAgentString } from '../../../shared/utils/getUserAgent';

export class UserHistoryEntity implements UserHistory {
  id: number;
  ip: string;
  city: string;
  country: string;
  region: string;
  userAgent: string;
  userAgentString: string;
  companyId: string;
  created_at: Date;
  updated_at: Date;
  userId: number;
  user?: UserEntity;

  constructor(partial: Partial<UserHistoryEntity>) {
    Object.assign(this, partial);

    if (this.userAgent) {
      const ua = getUserAgentString(this.userAgent);
      this.userAgentString = ua.browser + ' | ' + ua.device + ' - ' + ua.os;
    }
    if (this.user) this.user = new UserEntity(this.user);
  }
}
