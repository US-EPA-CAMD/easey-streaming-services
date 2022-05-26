import { Test } from '@nestjs/testing';
import { StreamableFile } from '@nestjs/common';

import { AccountFactRepository } from './account-fact.repository';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { StreamAccountAttributesParamsDTO } from '../dto/account-attributes.params.dto';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Account Controller --', () => {
  let accountController;
  let accountService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [AccountController],
      providers: [AccountService, AccountFactRepository],
    }).compile();

    accountController = module.get(AccountController);
    accountService = module.get(AccountService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* streamAllAccountAttributes', () => {
    const req: any = mockRequest('');
    req.res.setHeader.mockReturnValue();

    it('should call the service and return all account attributes ', async () => {
      const expectedResults: StreamableFile = undefined;
      const paramsDTO = new StreamAccountAttributesParamsDTO();
      jest
        .spyOn(accountService, 'streamAllAccountAttributes')
        .mockResolvedValue(expectedResults);
      expect(
        await accountController.streamAllAccountAttributes(req, paramsDTO),
      ).toBe(expectedResults);
    });
  });
});
