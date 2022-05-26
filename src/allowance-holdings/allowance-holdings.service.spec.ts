import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { AllowanceHoldingsService } from './allowance-holdings.service';
import { AllowanceHoldingDimRepository } from './allowance-holding-dim.repository';
import { StreamAllowanceHoldingsParamsDTO } from '../dto/allowance-holdings.params.dto';

import { StreamService } from '@us-epa-camd/easey-common/stream';
import { StreamableFile } from '@nestjs/common';
import { StreamingService } from '../streaming/streaming.service';

const mockAllowanceHoldingDimRepository = () => ({
  buildQuery: jest.fn(),
});

const mockStream = {
  pipe: jest.fn().mockReturnValue({
    pipe: jest.fn().mockReturnValue(Buffer.from('stream')),
  }),
};

jest.mock('uuid', () => {
  return { v4: jest.fn().mockReturnValue(0) };
});

let req: any;

describe('-- Allowance Holdings Service --', () => {
  let allowanceHoldingsService;
  let allowanceHoldingDimRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        AllowanceHoldingsService,
        {
          provide: StreamingService,
          useFactory: () => ({
            getStream: () => {
              return mockStream;
            },
          }),
        },
        {
          provide: AllowanceHoldingDimRepository,
          useFactory: mockAllowanceHoldingDimRepository,
        },
      ],
    }).compile();

    allowanceHoldingsService = module.get(AllowanceHoldingsService);
    allowanceHoldingDimRepository = module.get(AllowanceHoldingDimRepository);
  });

  describe('streamAllowanceHoldings', () => {
    it('streams all allowance holdings', async () => {
      allowanceHoldingDimRepository.buildQuery.mockResolvedValue('');

      let filters = new StreamAllowanceHoldingsParamsDTO();

      req.headers.accept = '';

      let result = await allowanceHoldingsService.streamAllowanceHoldings(
        req,
        filters,
      );

      expect(result).toEqual(
        new StreamableFile(Buffer.from('stream'), {
          type: req.headers.accept,
          disposition: `attachment; filename="allowance-holdings-${0}.json"`,
        }),
      );
    });
  });
});
