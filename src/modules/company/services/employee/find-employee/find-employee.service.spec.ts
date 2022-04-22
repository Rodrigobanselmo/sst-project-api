import { Test, TestingModule } from '@nestjs/testing';
import { FindEmployeeService } from './find-employee.service';

describe.skip('FindEmployeeService', () => {
  let service: FindEmployeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindEmployeeService],
    }).compile();

    service = module.get<FindEmployeeService>(FindEmployeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
