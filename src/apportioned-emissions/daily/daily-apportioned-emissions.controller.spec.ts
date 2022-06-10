import { Test } from '@nestjs/testing';
import { StreamableFile } from '@nestjs/common';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { StreamingModule } from '../../streaming/streaming.module';
import { DayUnitDataRepository } from './day-unit-data.repository';
import { DailyApportionedEmissionsService } from './daily-apportioned-emissions.service';
import { DailyApportionedEmissionsController } from './daily-apportioned-emissions.controller';
import { DailyApportionedEmissionsParamsDTO } from '../../dto/daily-apportioned-emissions.params.dto';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Daily Apportioned Emissions Controller --', () => {
  let controller: DailyApportionedEmissionsController;
  let service: DailyApportionedEmissionsService;
  let req: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, StreamingModule],
      controllers: [DailyApportionedEmissionsController],
      providers: [DayUnitDataRepository, DailyApportionedEmissionsService],
    }).compile();

    controller = module.get(DailyApportionedEmissionsController);
    service = module.get(DailyApportionedEmissionsService);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* streamEmissions', () => {
    it('should call the service and return all daily emissions', async () => {
      const expectedResult = new StreamableFile(Buffer.from('stream'));
      const paramsDto = new DailyApportionedEmissionsParamsDTO();
      jest.spyOn(service, 'streamEmissions').mockResolvedValue(expectedResult);
      expect(await controller.streamEmissions(req, paramsDto)).toBe(
        expectedResult,
      );
    });
  });

  describe('* streamEmissionsFacilityAggregation', () => {
    it('should call the service and return all daily emissions aggregated by facility', async () => {
      const expectedResult = new StreamableFile(Buffer.from('stream'));
      const paramsDto = new DailyApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'streamEmissionsFacilityAggregation')
        .mockResolvedValue(expectedResult);
      expect(
        await controller.streamEmissionsFacilityAggregation(req, paramsDto),
      ).toBe(expectedResult);
    });
  });

  describe('* streamEmissionsStateAggregation', () => {
    it('should call the service and return all daily emissions aggregated by state', async () => {
      const expectedResult = new StreamableFile(Buffer.from('stream'));
      const paramsDto = new DailyApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'streamEmissionsStateAggregation')
        .mockResolvedValue(expectedResult);
      expect(
        await controller.streamEmissionsStateAggregation(req, paramsDto),
      ).toBe(expectedResult);
    });
  });

  describe('* streamEmissionsNationalAggregation', () => {
    it('should call the service and return all daily emissions aggregated nationally', async () => {
      const expectedResult = new StreamableFile(Buffer.from('stream'));
      const paramsDto = new DailyApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'streamEmissionsNationalAggregation')
        .mockResolvedValue(expectedResult);
      expect(
        await controller.streamEmissionsNationalAggregation(req, paramsDto),
      ).toBe(expectedResult);
    });
  });
});
