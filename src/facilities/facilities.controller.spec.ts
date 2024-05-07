import { StreamableFile } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EntityManager } from 'typeorm';

import { StreamFacilityAttributesParamsDTO } from '../dto/facility-attributes-params.dto';
import { StreamingModule } from '../streaming/streaming.module';
import { FacilitiesController } from './facilities.controller';
import { FacilitiesService } from './facilities.service';
import { FacilityUnitAttributesRepository } from './facility-unit-attributes.repository';

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
        EntityManager,
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
    it('should call the service and return all facility unit attributes ', async () => {
      const expectedResult = new StreamableFile(Buffer.from('stream'));
      const paramsDTO = new StreamFacilityAttributesParamsDTO();
      jest
        .spyOn(facilitiesService, 'streamAttributes')
        .mockResolvedValue(expectedResult);
      expect(await facilitiesController.streamAttributes(req, paramsDTO)).toBe(
        expectedResult,
      );
    });
  });
});
