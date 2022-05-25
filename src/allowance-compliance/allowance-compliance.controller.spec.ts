import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { StreamableFile } from '@nestjs/common';

import { AccountComplianceDimRepository } from './account-compliance-dim.repository';
import { AllowanceComplianceController } from './allowance-compliance.controller';
import { AllowanceComplianceService } from './allowance-compliance.service';
import { StreamAllowanceComplianceParamsDTO } from '../dto/allowance-compliance.params.dto';
import { StreamModule } from '@us-epa-camd/easey-common/stream';

const mockRequest = (url: string) => {
  return {
    url,
    res: {
      setHeader: jest.fn(),
    },
  };
};

describe('-- Allowance Compliance Controller --', () => {
  let allowanceComplianceController: AllowanceComplianceController;
  let allowanceComplianceService: AllowanceComplianceService;
  let req: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, StreamModule],
      controllers: [AllowanceComplianceController],
      providers: [AllowanceComplianceService, AccountComplianceDimRepository],
    }).compile();

    allowanceComplianceController = module.get(AllowanceComplianceController);
    allowanceComplianceService = module.get(AllowanceComplianceService);
    req = mockRequest('');
    req.res.setHeader.mockReturnValue();
  });

  describe('* streamAllowanceCompliance', () => {
    const req: any = mockRequest('');
    req.res.setHeader.mockReturnValue();

    it('should call the service and return all allowance compliance data ', async () => {
      const expectedResults: StreamableFile = undefined;
      const paramsDTO = new StreamAllowanceComplianceParamsDTO();
      jest
        .spyOn(allowanceComplianceService, 'streamAllowanceCompliance')
        .mockResolvedValue(expectedResults);
      expect(
        await allowanceComplianceService.streamAllowanceCompliance(
          req,
          paramsDTO,
        ),
      ).toBe(expectedResults);
    });
  });
});
