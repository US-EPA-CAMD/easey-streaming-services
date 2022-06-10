import { Test } from '@nestjs/testing';
import { StreamableFile } from '@nestjs/common';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { OzoneUnitDataRepository } from './ozone-unit-data.repository';
import { OzoneApportionedEmissionsService } from './ozone-apportioned-emissions.service';

import { OzoneApportionedEmissionsParamsDTO } from '../../dto/ozone-apportioned-emissions.params.dto';
import { StreamService } from '@us-epa-camd/easey-common/stream';
import { ConfigService } from '@nestjs/config';
import { StreamingService } from '../../streaming/streaming.service';

jest.mock('uuid', () => {
  return { v4: jest.fn().mockReturnValue(0) };
});

const mockRepository = () => ({
  buildQuery: jest.fn(),
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

describe('-- Ozone Apportioned Emissions Service --', () => {
  let service: OzoneApportionedEmissionsService;
  let streamingService: StreamingService;
  let repository: any;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        ConfigService,
        OzoneApportionedEmissionsService,
        {
          provide: OzoneUnitDataRepository,
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
    service = module.get(OzoneApportionedEmissionsService);
    streamingService = module.get(StreamingService);
    repository = module.get(OzoneUnitDataRepository);
  });

  describe('streamEmissions', () => {
    it('calls OzoneUnitDataRepository.streamEmissions() and streams all emissions from the repository', async () => {
      repository.buildQuery.mockReturnValue(['', []]);

      let filters = new OzoneApportionedEmissionsParamsDTO();

      req.headers.accept = '';

      let result = await service.streamEmissions(req, filters);

      expect(result).toEqual(new StreamableFile(Buffer.from('stream')));
    });
  });
});
