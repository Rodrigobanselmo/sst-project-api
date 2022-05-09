import { Test, TestingModule } from '@nestjs/testing';
import { RiskGroupDataController } from './risk-group-data.controller';

describe.skip('RiskGroupDataController', () => {
  let controller: RiskGroupDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RiskGroupDataController],
    }).compile();

    controller = module.get<RiskGroupDataController>(RiskGroupDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
