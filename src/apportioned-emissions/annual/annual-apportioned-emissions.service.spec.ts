import { Test } from '@nestjs/testing';
import { StreamableFile } from '@nestjs/common';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { StreamingService } from '../../streaming/streaming.service';
import { AnnualUnitDataRepository } from './annual-unit-data.repository';
import { AnnualApportionedEmissionsService } from './annual-apportioned-emissions.service';
import { AnnualApportionedEmissionsParamsDTO } from '../../dto/annual-apportioned-emissions.params.dto';

jest.mock('uuid', () => {
  return { v4: jest.fn().mockReturnValue(0) };
});

const mockRepository = () => ({
  buildQuery: jest.fn(),
  buildStateAggregationQuery: jest.fn(),
  buildFacilityAggregationQuery: jest.fn(),
  buildNationalAggregationQuery: jest.fn(),
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

describe('-- Annual Apportioned Emissions Service --', () => {
  let service: AnnualApportionedEmissionsService;
  let streamingService: StreamingService;
  let repository: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        AnnualApportionedEmissionsService,
        {
          provide: AnnualUnitDataRepository,
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
    service = module.get(AnnualApportionedEmissionsService);
    streamingService = module.get(StreamingService);
    repository = module.get(AnnualUnitDataRepository);
  });

  describe('streamEmissions', () => {
    it('calls streamEmissions() and streams all emissions from the service', async () => {
      repository.buildQuery.mockResolvedValue(['', []]);

      let filters = new AnnualApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissions(req, filters);

      expect(result).toEqual(new StreamableFile(Buffer.from('stream')));
    });
  });

  describe('streamEmissionsFacilityAggregation', () => {
    it('calls streamEmissionsFacilityAggregation() and streams all emissions from the service', async () => {
      repository.buildFacilityAggregationQuery.mockReturnValue(['', []]);

      let filters = new AnnualApportionedEmissionsParamsDTO();

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

      let filters = new AnnualApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissionsStateAggregation(req, filters);

      expect(result).toEqual(new StreamableFile(Buffer.from('stream')));
    });
  });

  describe('streamEmissionsNationalAggregation', () => {
    it('calls streamEmissionsNationalAggregation() and streams all emissions from the service', async () => {
      repository.buildNationalAggregationQuery.mockReturnValue(['', []]);

      let filters = new AnnualApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissionsNationalAggregation(
        req,
        filters,
      );

      expect(result).toEqual(new StreamableFile(Buffer.from('stream')));
    });
  });
});
