import { Test } from '@nestjs/testing';
import { StreamableFile } from '@nestjs/common';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { MonthUnitDataRepository } from './month-unit-data.repository';
import { MonthlyApportionedEmissionsService } from './monthly-apportioned-emissions.service';

import { MonthlyApportionedEmissionsParamsDTO } from '../../dto/monthly-apportioned-emissions.params.dto';
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

describe('-- Monthly Apportioned Emissions Service --', () => {
  let service: MonthlyApportionedEmissionsService;
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

  // describe('streamEmissionsFacilityAggregation', () => {
  //   it('calls MonthUnitDataRepository.getFacilityStreamQuery() and streams all emissions from the repository', async () => {
  //     repository.getFacilityStreamQuery.mockResolvedValue('');

  //     let filters = new MonthlyApportionedEmissionsParamsDTO();

  //     req.headers.accept = '';

  //     let result = await service.streamEmissionsFacilityAggregation(
  //       req,
  //       filters,
  //     );

  //     expect(result).toEqual(
  //       new StreamableFile(Buffer.from('stream'), {
  //         type: req.headers.accept,
  //         disposition: `attachment; filename="monthly-emissions-facility-aggregation-${0}.json"`,
  //       }),
  //     );
  //   });
  // });

  // describe('streamEmissionsStateAggregation', () => {
  //   it('calls MonthUnitDataRepository.getStateStreamQuery() and streams all emissions from the repository', async () => {
  //     repository.getStateStreamQuery.mockResolvedValue('');

  //     let filters = new MonthlyApportionedEmissionsParamsDTO();

  //     req.headers.accept = '';

  //     let result = await service.streamEmissionsStateAggregation(req, filters);

  //     expect(result).toEqual(
  //       new StreamableFile(Buffer.from('stream'), {
  //         type: req.headers.accept,
  //         disposition: `attachment; filename="monthly-emissions-state-aggregation-${0}.json"`,
  //       }),
  //     );
  //   });
  // });

  // describe('streamEmissionsNationalAggregation', () => {
  //   it('calls MonthUnitDataRepository.getNationalStreamQuery() and streams all emissions from the repository', async () => {
  //     repository.getNationalStreamQuery.mockResolvedValue('');

  //     let filters = new MonthlyApportionedEmissionsParamsDTO();

  //     req.headers.accept = '';

  //     let result = await service.streamEmissionsNationalAggregation(
  //       req,
  //       filters,
  //     );

  //     expect(result).toEqual(
  //       new StreamableFile(Buffer.from('stream'), {
  //         type: req.headers.accept,
  //         disposition: `attachment; filename="monthly-emissions-national-aggregation-${0}.json"`,
  //       }),
  //     );
  //   });
  // });
});
