import { Repository } from 'typeorm';
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

const mockStream = {
  pipe: jest.fn().mockReturnValue({
    pipe: jest.fn().mockReturnValue(Buffer.from('stream')),
  }),
};

jest.mock('uuid', () => {
  return { v4: jest.fn().mockReturnValue(0) };
});

const mockFua = () => ({
  buildQuery: jest.fn(),
  lastArchivedYear: jest.fn(),
});

let req: any;

describe('-- Facilities Service --', () => {
  let facilitiesService: FacilitiesService;
  let facilityUnitAttributesRepository: FacilityUnitAttributesRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        FacilitiesService,
        {
          provide: StreamingService,
          useFactory: () => ({
            getStream: () => {
              return mockStream;
            },
          }),
        },
        {
          provide: FacilityUnitAttributesRepository,
          useFactory: mockFua,
        },
      ],
    }).compile();

    facilitiesService = module.get(FacilitiesService);
    facilityUnitAttributesRepository = module.get(
      FacilityUnitAttributesRepository,
    );

    req = mockRequest();
    req.res.setHeader.mockReturnValue();
  });

  describe('streamAttributes', () => {
    it('streams all facility unit attributes', async () => {
      facilityUnitAttributesRepository.buildQuery.mockResolvedValue([], '');

      let filters = new StreamFacilityAttributesParamsDTO();

      req.headers.accept = '';

      let result = await facilitiesService.streamAttributes(
        req,
        filters,
      );

      expect(result).toEqual(
        new StreamableFile(Buffer.from('stream'), {
          type: req.headers.accept,
          disposition: `attachment; filename="facility-attributes-${0}.json"`,
        }),
      );
    });
  });
});

// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn(),
    findAndCount: jest.fn(),
  }),
);

export type MockType<T> = {
  [P in keyof T]: jest.Mock<{}>;
};