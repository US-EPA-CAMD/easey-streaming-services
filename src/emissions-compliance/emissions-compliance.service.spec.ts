import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { EmissionsComplianceService } from './emissions-compliance.service';
import { UnitComplianceDimRepository } from './unit-compliance-dim.repository';
import { StreamEmissionsComplianceParamsDTO } from '../dto/emissions-compliance.params.dto';
import { StreamableFile } from '@nestjs/common';
import { StreamingService } from '../streaming/streaming.service';

const mockUnitComplianceDimRepository = () => ({
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

describe('-- Emissions Compliance Service --', () => {
  let emissionsComplianceService: EmissionsComplianceService;
  let streamingService: StreamingService;
  let unitComplianceDimRepository: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        EmissionsComplianceService,
        {
          provide: UnitComplianceDimRepository,
          useFactory: mockUnitComplianceDimRepository,
        },
        {
          provide: StreamingService,
          useFactory: mockStreamingService,
        },
      ],
    }).compile();

    emissionsComplianceService = module.get(EmissionsComplianceService);
    unitComplianceDimRepository = module.get(UnitComplianceDimRepository);
    streamingService = module.get(StreamingService);
    req = mockRequest();
    req.res.setHeader.mockReturnValue();
  });

  describe('streamEmissionsCompliance', () => {
    it('streams all emissions compliance data', async () => {
      unitComplianceDimRepository.buildQuery.mockReturnValue(['', []]);
      let filters = new StreamEmissionsComplianceParamsDTO();

      req.headers.accept = '';

      let result = await emissionsComplianceService.streamEmissionsCompliance(
        req,
        filters,
      );

      expect(result).toEqual(new StreamableFile(Buffer.from('stream')));
    });
  });
});
