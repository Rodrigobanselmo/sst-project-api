import { Test, TestingModule } from '@nestjs/testing';
import { HomoGroupsController } from './HomoGroups.controller';

describe('HomoGroupsController', () => {
  let controller: HomoGroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomoGroupsController],
    }).compile();

    controller = module.get<HomoGroupsController>(HomoGroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
