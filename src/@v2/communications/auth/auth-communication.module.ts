import { SharedModule } from '@/@v2/shared/shared.module';
import { Module } from '@nestjs/common';
import { InviteUserService } from './services/invite-user/invite-user.service';
import { UserCommunicationDAO } from '../base/database/dao/user/user.dao';

@Module({
  imports: [SharedModule],
  providers: [
    // Consumer
    InviteUserService,

    // Database
    UserCommunicationDAO,
  ],
  exports: [InviteUserService],
})
export class AuthCommunicationModule {}
