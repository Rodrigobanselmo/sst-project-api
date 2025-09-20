import { Module } from '@nestjs/common';
import { NodeMailerAdapter } from './node-mailer.adapter';
import { AwsSesAdapter } from './aws-ses.adapter';
import { BrevoAdapter } from './brevo.adapter';
import { CompositeEmailAdapter } from './composite-email.adapter';

@Module({
  imports: [],
  providers: [NodeMailerAdapter, AwsSesAdapter, BrevoAdapter, CompositeEmailAdapter],
  exports: [NodeMailerAdapter, AwsSesAdapter, BrevoAdapter, CompositeEmailAdapter],
})
export class EmailModule {}
