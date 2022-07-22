import { Test, TestingModule } from '@nestjs/testing';
import { SendGridProvider } from '../../../../../shared/providers/MailProvider/implementations/SendGrid/SendGridProvider';
import { UsersRepository } from '../../../../users/repositories/implementations/UsersRepository';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { RefreshTokensRepository } from '../../../repositories/implementations/RefreshTokensRepository';
import { SendForgotPassMailService } from './send-forgot-pass-mail.service';

describe('SendForgotPassMailService', () => {
  let service: SendForgotPassMailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendForgotPassMailService,
        {
          provide: RefreshTokensRepository,
          useValue: {
            create: jest.fn().mockResolvedValue({ id: 'string' }),
          } as Partial<RefreshTokensRepository>,
        },
        {
          provide: SendGridProvider,
          useValue: {
            sendMail: jest.fn().mockReturnValue(undefined),
          } as Partial<SendGridProvider>,
        },
        {
          provide: DayJSProvider,
          useValue: {
            addHours: jest.fn().mockReturnValue(new Date()),
          } as Partial<DayJSProvider>,
        },
        {
          provide: UsersRepository,
          useValue: {
            findByEmail: jest.fn().mockResolvedValue({}),
          } as Partial<UsersRepository>,
        },
      ],
    }).compile();

    service = module.get<SendForgotPassMailService>(SendForgotPassMailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
