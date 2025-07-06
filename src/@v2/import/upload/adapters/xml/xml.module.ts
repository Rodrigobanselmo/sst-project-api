import { Module } from '@nestjs/common';
import { NodeXMLAdapter } from './node-xml.adapter';

@Module({
  imports: [],
  providers: [NodeXMLAdapter],
  exports: [NodeXMLAdapter],
})
export class XMLModule {}
