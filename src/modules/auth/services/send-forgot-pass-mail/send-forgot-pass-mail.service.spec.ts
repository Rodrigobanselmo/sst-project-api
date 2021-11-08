import { Test, TestingModule } from '@nestjs/testing';
import { SendForgotPassMailService } from './send-forgot-pass-mail.service';

describe('SendForgotPassMailService', () => {
  let service: SendForgotPassMailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendForgotPassMailService],
    }).compile();

    service = module.get<SendForgotPassMailService>(SendForgotPassMailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
