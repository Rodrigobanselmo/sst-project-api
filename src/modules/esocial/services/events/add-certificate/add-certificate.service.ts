import { Injectable } from '@nestjs/common';
import { ESocialEventProvider } from '../../../../../shared/providers/ESocialEventProvider/implementations/ESocialEventProvider';

@Injectable()
export class AddCertificationESocialService {
  constructor(private readonly eSocialEventProvider: ESocialEventProvider) {}

  async execute() {
    this.eSocialEventProvider.addCertification();
    return;
  }
}
