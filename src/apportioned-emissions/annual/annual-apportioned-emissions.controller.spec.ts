import { Test } from '@nestjs/testing';
import { StreamableFile } from '@nestjs/common';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { StreamingModule } from '../../streaming/streaming.module';
import { AnnualUnitDataRepository } from './annual-unit-data.repository';
import { AnnualApportionedEmissionsService } from './annual-apportioned-emissions.service';
import { AnnualApportionedEmissionsController } from './annual-apportioned-emissions.controller';
import { AnnualApportionedEmissionsParamsDTO } from '../../dto/annual-apportioned-emissions.params.dto';

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
      providers: [AnnualApportionedEmissionsService, AnnualUnitDataRepository],
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
