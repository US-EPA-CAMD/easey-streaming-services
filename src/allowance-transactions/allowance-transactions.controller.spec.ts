import { Test } from '@nestjs/testing';

import { AllowanceTransactionsController } from './allowance-transactions.controller';
import { AllowanceTransactionsService } from './allowance-transactions.service';
import { TransactionBlockDimRepository } from './transaction-block-dim.repository';
import { StreamAllowanceTransactionsParamsDTO } from '../dto/allowance-transactions.params.dto';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { StreamableFile } from '@nestjs/common';
import { StreamModule } from '@us-epa-camd/easey-common/stream';

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

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, StreamModule],
      controllers: [AllowanceTransactionsController],
      providers: [AllowanceTransactionsService, TransactionBlockDimRepository],
    }).compile();

    allowanceTransactionsController = module.get(
      AllowanceTransactionsController,
    );
    allowanceTransactionsService = module.get(AllowanceTransactionsService);
  });

  describe('* streamAllowanceTransactions', () => {
    const req: any = mockRequest('');
    req.res.setHeader.mockReturnValue();

    it('should call the service and return all allowance transactions ', async () => {
      const expectedResults: StreamableFile = undefined;
      const paramsDTO = new StreamAllowanceTransactionsParamsDTO();
      jest
        .spyOn(allowanceTransactionsService, 'streamAllowanceTransactions')
        .mockResolvedValue(expectedResults);
      expect(
        await allowanceTransactionsController.streamAllowanceTransactions(
          req,
          paramsDTO,
        ),
      ).toBe(expectedResults);
    });
  });
});
