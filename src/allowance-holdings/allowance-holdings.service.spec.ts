import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { AllowanceHoldingsService } from './allowance-holdings.service';
import { AllowanceHoldingDimRepository } from './allowance-holding-dim.repository';
import { StreamAllowanceHoldingsParamsDTO } from '../dto/allowance-holdings.params.dto';

import { StreamableFile } from '@nestjs/common';
import { StreamingService } from '../streaming/streaming.service';

const mockAllowanceHoldingDimRepository = () => ({
  buildQuery: jest.fn(),
});

jest.mock('uuid', () => {
  return { v4: jest.fn().mockReturnValue(0) };
});

const mockStreamingService = () => ({
  getStream: jest
    .fn()
    .mockResolvedValue(new StreamableFile(Buffer.from('stream'))),
});

const mockRequest = () => {
  return {
    headers: {
      accept: '',
    },
    res: {
      setHeader: jest.fn(),
    },
    on: jest.fn(),
  };
};

describe('-- Allowance Holdings Service --', () => {
  let allowanceHoldingsService: AllowanceHoldingsService;
  let allowanceHoldingDimRepository: any;
  let req: any;
  let streamingService: StreamingService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        AllowanceHoldingsService,
        {
          provide: AllowanceHoldingDimRepository,
          useFactory: mockAllowanceHoldingDimRepository,
        },
        {
          provide: StreamingService,
          useFactory: mockStreamingService,
        },
      ],
    }).compile();

    req = mockRequest();
    req.res.setHeader.mockReturnValue();
    allowanceHoldingsService = module.get(AllowanceHoldingsService);
    allowanceHoldingDimRepository = module.get(AllowanceHoldingDimRepository);
    streamingService = module.get(StreamingService);
  });

  describe('streamAllowanceHoldings', () => {
    it('streams all allowance holdings', async () => {
      allowanceHoldingDimRepository.buildQuery.mockReturnValue(['', []]);

      let filters = new StreamAllowanceHoldingsParamsDTO();

      req.headers.accept = '';

      let result = await allowanceHoldingsService.streamAllowanceHoldings(
        req,
        filters,
      );

      expect(result).toEqual(new StreamableFile(Buffer.from('stream')));
    });
  });
});
