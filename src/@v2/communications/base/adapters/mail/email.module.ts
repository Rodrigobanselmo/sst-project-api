import { Module } from '@nestjs/common';
import { NodeMailerAdapter } from './node-mailer.adapter';

@Module({
  imports: [],
  providers: [NodeMailerAdapter],
  exports: [NodeMailerAdapter],
})
export class EmailModule {}
