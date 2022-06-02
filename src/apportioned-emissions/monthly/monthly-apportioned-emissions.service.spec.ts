import { Test } from '@nestjs/testing';
import { StreamableFile } from '@nestjs/common';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonthUnitDataRepository } from './month-unit-data.repository';
import { MonthlyApportionedEmissionsService } from './monthly-apportioned-emissions.service';

import { MonthlyApportionedEmissionsParamsDTO } from '../../dto/monthly-apportioned-emissions.params.dto';
import { ConfigService } from '@nestjs/config';
import { StreamingService } from './../../streaming/streaming.service';

jest.mock('uuid', () => {
  return { v4: jest.fn().mockReturnValue(0) };
});

const mockRepository = () => ({
  getEmissions: jest.fn(),
  buildQuery: jest.fn(),
  buildFacilityAggregationQuery: jest.fn(),
  buildStateAggregationQuery: jest.fn(),
  buildNationalAggregationQuery: jest.fn(),
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

describe('MonthlyApportionedEmissionsService', () => {
  let service: MonthlyApportionedEmissionsService;
  let streamingService: StreamingService;
  let repository: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        ConfigService,
        MonthlyApportionedEmissionsService,
        {
          provide: MonthUnitDataRepository,
          useFactory: mockRepository,
        },
        {
          provide: StreamingService,
          useFactory: mockStreamingService,
        }
      ],
    }).compile();

    req = mockRequest();
    req.res.setHeader.mockReturnValue();
    service = module.get(MonthlyApportionedEmissionsService);
    streamingService = module.get(StreamingService);
    repository = module.get(MonthUnitDataRepository);
  });

  describe('streamEmissions', () => {
    it('calls streamEmissions() and streams all emissions from the service', async () => {
      repository.buildQuery.mockResolvedValue(["", []]);

      let filters = new MonthlyApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissions(req, filters);

      expect(result).toEqual(
        new StreamableFile(Buffer.from('stream')),
      );
    });
  });

  describe('streamEmissionsFacilityAggregation', () => {
    it('calls streamEmissionsFacilityAggregation() and streams all emissions from the service', async () => {
      repository.buildFacilityAggregationQuery.mockReturnValue(["", []]);
      let filters = new MonthlyApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissionsFacilityAggregation(req, filters);
      
      expect(result).toEqual(
        new StreamableFile(Buffer.from('stream')),
      );  

    });
  });

  describe('streamEmissionsStateAggregation', () => {
    it('calls streamEmissionsStateAggregation() and streams all emissions from the service', async () => {
      repository.buildStateAggregationQuery.mockReturnValue(["", []]);

      let filters = new MonthlyApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissionsStateAggregation(req, filters);

      expect(result).toEqual(
        new StreamableFile(Buffer.from('stream')),
      );
    });
  });

  describe('streamEmissionsNationalAggregation', () => {
    it('calls streamEmissionsNationalAggregation() and streams all emissions from the service', async () => {
      repository.buildNationalAggregationQuery.mockReturnValue(["", []]);

      let filters = new MonthlyApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissionsNationalAggregation(req, filters);

      expect(result).toEqual(
        new StreamableFile(Buffer.from('stream')),
      );
    });
  });
});
