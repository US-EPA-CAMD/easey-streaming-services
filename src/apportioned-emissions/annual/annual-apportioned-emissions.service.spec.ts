import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
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

describe('-- Annual Apportioned Emissions Service --', () => {
  let service: AnnualApportionedEmissionsService;
  let repository: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        ConfigService,
        AnnualApportionedEmissionsService,
        {
          provide: StreamingService,
          useFactory: () => ({
            getStream: () => {
              return mockStream;
            },
          }),
        },
        {
          provide: AnnualUnitDataRepository,
          useFactory: mockRepository,
        },
      ],
    }).compile();

    req = mockRequest();
    req.res.setHeader.mockReturnValue();
    service = module.get(AnnualApportionedEmissionsService);
    repository = module.get(AnnualUnitDataRepository);
  });

  describe('streamEmissions', () => {
    it('calls AnnualUnitDataRepository.streamEmissions() and streams all emissions from the repository', async () => {
      repository.getStreamQuery.mockResolvedValue('');
      
      let filters = new AnnualApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissions(req, filters);

      expect(result).toEqual(
        new StreamableFile(Buffer.from('stream'), {
          type: req.headers.accept,
          disposition: `attachment; filename="annual-emissions-${0}.json"`,
        }),
      );
    });
  });

  // describe('streamEmissionsFacilityAggregation', () => {
  //   it('calls AnnualUnitDataRepository.getFacilityStreamQuery() and streams all emissions from the repository', async () => {
  //     repository.getFacilityStreamQuery.mockResolvedValue('');

  //     let filters = new AnnualApportionedEmissionsParamsDTO();

  //     req.headers.accept = '';

  //     let result = await service.streamEmissionsFacilityAggregation(
  //       req,
  //       filters,
  //     );

  //     expect(result).toEqual(
  //       new StreamableFile(Buffer.from('stream'), {
  //         type: req.headers.accept,
  //         disposition: `attachment; filename="annual-emissions-facility-aggregation-${0}.json"`,
  //       }),
  //     );
  //   });
  // });
});
