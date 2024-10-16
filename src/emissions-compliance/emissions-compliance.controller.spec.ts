import { StreamableFile } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EntityManager } from 'typeorm';

import { AccountComplianceDimRepository } from '../allowance-compliance/account-compliance-dim.repository';
import { AllowanceComplianceService } from '../allowance-compliance/allowance-compliance.service';
import { StreamEmissionsComplianceParamsDTO } from '../dto/emissions-compliance.params.dto';
import { StreamingModule } from '../streaming/streaming.module';
import { EmissionsComplianceController } from './emissions-compliance.controller';
import { EmissionsComplianceService } from './emissions-compliance.service';
import { UnitComplianceDimRepository } from './unit-compliance-dim.repository';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Emissions Compliance Controller --', () => {
  let emissionsComplianceController: EmissionsComplianceController;
  let allowanceComplianceService: AllowanceComplianceService;
  let emissionsComplianceService: EmissionsComplianceService;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, StreamingModule],
      controllers: [EmissionsComplianceController],
      providers: [
        AllowanceComplianceService,
        EmissionsComplianceService,
        EntityManager,
        AccountComplianceDimRepository,
        UnitComplianceDimRepository,
      ],
    }).compile();

    emissionsComplianceController = module.get(EmissionsComplianceController);
    allowanceComplianceService = module.get(AllowanceComplianceService);
    emissionsComplianceService = module.get(EmissionsComplianceService);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('* streamEmissionsCompliance', () => {
    it('should call the service and return all emission compliance data', async () => {
      const expectedResult = new StreamableFile(Buffer.from('stream'));
      const paramsDTO = new StreamEmissionsComplianceParamsDTO();
      jest
        .spyOn(emissionsComplianceService, 'streamEmissionsCompliance')
        .mockResolvedValue(expectedResult);
      expect(
        await emissionsComplianceController.streamEmissionsCompliance(
          req,
          paramsDTO,
        ),
      ).toBe(expectedResult);
    });
  });
});
