import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
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

describe('-- Daily Apportioned Emissions Service --', () => {
  let service: DailyApportionedEmissionsService;
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
        DailyApportionedEmissionsService,
        {
          provide: DayUnitDataRepository,
          useFactory: mockRepository,
        },
      ],
    }).compile();

    req = mockRequest();
    req.res.setHeader.mockReturnValue();
    service = module.get(DailyApportionedEmissionsService);
    repository = module.get(DayUnitDataRepository);
  });

  describe('streamEmissions', () => {
    it('calls DailyUnitDataRepository.streamEmissions() and streams all emissions from the repository', async () => {
      repository.getStreamQuery.mockResolvedValue('');

      let filters = new DailyApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissions(req, filters);

      expect(result).toEqual(
        new StreamableFile(Buffer.from('stream'), {
          type: req.headers.accept,
          disposition: `attachment; filename="daily-emissions-${0}.json"`,
        }),
      );
    });
  });

  // describe('streamEmissionsFacilityAggregation', () => {
  //   it('calls DailyUnitDataRepository.getFacilityStreamQuery() and streams all emissions from the repository', async () => {
  //     repository.getFacilityStreamQuery.mockResolvedValue('');

  //     let filters = new DailyApportionedEmissionsParamsDTO();

  //     req.headers.accept = '';

  //     let result = await service.streamEmissionsFacilityAggregation(req, filters);

  //     expect(result).toEqual(
  //       new StreamableFile(Buffer.from('stream'), {
  //         type: req.headers.accept,
  //         disposition: `attachment; filename="daily-emissions-facility-aggregation-${0}.json"`,
  //       }),
  //     );
  //   });
  // });

  // describe('streamEmissionsStateAggregation', () => {
  //   it('calls DailyUnitDataRepository.getStateStreamQuery() and streams all emissions from the repository', async () => {
  //     repository.getStateStreamQuery.mockResolvedValue('');

  //     let filters = new DailyApportionedEmissionsParamsDTO();

  //     req.headers.accept = '';

  //     let result = await service.streamEmissionsStateAggregation(req, filters);

  //     expect(result).toEqual(
  //       new StreamableFile(Buffer.from('stream'), {
  //         type: req.headers.accept,
  //         disposition: `attachment; filename="daily-emissions-state-aggregation-${0}.json"`,
  //       }),
  //     );
  //   });
  // });

  // describe('streamEmissionsNationalAggregation', () => {
  //   it('calls DailyUnitDataRepository.getNationalStreamQuery() and streams all emissions from the repository', async () => {
  //     repository.getNationalStreamQuery.mockResolvedValue('');

  //     let filters = new DailyApportionedEmissionsParamsDTO();

  //     req.headers.accept = '';

  //     let result = await service.streamEmissionsNationalAggregation(req, filters);

  //     expect(result).toEqual(
  //       new StreamableFile(Buffer.from('stream'), {
  //         type: req.headers.accept,
  //         disposition: `attachment; filename="daily-emissions-national-aggregation-${0}.json"`,
  //       }),
  //     );
  //   });
  // });
});
