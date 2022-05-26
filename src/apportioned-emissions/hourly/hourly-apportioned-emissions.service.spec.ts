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
});
