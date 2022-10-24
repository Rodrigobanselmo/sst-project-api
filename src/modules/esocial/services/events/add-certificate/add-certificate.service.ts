import { Injectable } from '@nestjs/common';
import { TecnoSpeedESocialProvider } from '../../../../../shared/providers/ESocialEventProvider/implementations/TecnoSpeedESocialProvider';

@Injectable()
export class AddCertificationESocialService {
  constructor(
    private readonly tecnoSpeedESocialProvider: TecnoSpeedESocialProvider,
  ) {}

  async execute() {
    this.tecnoSpeedESocialProvider.addCertification();
    return;
  }
}
