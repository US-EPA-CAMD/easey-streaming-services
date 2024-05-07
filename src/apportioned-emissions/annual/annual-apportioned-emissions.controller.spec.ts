import { StreamableFile } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EntityManager } from 'typeorm';

import { AnnualApportionedEmissionsParamsDTO } from '../../dto/annual-apportioned-emissions.params.dto';
import { StreamingModule } from '../../streaming/streaming.module';
import { AnnualApportionedEmissionsController } from './annual-apportioned-emissions.controller';
import { AnnualApportionedEmissionsService } from './annual-apportioned-emissions.service';
import { AnnualUnitDataRepository } from './annual-unit-data.repository';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Annual Apportioned Emissions Controller --', () => {
  let controller: AnnualApportionedEmissionsController;
  let service: AnnualApportionedEmissionsService;
  let req: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, StreamingModule],
      controllers: [AnnualApportionedEmissionsController],
      providers: [
        AnnualApportionedEmissionsService,
        AnnualUnitDataRepository,
        EntityManager,
      ],
    }).compile();

    controller = module.get(AnnualApportionedEmissionsController);
    service = module.get(AnnualApportionedEmissionsService);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* streamEmissions', () => {
    it('should call the service and return all annual emissions ', async () => {
      const expectedResult = new StreamableFile(Buffer.from('stream'));
      const paramsDto = new AnnualApportionedEmissionsParamsDTO();
      jest.spyOn(service, 'streamEmissions').mockResolvedValue(expectedResult);
      expect(await controller.streamEmissions(req, paramsDto)).toBe(
        expectedResult,
      );
    });
  });

  describe('* streamEmissionsFacilityAggregation', () => {
    it('should call the service and return all annual emissions aggregated by facility', async () => {
      const expectedResult = new StreamableFile(Buffer.from('stream'));
      const paramsDto = new AnnualApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'streamEmissionsFacilityAggregation')
        .mockResolvedValue(expectedResult);
      expect(
        await controller.streamEmissionsFacilityAggregation(req, paramsDto),
      ).toBe(expectedResult);
    });
  });

  describe('* streamEmissionsStateAggregation', () => {
    it('should call the service and return all annual emissions aggregated by state', async () => {
      const expectedResult = new StreamableFile(Buffer.from('stream'));
      const paramsDto = new AnnualApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'streamEmissionsStateAggregation')
        .mockResolvedValue(expectedResult);
      expect(
        await controller.streamEmissionsStateAggregation(req, paramsDto),
      ).toBe(expectedResult);
    });
  });

  describe('streamEmissionsNationalAggregation endpoint', () => {
    it('should call the service and return all annual emissions aggregated nationally', async () => {
      const expectedResult = new StreamableFile(Buffer.from('stream'));
      const paramsDto = new AnnualApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'streamEmissionsNationalAggregation')
        .mockResolvedValue(expectedResult);
      expect(
        await controller.streamEmissionsNationalAggregation(req, paramsDto),
      ).toBe(expectedResult);
    });
  });
});
