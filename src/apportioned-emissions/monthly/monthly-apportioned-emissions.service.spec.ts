import { Test } from '@nestjs/testing';
import { StreamableFile } from '@nestjs/common';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonthUnitDataRepository } from './month-unit-data.repository';
import { MonthlyApportionedEmissionsService } from './monthly-apportioned-emissions.service';

import { MonthlyApportionedEmissionsParamsDTO } from '../../dto/monthly-apportioned-emissions.params.dto';
import { ConfigService } from '@nestjs/config';
import { StreamingService } from '../../streaming/streaming.service';

jest.mock('uuid', () => {
  return { v4: jest.fn().mockReturnValue(0) };
});

const mockRepository = () => ({
  getEmissions: jest.fn(),
  getStreamQuery: jest.fn(),
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

const mockStream = {
  pipe: jest.fn().mockReturnValue({
    pipe: jest.fn().mockReturnValue(Buffer.from('stream')),
  }),
};

describe('-- Monthly Apportioned Emissions Service --', () => {
  let service: MonthlyApportionedEmissionsService;
  let repository: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        {
          provide: StreamingService,
          useFactory: () => ({
            getStream: () => {
              return mockStream;
            },
          }),
        },
        ConfigService,
        MonthlyApportionedEmissionsService,
        {
          provide: MonthUnitDataRepository,
          useFactory: mockRepository,
        },
      ],
    }).compile();

    req = mockRequest();
    req.res.setHeader.mockReturnValue();
    service = module.get(MonthlyApportionedEmissionsService);
    repository = module.get(MonthUnitDataRepository);
  });

  describe('streamEmissions', () => {
    it('calls MonthlyUnitDataRepository.streamEmissions() and streams all emissions from the repository', async () => {
      repository.getStreamQuery.mockResolvedValue('');

      let filters = new MonthlyApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissions(req, filters);

      expect(result).toEqual(
        new StreamableFile(Buffer.from('stream'), {
          type: req.headers.accept,
          disposition: `attachment; filename="monthly-emissions-${0}.json"`,
        }),
      );
    });
  });
});
