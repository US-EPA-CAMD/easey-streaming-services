import { Test } from '@nestjs/testing';
import { StreamableFile } from '@nestjs/common';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { QuarterUnitDataRepository } from './quarter-unit-data.repository';
import { QuarterlyApportionedEmissionsService } from './quarterly-apportioned-emissions.service';

import { QuarterlyApportionedEmissionsParamsDTO } from '../../dto/quarterly-apportioned-emissions.params.dto';
import { StreamingService } from '../../streaming/streaming.service';

jest.mock('uuid', () => {
  return { v4: jest.fn().mockReturnValue(0) };
});

const mockRepository = () => ({
  buildQuery: jest.fn(),
  buildFacilityAggregationQuery: jest.fn(),
  buildStateAggregationQuery: jest.fn(),
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

const mockStreamingService = () => ({
  getStream: jest
    .fn()
    .mockResolvedValue(new StreamableFile(Buffer.from('stream'))),
});

describe('-- Quarterly Apportioned Emissions Service --', () => {
  let service: QuarterlyApportionedEmissionsService;
  let streamingService: StreamingService;
  let repository: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        QuarterlyApportionedEmissionsService,
        {
          provide: QuarterUnitDataRepository,
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
    service = module.get(QuarterlyApportionedEmissionsService);
    streamingService = module.get(StreamingService);
    repository = module.get(QuarterUnitDataRepository);
  });

  describe('streamEmissions', () => {
    it('calls QuarterlyUnitDataRepository.streamEmissions() and streams all emissions from the repository', async () => {
      repository.buildQuery.mockReturnValue(['', []]);
      let filters = new QuarterlyApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissions(req, filters);

      expect(result).toEqual(new StreamableFile(Buffer.from('stream')));
    });
  });

  describe('streamEmissionsFacilityAggregation', () => {
    it('calls streamEmissionsFacilityAggregation() and streams all emissions from the service', async () => {
      repository.buildFacilityAggregationQuery.mockReturnValue(['', []]);

      let filters = new QuarterlyApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissionsFacilityAggregation(
        req,
        filters,
      );

      expect(result).toEqual(new StreamableFile(Buffer.from('stream')));
    });
  });

  describe('streamEmissionsStateAggregation', () => {
    it('calls streamEmissionsStateAggregation() and streams all emissions from the service', async () => {
      repository.buildStateAggregationQuery.mockReturnValue(['', []]);

      let filters = new QuarterlyApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissionsStateAggregation(req, filters);

      expect(result).toEqual(new StreamableFile(Buffer.from('stream')));
    });
  });
});
