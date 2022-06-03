import { Test } from '@nestjs/testing';
import { StreamableFile } from '@nestjs/common';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { StreamingModule } from '../../streaming/streaming.module';
import { MonthUnitDataRepository } from './month-unit-data.repository';
import { MonthlyApportionedEmissionsService } from './monthly-apportioned-emissions.service';
import { MonthlyApportionedEmissionsController } from './monthly-apportioned-emissions.controller';
import { MonthlyApportionedEmissionsParamsDTO } from '../../dto/monthly-apportioned-emissions.params.dto';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Monthly Apportioned Emissions Controller --', () => {
  let controller: MonthlyApportionedEmissionsController;
  let service: MonthlyApportionedEmissionsService;
  let req: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, StreamingModule],
      controllers: [MonthlyApportionedEmissionsController],
      providers: [MonthlyApportionedEmissionsService, MonthUnitDataRepository],
    }).compile();

    controller = module.get(MonthlyApportionedEmissionsController);
    service = module.get(MonthlyApportionedEmissionsService);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* streamEmissions', () => {
    it('should return test 1', async () => {
      const expectedResult = new StreamableFile(Buffer.from('stream'));
      const paramsDto = new MonthlyApportionedEmissionsParamsDTO();
      jest.spyOn(service, 'streamEmissions').mockResolvedValue(expectedResult);
      expect(await controller.streamEmissions(req, paramsDto)).toBe(
        expectedResult,
      );
    });
  });

  describe('streamEmissionsFacilityAggregation endpoint', () => {
    it('should return test 1', async () => {
      const expectedResult = new StreamableFile(Buffer.from('stream'));
      const paramsDto = new MonthlyApportionedEmissionsParamsDTO();
      jest.spyOn(service, 'streamEmissionsFacilityAggregation').mockResolvedValue(expectedResult);
      expect(await controller.streamEmissionsFacilityAggregation(req, paramsDto)).toBe(
        expectedResult,
      );
    });
  });

  describe('streamEmissionsStateAggregation endpoint', () => {
    it('should return test 1', async () => {
      const expectedResult = new StreamableFile(Buffer.from('stream'));
      const paramsDto = new MonthlyApportionedEmissionsParamsDTO();
      jest.spyOn(service, 'streamEmissionsStateAggregation').mockResolvedValue(expectedResult);
      expect(await controller.streamEmissionsStateAggregation(req, paramsDto)).toBe(
        expectedResult,
      );
    });
  });

  describe('streamEmissionsNationalAggregation endpoint', () => {
    it('should return test 1', async () => {
      const expectedResult = new StreamableFile(Buffer.from('stream'));
      const paramsDto = new MonthlyApportionedEmissionsParamsDTO();
      jest.spyOn(service, 'streamEmissionsNationalAggregation').mockResolvedValue(expectedResult);
      expect(await controller.streamEmissionsNationalAggregation(req, paramsDto)).toBe(
        expectedResult,
      );
    });
  });

});
