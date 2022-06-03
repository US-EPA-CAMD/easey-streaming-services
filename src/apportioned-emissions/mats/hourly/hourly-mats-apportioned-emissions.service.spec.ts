import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { StreamableFile } from '@nestjs/common';

import { HourlyMatsApportionedEmissionsService } from './hourly-mats-apportioned-emissions.service';
import { HourUnitMatsDataRepository } from './hour-unit-mats-data.repository';
import { HourlyMatsApportionedEmissionsParamsDTO } from '../../../dto/hourly-mats-apporitioned-emissions.params.dto';
import { StreamingService } from '../../../streaming/streaming.service';

jest.mock('uuid', () => {
  return { v4: jest.fn().mockReturnValue(0) };
});

const mockRepository = () => ({
  buildQuery: jest.fn(),
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

describe('-- Hourly MATS Apportioned Emissions Service --', () => {
  let service: HourlyMatsApportionedEmissionsService;
  let streamingService: StreamingService;
  let repository: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        HourlyMatsApportionedEmissionsService,
        {
          provide: HourUnitMatsDataRepository,
          useFactory: mockRepository,
        },
        {
          provide: StreamingService,
          useFactory: mockStreamingService,
        },
      ],
    }).compile();

    req = mockRequest();
    req.res.setHeader.mockReturnValue();
    service = module.get(HourlyMatsApportionedEmissionsService);
    streamingService = module.get(StreamingService);
    repository = module.get(HourUnitMatsDataRepository);
  });

  describe('streamEmissions', () => {
    it('calls streamEmissions() and streams all emissions from the service', async () => {
      repository.buildQuery.mockReturnValue(['', []]);
      let filters = new HourlyMatsApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissions(req, filters);

      expect(result).toEqual(new StreamableFile(Buffer.from('stream')));
    });
  });
});
