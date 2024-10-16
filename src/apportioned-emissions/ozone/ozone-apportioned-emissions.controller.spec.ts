import { StreamableFile } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EntityManager } from 'typeorm';

import { OzoneApportionedEmissionsParamsDTO } from '../../dto/ozone-apportioned-emissions.params.dto';
import { StreamingModule } from '../../streaming/streaming.module';
import { OzoneApportionedEmissionsController } from './ozone-apportioned-emissions.controller';
import { OzoneApportionedEmissionsService } from './ozone-apportioned-emissions.service';
import { OzoneUnitDataRepository } from './ozone-unit-data.repository';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Ozone Apportioned Emissions Controller --', () => {
  let controller: OzoneApportionedEmissionsController;
  let service: OzoneApportionedEmissionsService;
  let req: any;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, StreamingModule],
      controllers: [OzoneApportionedEmissionsController],
      providers: [
        EntityManager,
        OzoneApportionedEmissionsService,
        OzoneUnitDataRepository,
      ],
    }).compile();

    controller = module.get(OzoneApportionedEmissionsController);
    service = module.get(OzoneApportionedEmissionsService);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* streamEmissions', () => {
    it('should call the service and return all ozone emissions', async () => {
      const expectedResult = new StreamableFile(Buffer.from('stream'));
      const paramsDto = new OzoneApportionedEmissionsParamsDTO();
      jest.spyOn(service, 'streamEmissions').mockResolvedValue(expectedResult);
      expect(await controller.streamEmissions(req, paramsDto)).toBe(
        expectedResult,
      );
    });
  });

  describe('* streamEmissionsFacilityAggregation', () => {
    it('should call the service and return all Ozone emissions aggregated by facility', async () => {
      const expectedResult = new StreamableFile(Buffer.from('stream'));
      const paramsDto = new OzoneApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'streamEmissionsFacilityAggregation')
        .mockResolvedValue(expectedResult);
      expect(
        await controller.streamEmissionsFacilityAggregation(req, paramsDto),
      ).toBe(expectedResult);
    });
  });

  describe('* streamEmissionsStateAggregation', () => {
    it('should call the service and return all Ozone emissions aggregated by state', async () => {
      const expectedResult = new StreamableFile(Buffer.from('stream'));
      const paramsDto = new OzoneApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'streamEmissionsStateAggregation')
        .mockResolvedValue(expectedResult);
      expect(
        await controller.streamEmissionsStateAggregation(req, paramsDto),
      ).toBe(expectedResult);
    });
  });

  describe('* streamEmissionsNationalAggregation', () => {
    it('should call the service and return all Ozone emissions aggregated by national', async () => {
      const expectedResult = new StreamableFile(Buffer.from('stream'));
      const paramsDto = new OzoneApportionedEmissionsParamsDTO();
      jest
        .spyOn(service, 'streamEmissionsNationalAggregation')
        .mockResolvedValue(expectedResult);
      expect(
        await controller.streamEmissionsNationalAggregation(req, paramsDto),
      ).toBe(expectedResult);
    });
  });
});
