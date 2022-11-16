import { Test, TestingModule } from '@nestjs/testing';

import { EtherealMailProvider } from './EtherealMailProvider';

// import { resolve } from 'path';
// es6 mock jest

describe('EtherealProvider', () => {
  let etherealMailProvider: EtherealMailProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EtherealMailProvider],
    }).compile();

    etherealMailProvider = module.get<EtherealMailProvider>(EtherealMailProvider);
  });

  it('should be defined', () => {
    expect(etherealMailProvider).toBeDefined();
  });

  // it('should send email', async () => {
  //   const path = resolve(
  //     __dirname,
  //     '..',
  //     '..',
  //     '..',
  //     '..',
  //     '..',
  //     '..',
  //     'test',
  //     'utils',
  //     'views',
  //     'emails',
  //     'test.hbs',
  //   );

  //   const variables = {
  //     name: 'Testing email provider',
  //   };

  //   const result = await etherealMailProvider.sendMail({
  //     path,
  //     subject: 'Test email',
  //     to: 'rodrigoanselmo@usp.br',
  //     variables,
  //   });

  //   expect(result).toEqual(
  //     expect.objectContaining({
  //       messageId: expect.any(String),
  //     }),
  //   );
  // });
});
