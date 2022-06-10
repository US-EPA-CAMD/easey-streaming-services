import { Test } from '@nestjs/testing';

import { StreamableFile } from '@nestjs/common';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { FacilitiesService } from './facilities.service';
import { FacilityUnitAttributesRepository } from './facility-unit-attributes.repository';
import { StreamFacilityAttributesParamsDTO } from '../dto/facility-attributes-params.dto';
import { StreamingService } from '../streaming/streaming.service';

const mockRequest = (url?: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
    headers: {
      accept: 'text/csv',
    },
    on: jest.fn(),
  };
};

const mockStreamingService = () => ({
  getStream: jest
    .fn()
    .mockResolvedValue(new StreamableFile(Buffer.from('stream'))),
});

jest.mock('uuid', () => {
  return { v4: jest.fn().mockReturnValue(0) };
});

const mockFua = () => ({
  buildQuery: jest.fn(),
  lastArchivedYear: jest.fn(),
});

describe('-- Facilities Service --', () => {
  let facilitiesService: FacilitiesService;
  let streamingService: StreamingService;
  let facilityUnitAttributesRepository: any;
  let req: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        FacilitiesService,
        {
          provide: FacilityUnitAttributesRepository,
          useFactory: mockFua,
        },
        {
          provide: StreamingService,
          useFactory: mockStreamingService,
        },
      ],
    }).compile();

    facilitiesService = module.get(FacilitiesService);
    streamingService = module.get(StreamingService);
    facilityUnitAttributesRepository = module.get(
      FacilityUnitAttributesRepository,
    );

    req = mockRequest();
    req.res.setHeader.mockReturnValue();
  });

  describe('streamAttributes', () => {
    it('streams all facility unit attributes', async () => {
      facilityUnitAttributesRepository.buildQuery.mockReturnValue(['', []]);

      let filters = new StreamFacilityAttributesParamsDTO();

      req.headers.accept = '';

      let result = await facilitiesService.streamAttributes(req, filters);

      expect(result).toEqual(new StreamableFile(Buffer.from('stream')));
    });
  });
});
