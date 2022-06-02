import { Test } from '@nestjs/testing';
import { Module, StreamableFile } from '@nestjs/common';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsService } from './hourly-apportioned-emissions.service';

import { HourlyApportionedEmissionsParamsDTO } from '../../dto/hourly-apportioned-emissions.params.dto';
import { ConfigService } from '@nestjs/config';
import { StreamingService } from './../../streaming/streaming.service';

jest.mock('uuid', () => {
  return { v4: jest.fn().mockReturnValue(0) };
});

const mockRepository = () => ({
  getEmissions: jest.fn(),
  buildQuery: jest.fn(),
  getFacilityStreamQuery: jest.fn(),
  getStateStreamQuery: jest.fn(),
  getNationalStreamQuery: jest.fn(),
});

const mockStreamingService = () => ({
  getStream: jest.fn().mockResolvedValue((new StreamableFile(Buffer.from('stream'))))
})

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

describe('-- Hourly Apportioned Emissions Service --', () => {
  let service: HourlyApportionedEmissionsService;
  let streamingService: StreamingService;
  let repository: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        ConfigService,
        HourlyApportionedEmissionsService,
        {
          provide: HourUnitDataRepository,
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
    service = module.get(HourlyApportionedEmissionsService);
    streamingService = module.get(StreamingService);
    repository = module.get(HourUnitDataRepository);
  });

  describe('streamEmissions', () => {
    it('calls HourlyUnitDataRepository.streamEmissions() and streams all emissions from the repository', async () => {
      repository.buildQuery.mockReturnValue(["", []]);
      let filters = new HourlyApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissions(req, filters);

      expect(result).toEqual(
        new StreamableFile(Buffer.from('stream')),
      );
    });
  });

  describe('streamEmissionsFacilityAggregation', () => {
    it('calls HourlyUnitDataRepository.getFacilityStreamQuery() and streams all emissions from the repository', async () => {
      repository.getFacilityStreamQuery.mockReturnValue(["", []]);

      let filters = new HourlyApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissionsFacilityAggregation(req, filters);
      
      expect(result).toEqual(
        new StreamableFile(Buffer.from('stream')),
      );  

    });
  });

  describe('streamEmissionsStateAggregation', () => {
    it('calls HourlyUnitDataRepository.getStateStreamQuery() and streams all emissions from the repository', async () => {
      repository.getStateStreamQuery.mockReturnValue(["", []]);

      let filters = new HourlyApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissionsStateAggregation(req, filters);

      expect(result).toEqual(
        new StreamableFile(Buffer.from('stream')),
      );
    });
  });

  describe('streamEmissionsNationalAggregation', () => {
    it('calls HourlyUnitDataRepository.getNationalStreamQuery() and streams all emissions from the repository', async () => {
      repository.getNationalStreamQuery.mockReturnValue(["", []]);

      let filters = new HourlyApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissionsNationalAggregation(req, filters);

      expect(result).toEqual(
        new StreamableFile(Buffer.from('stream')),
      );
    });
  });
});
