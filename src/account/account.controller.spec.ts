import { Test } from '@nestjs/testing';
import { StreamableFile } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { AccountFactRepository } from './account-fact.repository';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { StreamAccountAttributesParamsDTO } from '../dto/account-attributes.params.dto';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { StreamingModule } from '../streaming/streaming.module';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Account Controller --', () => {
  let accountController: AccountController;
  let accountService: AccountService;
  let req: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, StreamingModule],
      controllers: [AccountController],
      providers: [AccountService, AccountFactRepository, EntityManager],
    }).compile();

    accountController = module.get(AccountController);
    accountService = module.get(AccountService);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* streamAllAccountAttributes', () => {
    it('should call the service and return all account attributes', async () => {
      const expectedResult = new StreamableFile(Buffer.from('stream'));
      const paramsDTO = new StreamAccountAttributesParamsDTO();
      jest
        .spyOn(accountService, 'streamAllAccountAttributes')
        .mockResolvedValue(expectedResult);
      expect(
        await accountController.streamAllAccountAttributes(req, paramsDTO),
      ).toBe(expectedResult);
    });
  });
});
