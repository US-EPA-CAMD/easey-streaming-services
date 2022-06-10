import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { AllowanceTransactionsService } from './allowance-transactions.service';
import { TransactionBlockDimRepository } from './transaction-block-dim.repository';
import { StreamAllowanceTransactionsParamsDTO } from '../dto/allowance-transactions.params.dto';
import { StreamableFile } from '@nestjs/common';
import { StreamingService } from '../streaming/streaming.service';

const mockTransactionBlockDimRepository = () => ({
  buildQuery: jest.fn(),
});

const mockStreamingService = () => ({
  getStream: jest
    .fn()
    .mockResolvedValue(new StreamableFile(Buffer.from('stream'))),
});

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

describe('-- Allowance Transactions Service --', () => {
  let allowanceTransactionsService: AllowanceTransactionsService;
  let streamingService: StreamingService;
  let transactionBlockDimRepository: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        AllowanceTransactionsService,
        {
          provide: TransactionBlockDimRepository,
          useFactory: mockTransactionBlockDimRepository,
        },
        {
          provide: StreamingService,
          useFactory: mockStreamingService,
        },
      ],
    }).compile();

    allowanceTransactionsService = module.get(AllowanceTransactionsService);
    streamingService = module.get(StreamingService);
    transactionBlockDimRepository = module.get(TransactionBlockDimRepository);
    req = mockRequest();
    req.res.setHeader.mockReturnValue();
  });

  describe('streamAllowanceTransactions', () => {
    it('streams all allowance transactions', async () => {
      transactionBlockDimRepository.buildQuery.mockReturnValue(['', []]);

      let filters = new StreamAllowanceTransactionsParamsDTO();

      req.headers.accept = '';

      let result = await allowanceTransactionsService.streamAllowanceTransactions(
        req,
        filters,
      );

      expect(result).toEqual(new StreamableFile(Buffer.from('stream')));
    });
  });
});
