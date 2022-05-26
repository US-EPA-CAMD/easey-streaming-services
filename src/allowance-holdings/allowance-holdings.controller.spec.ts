import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { StreamableFile } from '@nestjs/common';

import { AllowanceHoldingsController } from './allowance-holdings.controller';
import { AllowanceHoldingsService } from './allowance-holdings.service';
import { AllowanceHoldingDimRepository } from './allowance-holding-dim.repository';
import { AccountService } from '../account/account.service';
import { AccountFactRepository } from '../account/account-fact.repository';
import { StreamModule } from '@us-epa-camd/easey-common/stream';
import { StreamAllowanceHoldingsParamsDTO } from '../dto/allowance-holdings.params.dto';
import { StreamingService } from '../streaming/streaming.service';
import { ConfigService } from '@nestjs/config';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Allowance Holdings Controller --', () => {
  let allowanceHoldingsController: AllowanceHoldingsController;
  let allowanceHoldingsService: AllowanceHoldingsService;
  let accountService: AccountService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, StreamModule],
      controllers: [AllowanceHoldingsController],
      providers: [
        AllowanceHoldingsService,
        AllowanceHoldingDimRepository,
        AccountService,
        AccountFactRepository,
        StreamingService,
        ConfigService
      ],
    }).compile();

    allowanceHoldingsController = module.get(AllowanceHoldingsController);
    allowanceHoldingsService = module.get(AllowanceHoldingsService);
    accountService = module.get(AccountService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* getAllowanceHoldingsStream', () => {
    const req: any = mockRequest('');
    req.res.setHeader.mockReturnValue();

    it('should call the service and return allowance holdings ', async () => {
      const expectedResults: StreamableFile = undefined;
      const paramsDTO = new StreamAllowanceHoldingsParamsDTO();
      jest
        .spyOn(allowanceHoldingsService, 'streamAllowanceHoldings')
        .mockResolvedValue(expectedResults);
      expect(
        await allowanceHoldingsController.streamAllowanceHoldings(
          req,
          paramsDTO,
        ),
      ).toBe(expectedResults);
    });
  });
});
