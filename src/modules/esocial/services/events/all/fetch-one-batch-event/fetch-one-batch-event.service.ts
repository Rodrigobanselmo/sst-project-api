import { Injectable } from '@nestjs/common';

import { ESocialEventProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider';

@Injectable()
export class FetchOneESocialBatchEventsService {
  constructor(private readonly eSocialEventProvider: ESocialEventProvider) {}

  async execute(protoId: string) {
    const batchResponse = await this.eSocialEventProvider.fetchEventToESocial({
      protocolId: protoId,
    } as any);

    return batchResponse;
  }
}
