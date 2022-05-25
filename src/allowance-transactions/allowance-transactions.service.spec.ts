import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { AllowanceTransactionsService } from './allowance-transactions.service';
import { TransactionBlockDimRepository } from './transaction-block-dim.repository';
import { StreamAllowanceTransactionsParamsDTO } from '../dto/allowance-transactions.params.dto';
import { StreamService } from '@us-epa-camd/easey-common/stream';
import { StreamableFile } from '@nestjs/common';

const mockTransactionBlockDimRepository = () => ({
  getAllowanceTransactions: jest.fn(),
  getAllApplicableAllowanceTransactionsAttributes: jest.fn(),
  getStreamQuery: jest.fn(),
});

const mockStream = {
  pipe: jest.fn().mockReturnValue({
    pipe: jest.fn().mockReturnValue(Buffer.from('stream')),
  }),
};

jest.mock('uuid', () => {
  return { v4: jest.fn().mockReturnValue(0) };
});

const mockRequest = (url?: string, page?: number, perPage?: number) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
    query: {
      page,
      perPage,
    },
    headers: {
      accept: 'text/csv',
    },
    on: jest.fn(),
  };
};

let req: any;

describe('-- Allowance Transactions Service --', () => {
  let allowanceTransactionsService;
  let transactionBlockDimRepository;
  let transactionOwnerDimRepository;
  let allowanceTransactionsMap;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        AllowanceTransactionsService,
        {
          provide: StreamService,
          useFactory: () => ({
            getStream: () => {
              return mockStream;
            },
          }),
        },
        {
          provide: TransactionBlockDimRepository,
          useFactory: mockTransactionBlockDimRepository,
        },
      ],
    }).compile();

    allowanceTransactionsService = module.get(AllowanceTransactionsService);
    transactionBlockDimRepository = module.get(TransactionBlockDimRepository);
    req = mockRequest();
    req.res.setHeader.mockReturnValue();
  });

  describe('streamAllowanceTransactions', () => {
    it('streams all allowance transactions', async () => {
      transactionBlockDimRepository.getStreamQuery.mockResolvedValue('');

      let filters = new StreamAllowanceTransactionsParamsDTO();

      req.headers.accept = '';

      let result = await allowanceTransactionsService.streamAllowanceTransactions(
        req,
        filters,
      );

      expect(result).toEqual(
        new StreamableFile(Buffer.from('stream'), {
          type: req.headers.accept,
          disposition: `attachment; filename="allowance-transactions-${0}.json"`,
        }),
      );
    });
  });
});
