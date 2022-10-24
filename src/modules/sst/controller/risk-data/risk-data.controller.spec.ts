import { Test, TestingModule } from '@nestjs/testing';
import { RiskDataController } from './risk-data.controller';

describe.skip('RiskDataController', () => {
  let controller: RiskDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RiskDataController],
    }).compile();

    controller = module.get<RiskDataController>(RiskDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
