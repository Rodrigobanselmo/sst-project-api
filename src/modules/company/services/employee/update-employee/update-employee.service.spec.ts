import { Test, TestingModule } from '@nestjs/testing';
import { UpdateEmployeeService } from './update-employee.service';

describe('UpdateEmployeeService', () => {
  let service: UpdateEmployeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateEmployeeService],
    }).compile();

    service = module.get<UpdateEmployeeService>(UpdateEmployeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
