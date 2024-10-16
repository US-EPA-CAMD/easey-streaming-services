import { StreamableFile } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EntityManager } from 'typeorm';

import { HourlyMatsApportionedEmissionsParamsDTO } from '../../../dto/hourly-mats-apporitioned-emissions.params.dto';
import { StreamingModule } from '../../../streaming/streaming.module';
import { HourUnitMatsDataRepository } from './hour-unit-mats-data.repository';
import { HourlyMatsApportionedEmissionsController } from './hourly-mats-apportioned-emissions.controller';
import { HourlyMatsApportionedEmissionsService } from './hourly-mats-apportioned-emissions.service';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Hourly MATS Apportioned Emissions Controller --', () => {
  let controller: HourlyMatsApportionedEmissionsController;
  let service: HourlyMatsApportionedEmissionsService;
  let req: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, StreamingModule],
      controllers: [HourlyMatsApportionedEmissionsController],
      providers: [
        EntityManager,
        HourlyMatsApportionedEmissionsService,
        HourUnitMatsDataRepository,
      ],
    }).compile();

    controller = module.get(HourlyMatsApportionedEmissionsController);
    service = module.get(HourlyMatsApportionedEmissionsService);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* streamEmissions', () => {
    it('should call the service and return all hourly MATS emissions', async () => {
      const expectedResult = new StreamableFile(Buffer.from('stream'));
      const paramsDto = new HourlyMatsApportionedEmissionsParamsDTO();
      jest.spyOn(service, 'streamEmissions').mockResolvedValue(expectedResult);
      expect(await controller.streamEmissions(req, paramsDto)).toBe(
        expectedResult,
      );
    });
  });
});
