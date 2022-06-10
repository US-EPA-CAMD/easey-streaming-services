import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { StreamableFile } from '@nestjs/common';

import { AllowanceHoldingsController } from './allowance-holdings.controller';
import { AllowanceHoldingsService } from './allowance-holdings.service';
import { AllowanceHoldingDimRepository } from './allowance-holding-dim.repository';
import { AccountService } from '../account/account.service';
import { AccountFactRepository } from '../account/account-fact.repository';
import { StreamAllowanceHoldingsParamsDTO } from '../dto/allowance-holdings.params.dto';
import { StreamingModule } from '../streaming/streaming.module';

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
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, StreamingModule],
      controllers: [AllowanceHoldingsController],
      providers: [
        AllowanceHoldingsService,
        AllowanceHoldingDimRepository,
        AccountService,
        AccountFactRepository,
      ],
    }).compile();

    allowanceHoldingsController = module.get(AllowanceHoldingsController);
    allowanceHoldingsService = module.get(AllowanceHoldingsService);
    accountService = module.get(AccountService);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* streamAllowanceHoldings', () => {
    it('should call the service and return all allowance holdings ', async () => {
      const expectedResult = new StreamableFile(Buffer.from('stream'));
      const paramsDTO = new StreamAllowanceHoldingsParamsDTO();
      jest
        .spyOn(allowanceHoldingsService, 'streamAllowanceHoldings')
        .mockResolvedValue(expectedResult);
      expect(
        await allowanceHoldingsController.streamAllowanceHoldings(
          req,
          paramsDTO,
        ),
      ).toBe(expectedResult);
    });
  });
});
