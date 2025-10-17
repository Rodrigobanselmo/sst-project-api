import { Module } from '@nestjs/common';
import { SharedTokens } from '../../constants/tokens';
import { OpenAIAiAdapter } from './openai-ai.adapter';

@Module({
  providers: [
    {
      provide: SharedTokens.AI,
      useClass: OpenAIAiAdapter,
    },
  ],
  exports: [SharedTokens.AI],
})
export class AiModule {}

