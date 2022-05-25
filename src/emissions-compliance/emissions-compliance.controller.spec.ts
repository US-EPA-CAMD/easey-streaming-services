import { Test } from '@nestjs/testing';
import { State } from '@us-epa-camd/easey-common/enums';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { StreamableFile } from '@nestjs/common';

import { EmissionsComplianceController } from './emissions-compliance.controller';
import { AllowanceComplianceService } from '../allowance-compliance/allowance-compliance.service';
import { AccountComplianceDimRepository } from '../allowance-compliance/account-compliance-dim.repository';
import { EmissionsComplianceService } from './emissions-compliance.service';
import { StreamEmissionsComplianceParamsDTO } from '../dto/emissions-compliance.params.dto';
import { UnitComplianceDimRepository } from './unit-compliance-dim.repository';
import { StreamModule } from '@us-epa-camd/easey-common/stream';

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

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, StreamModule],
      controllers: [EmissionsComplianceController],
      providers: [
        AllowanceComplianceService,
        EmissionsComplianceService,
        AccountComplianceDimRepository,
        UnitComplianceDimRepository,
      ],
    }).compile();

    emissionsComplianceController = module.get(EmissionsComplianceController);
    allowanceComplianceService = module.get(AllowanceComplianceService);
    emissionsComplianceService = module.get(EmissionsComplianceService);
  });

  describe('* streamEmissionsCompliance', () => {
    const req: any = mockRequest('');
    req.res.setHeader.mockReturnValue();

    it('should call the service and return all emissions compliance data ', async () => {
      const expectedResults: StreamableFile = undefined;
      const paramsDTO = new StreamEmissionsComplianceParamsDTO();
      jest
        .spyOn(emissionsComplianceService, 'streamEmissionsCompliance')
        .mockResolvedValue(expectedResults);
      expect(
        await emissionsComplianceController.streamEmissionsCompliance(
          req,
          paramsDTO,
        ),
      ).toBe(expectedResults);
    });
  });
});
