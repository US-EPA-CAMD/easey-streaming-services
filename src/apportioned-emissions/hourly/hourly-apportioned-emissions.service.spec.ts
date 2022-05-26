import { Test } from '@nestjs/testing';
import { StreamableFile } from '@nestjs/common';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsService } from './hourly-apportioned-emissions.service';

import { HourlyApportionedEmissionsParamsDTO } from '../../dto/hourly-apportioned-emissions.params.dto';
import { ConfigService } from '@nestjs/config';
import { StreamService } from '@us-epa-camd/easey-common/stream';

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

describe('-- Hourly Apportioned Emissions Service --', () => {
  let service: HourlyApportionedEmissionsService;
  let repository: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        {
          provide: StreamService,
          useFactory: () => ({
            getStream: () => {
              return mockStream;
            },
          }),
        },
        ConfigService,
        HourlyApportionedEmissionsService,
        {
          provide: HourUnitDataRepository,
          useFactory: mockRepository,
        },
      ],
    }).compile();

    req = mockRequest();
    req.res.setHeader.mockReturnValue();
    service = module.get(HourlyApportionedEmissionsService);
    repository = module.get(HourUnitDataRepository);
  });

  describe('streamEmissions', () => {
    it('calls HourlyUnitDataRepository.streamEmissions() and streams all emissions from the repository', async () => {
      repository.getStreamQuery.mockResolvedValue('');

      let filters = new HourlyApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissions(req, filters);

      expect(result).toEqual(
        new StreamableFile(Buffer.from('stream'), {
          type: req.headers.accept,
          disposition: `attachment; filename="hourly-emissions-${0}.json"`,
        }),
      );
    });
  });

  // describe('streamEmissionsFacilityAggregation', () => {
  //   it('calls HourlyUnitDataRepository.getFacilityStreamQuery() and streams all emissions from the repository', async () => {
  //     repository.getFacilityStreamQuery.mockResolvedValue('');

  //     let filters = new HourlyApportionedEmissionsParamsDTO();

  //     req.headers.accept = '';

  //     let result = await service.streamEmissionsFacilityAggregation(req, filters);

  //     expect(result).toEqual(
  //       new StreamableFile(Buffer.from('stream'), {
  //         type: req.headers.accept,
  //         disposition: `attachment; filename="hourly-emissions-facility-aggregation-${0}.json"`,
  //       }),
  //     );
  //   });
  // });

  // describe('streamEmissionsStateAggregation', () => {
  //   it('calls HourlyUnitDataRepository.getStateStreamQuery() and streams all emissions from the repository', async () => {
  //     repository.getStateStreamQuery.mockResolvedValue('');

  //     let filters = new HourlyApportionedEmissionsParamsDTO();

  //     req.headers.accept = '';

  //     let result = await service.streamEmissionsStateAggregation(req, filters);

  //     expect(result).toEqual(
  //       new StreamableFile(Buffer.from('stream'), {
  //         type: req.headers.accept,
  //         disposition: `attachment; filename="hourly-emissions-state-aggregation-${0}.json"`,
  //       }),
  //     );
  //   });
  // });

  // describe('streamEmissionsNationalAggregation', () => {
  //   it('calls HourlyUnitDataRepository.getNationalStreamQuery() and streams all emissions from the repository', async () => {
  //     repository.getNationalStreamQuery.mockResolvedValue('');

  //     let filters = new HourlyApportionedEmissionsParamsDTO();

  //     req.headers.accept = '';

  //     let result = await service.streamEmissionsNationalAggregation(req, filters);

  //     expect(result).toEqual(
  //       new StreamableFile(Buffer.from('stream'), {
  //         type: req.headers.accept,
  //         disposition: `attachment; filename="hourly-emissions-national-aggregation-${0}.json"`,
  //       }),
  //     );
  //   });
  // });
});
