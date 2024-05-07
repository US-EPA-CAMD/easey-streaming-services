import { StreamableFile } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EntityManager } from 'typeorm';

import { HourlyApportionedEmissionsParamsDTO } from '../../dto/hourly-apportioned-emissions.params.dto';
import { StreamingModule } from '../../streaming/streaming.module';
import { HourUnitDataRepository } from './hour-unit-data.repository';
import { HourlyApportionedEmissionsController } from './hourly-apportioned-emissions.controller';
import { HourlyApportionedEmissionsService } from './hourly-apportioned-emissions.service';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Hourly Apportioned Emissions Controller --', () => {
  let controller: HourlyApportionedEmissionsController;
  let service: HourlyApportionedEmissionsService;
  let req: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, StreamingModule],
      controllers: [HourlyApportionedEmissionsController],
      providers: [
        EntityManager,
        HourlyApportionedEmissionsService,
        HourUnitDataRepository,
      ],
    }).compile();

    controller = module.get(HourlyApportionedEmissionsController);
    service = module.get(HourlyApportionedEmissionsService);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* streamEmissions', () => {
    it('should call the service and return all hourly emissions', async () => {
      const expectedResult = new StreamableFile(Buffer.from('stream'));
      const paramsDto = new HourlyApportionedEmissionsParamsDTO();
      jest.spyOn(service, 'streamEmissions').mockResolvedValue(expectedResult);
      expect(await controller.streamEmissions(req, paramsDto)).toBe(
        expectedResult,
      );
    });
  });

  describe('streamEmissionsFacilityAggregation endpoint', () => {
    it('should call the service and return all hourly emissions aggregated by facility', async () => {
      const expectedResult = new StreamableFile(Buffer.from('stream'));
      const paramsDto = new HourlyApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'streamEmissionsFacilityAggregation')
        .mockResolvedValue(expectedResult);
      expect(
        await controller.streamEmissionsFacilityAggregation(req, paramsDto),
      ).toBe(expectedResult);
    });
  });

  describe('streamEmissionsStateAggregation endpoint', () => {
    it('should call the service and return all hourly emissions aggregated by state', async () => {
      const expectedResult = new StreamableFile(Buffer.from('stream'));
      const paramsDto = new HourlyApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'streamEmissionsStateAggregation')
        .mockResolvedValue(expectedResult);
      expect(
        await controller.streamEmissionsStateAggregation(req, paramsDto),
      ).toBe(expectedResult);
    });
  });

  describe('streamEmissionsNationalAggregation endpoint', () => {
    it('should call the service and return all hourly emissions aggregated nationally', async () => {
      const expectedResult = new StreamableFile(Buffer.from('stream'));
      const paramsDto = new HourlyApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'streamEmissionsNationalAggregation')
        .mockResolvedValue(expectedResult);
      expect(
        await controller.streamEmissionsNationalAggregation(req, paramsDto),
      ).toBe(expectedResult);
    });
  });
});
