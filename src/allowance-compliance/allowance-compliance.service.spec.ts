import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { AccountComplianceDimRepository } from './account-compliance-dim.repository';
import { AllowanceComplianceService } from './allowance-compliance.service';
import { StreamAllowanceComplianceParamsDTO } from '../dto/allowance-compliance.params.dto';
import { StreamService } from '@us-epa-camd/easey-common/stream';
import { StreamableFile } from '@nestjs/common';

const mockAccountComplianceDimRepository = () => ({
  getAllowanceCompliance: jest.fn(),
  getAllApplicableAllowanceComplianceAttributes: jest.fn(),
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

describe('-- Allowance Compliance Service --', () => {
  let allowanceComplianceService;
  let accountComplianceDimRepository;
  let ownerYearDimRepository;
  let allowanceComplianceMap;
  let applicableAllowanceComplianceAttributesMap;

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
          provide: StreamService,
          useFactory: () => ({
            getStream: () => {
              return mockStream;
            },
          }),
        },
      ],
    }).compile();

    allowanceComplianceService = module.get(AllowanceComplianceService);
    accountComplianceDimRepository = module.get(AccountComplianceDimRepository);
    req = mockRequest();
    req.res.setHeader.mockReturnValue();
  });

  describe('streamAllowanceCompliance', () => {
    it('streams allowance compliance', async () => {
      accountComplianceDimRepository.getStreamQuery.mockResolvedValue('');

      let filters = new StreamAllowanceComplianceParamsDTO();

      req.headers.accept = '';
      req.on = jest.fn().mockResolvedValue('');

      let result = await allowanceComplianceService.streamAllowanceCompliance(
        req,
        filters,
      );

      expect(result).toEqual(
        new StreamableFile(Buffer.from('stream'), {
          type: req.headers.accept,
          disposition: `attachment; filename="allowance-compliance-${0}.json"`,
        }),
      );
    });
  });
});
