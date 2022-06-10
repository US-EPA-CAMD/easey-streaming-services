import { Test } from '@nestjs/testing';

import { AllowanceTransactionsController } from './allowance-transactions.controller';
import { AllowanceTransactionsService } from './allowance-transactions.service';
import { TransactionBlockDimRepository } from './transaction-block-dim.repository';
import { StreamAllowanceTransactionsParamsDTO } from '../dto/allowance-transactions.params.dto';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { StreamableFile } from '@nestjs/common';
import { StreamingModule } from '../streaming/streaming.module';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Allowance Transactions Controller --', () => {
  let allowanceTransactionsController: AllowanceTransactionsController;
  let allowanceTransactionsService: AllowanceTransactionsService;
  let req: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, StreamingModule],
      controllers: [AllowanceTransactionsController],
      providers: [AllowanceTransactionsService, TransactionBlockDimRepository],
    }).compile();

    allowanceTransactionsController = module.get(
      AllowanceTransactionsController,
    );
    allowanceTransactionsService = module.get(AllowanceTransactionsService);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* streamAllowanceTransactions', () => {
    it('should call the service and return all allowance transactions ', async () => {
      const expectedResult = new StreamableFile(Buffer.from('stream'));
      const paramsDTO = new StreamAllowanceTransactionsParamsDTO();
      jest
        .spyOn(allowanceTransactionsService, 'streamAllowanceTransactions')
        .mockResolvedValue(expectedResult);
      expect(
        await allowanceTransactionsController.streamAllowanceTransactions(
          req,
          paramsDTO,
        ),
      ).toBe(expectedResult);
    });
  });
});
