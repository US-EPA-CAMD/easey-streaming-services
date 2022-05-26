import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { EmissionsComplianceService } from './emissions-compliance.service';
import { UnitComplianceDimRepository } from './unit-compliance-dim.repository';
import { StreamEmissionsComplianceParamsDTO } from '../dto/emissions-compliance.params.dto';
import { StreamService } from '@us-epa-camd/easey-common/stream';
import { StreamableFile } from '@nestjs/common';

const mockUnitComplianceDimRepository = () => ({
  getEmissionsCompliance: jest.fn(),
  streamEmissionsCompliance: jest.fn(),
  getAllApplicableEmissionsComplianceAttributes: jest.fn(),
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

describe('-- Emissions Compliance Service --', () => {
  let emissionsComplianceService;
  let unitComplianceDimRepository;
  let emissionsComplianceMap;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        EmissionsComplianceService,
        {
          provide: StreamService,
          useFactory: () => ({
            getStream: () => {
              return mockStream;
            },
          }),
        },
        {
          provide: UnitComplianceDimRepository,
          useFactory: mockUnitComplianceDimRepository,
        },
      ],
    }).compile();

    emissionsComplianceService = module.get(EmissionsComplianceService);
    unitComplianceDimRepository = module.get(UnitComplianceDimRepository);
    req = mockRequest();
    req.res.setHeader.mockReturnValue();
  });

  describe('streamEmissionsCompliance', () => {
    it('streams all emissions compliance data', async () => {
      unitComplianceDimRepository.getStreamQuery.mockResolvedValue('');

      let filters = new StreamEmissionsComplianceParamsDTO();

      req.headers.accept = '';

      let result = await emissionsComplianceService.streamEmissionsCompliance(
        req,
        filters,
      );

      expect(result).toEqual(
        new StreamableFile(Buffer.from('stream'), {
          type: req.headers.accept,
          disposition: `attachment; filename="emissions-compliance-${0}.json"`,
        }),
      );
    });
  });
});
