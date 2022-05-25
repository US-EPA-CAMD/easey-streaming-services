import { Test } from '@nestjs/testing';
import { StreamableFile } from '@nestjs/common';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { FacilitiesController } from './facilities.controller';
import { FacilitiesService } from './facilities.service';
import { StreamFacilityAttributesParamsDTO } from '../dto/facility-attributes-params.dto';
import { FacilityUnitAttributesRepository } from './facility-unit-attributes.repository';

import { StreamingModule } from '../streaming/streaming.module';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Facilities Controller --', () => {
  let facilitiesController: FacilitiesController;
  let facilitiesService: FacilitiesService;
  let req: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, StreamingModule],
      controllers: [FacilitiesController],
      providers: [
        FacilitiesService,
        FacilityUnitAttributesRepository,
      ],
    }).compile();

    facilitiesController = module.get(FacilitiesController);
    facilitiesService = module.get(FacilitiesService);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* streamAttributes', () => {
    it('should call the service and return facilites ', async () => {
      const expectedResults: StreamableFile = undefined;
      const paramsDTO = new StreamFacilityAttributesParamsDTO();
      jest
        .spyOn(facilitiesService, 'streamAttributes')
        .mockResolvedValue(expectedResults);
      expect(
        await facilitiesController.streamAttributes(
          req,
          paramsDTO,
        ),
      ).toBe(expectedResults);
    });
  });
});