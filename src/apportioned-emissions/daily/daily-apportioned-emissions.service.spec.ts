import { Test } from '@nestjs/testing';
import { StreamableFile } from '@nestjs/common';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { StreamingService } from '../../streaming/streaming.service';
import { DayUnitDataRepository } from './day-unit-data.repository';
import { DailyApportionedEmissionsService } from './daily-apportioned-emissions.service';
import { DailyApportionedEmissionsParamsDTO } from '../../dto/daily-apportioned-emissions.params.dto';

jest.mock('uuid', () => {
  return { v4: jest.fn().mockReturnValue(0) };
});

const mockRepository = () => ({
  buildQuery: jest.fn(),
  buildFacilityAggregationQuery: jest.fn(),
  buildStateAggregationQuery: jest.fn(),
  buildNationalAggregationQuery: jest.fn(),
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

describe('-- Daily Apportioned Emissions Service --', () => {
  let streamingService: StreamingService;
  let service: DailyApportionedEmissionsService;
  let repository: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        DailyApportionedEmissionsService,
        {
          provide: DayUnitDataRepository,
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
    service = module.get(DailyApportionedEmissionsService);
    repository = module.get(DayUnitDataRepository);
    streamingService = module.get(StreamingService);
  });

  describe('streamEmissions', () => {
    it('calls streamEmissions() and streams all emissions from the repository', async () => {
      repository.buildQuery.mockReturnValue(['', []]);

      let filters = new DailyApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissions(req, filters);

      expect(result).toEqual(new StreamableFile(Buffer.from('stream')));
    });
  });

  describe('streamEmissionsFacilityAggregation', () => {
    it('calls streamEmissionsFacilityAggregation() and streams all emissions from the repository', async () => {
      repository.buildFacilityAggregationQuery.mockReturnValue(['', []]);

      let filters = new DailyApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissionsFacilityAggregation(
        req,
        filters,
      );

      expect(result).toEqual(new StreamableFile(Buffer.from('stream')));
    });
  });

  describe('streamEmissionsStateAggregation', () => {
    it('calls streamEmissionsStateAggregation() and streams all emissions from the repository', async () => {
      repository.buildStateAggregationQuery.mockReturnValue(['', []]);

      let filters = new DailyApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissionsStateAggregation(req, filters);

      expect(result).toEqual(new StreamableFile(Buffer.from('stream')));
    });
  });

  describe('streamEmissionsNationalAggregation', () => {
    it('calls streamEmissionsNationalAggregation() and streams all emissions from the repository', async () => {
      repository.buildNationalAggregationQuery.mockReturnValue(['', []]);

      let filters = new DailyApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissionsNationalAggregation(
        req,
        filters,
      );

      expect(result).toEqual(new StreamableFile(Buffer.from('stream')));
    });
  });
});
