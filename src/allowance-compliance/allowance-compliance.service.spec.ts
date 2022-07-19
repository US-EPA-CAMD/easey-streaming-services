import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { AccountComplianceDimRepository } from './account-compliance-dim.repository';
import { AllowanceComplianceService } from './allowance-compliance.service';
import { StreamAllowanceComplianceParamsDTO } from '../dto/allowance-compliance.params.dto';
import { StreamableFile } from '@nestjs/common';
import { StreamingService } from '../streaming/streaming.service';

const mockAccountComplianceDimRepository = () => ({
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

let req: any;

describe('-- Allowance Compliance Service --', () => {
  let allowanceComplianceService: AllowanceComplianceService;
  let streamingService: StreamingService;
  let accountComplianceDimRepository: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        AllowanceComplianceService,
        {
          provide: AccountComplianceDimRepository,
          useFactory: mockAccountComplianceDimRepository,
        },
        {
          provide: StreamingService,
          useFactory: mockStreamingService,
        },
      ],
    }).compile();

    allowanceComplianceService = module.get(AllowanceComplianceService);
    streamingService = module.get(StreamingService);
    accountComplianceDimRepository = module.get(AccountComplianceDimRepository);
    req = mockRequest();
    req.res.setHeader.mockReturnValue();
  });

  describe('streamAllowanceCompliance', () => {
    it('streams allowance compliance', async () => {
      accountComplianceDimRepository.buildQuery.mockReturnValue(['', []]);
      let filters = new StreamAllowanceComplianceParamsDTO();

      req.headers.accept = '';

      let result = await allowanceComplianceService.streamAllowanceCompliance(
        req,
        filters,
      );
      expect(result).toEqual(new StreamableFile(Buffer.from('stream')));
    });
  });
});
